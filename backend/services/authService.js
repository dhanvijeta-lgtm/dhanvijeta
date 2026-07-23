const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('./emailService');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'supersecretjwtaccesskey12345',
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkey67890',
    { expiresIn: '7d' }
  );
};

const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User with this email already exists');
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    provider: 'email',
    isVerified: false,
    verificationToken
  });

  // Send verification email
  await emailService.sendVerificationEmail(user.email, verificationToken);

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // If user registered with email/password, verify password
  if (user.password) {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
  } else if (user.provider === 'google') {
    throw new Error('This account was created using Google. Please click "Continue with Google" to sign in.');
  }

  if (user.provider === 'email' && !user.isVerified) {
    const error = new Error('Please verify your email address before logging in. Check your inbox for the verification link.');
    error.isUnverified = true;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastActiveDate = new Date();
  await user.save();

  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (oldRefreshToken) => {
  try {
    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkey67890'
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;
  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
};

const { OAuth2Client } = require('google-auth-library');
const getGoogleClientId = () => process.env.GOOGLE_CLIENT_ID || '48923631189-1gg32pij6ta55715ag4ij3bt15oi4cc9.apps.googleusercontent.com';

const googleLoginUser = async ({ idToken, accessToken }) => {
  if (!idToken && !accessToken) {
    throw new Error('Google authentication token is required');
  }

  let googleId, email, name, picture;

  const clientId = getGoogleClientId();
  const googleClient = new OAuth2Client(clientId);

  if (idToken) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: clientId
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    } catch (verErr) {
      console.warn('Google ID token verification failed, checking access token fallback:', verErr.message);
    }
  }

  if (!email && accessToken) {
    try {
      const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
      if (res.ok) {
        const data = await res.json();
        googleId = data.sub;
        email = data.email;
        name = data.name;
        picture = data.picture;
      }
    } catch (fetchErr) {
      console.warn('Google userinfo fetch failed:', fetchErr.message);
    }
  }

  if (!email) {
    throw new Error('Google authentication failed: Could not verify Google user identity.');
  }

  const queryConditions = [];
  if (googleId) queryConditions.push({ googleId });
  if (email) queryConditions.push({ email });

  let user = queryConditions.length > 0 ? await User.findOne({ $or: queryConditions }) : null;

  if (user) {
    if (!user.googleId) user.googleId = googleId;
    if (picture && !user.profilePicture) user.profilePicture = picture;
    if (!user.isVerified) user.isVerified = true;
  } else {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      googleId,
      profilePicture: picture || '',
      provider: 'google',
      isVerified: true
    });
  }

  const newAccessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.lastActiveDate = new Date();
  await user.save();

  return { user, accessToken: newAccessToken, refreshToken };
};

const googleCallbackCodeExchange = async (code, customRedirectUri) => {
  const clientId = getGoogleClientId();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = customRedirectUri || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

  console.log('[Google Auth Debug] Initiating code exchange. Callback URL:', callbackUrl);

  const client = new OAuth2Client(clientId, clientSecret, callbackUrl);
  const { tokens } = await client.getToken(code);
  
  return await googleLoginUser({ idToken: tokens.id_token, accessToken: tokens.access_token });
};

const resendVerificationToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Return success silently for privacy
    return;
  }

  if (user.isVerified) {
    throw new Error('This account is already verified.');
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  await user.save();

  await emailService.sendVerificationEmail(user.email, verificationToken);
};

module.exports = {
  registerUser,
  loginUser,
  googleLoginUser,
  googleCallbackCodeExchange,
  refreshAccessToken,
  logoutUser,
  resendVerificationToken,
  generateAccessToken,
  generateRefreshToken
};
