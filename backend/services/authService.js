const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    isVerified: false // We can mock verification token if SMTP is unset
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token in user document
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
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '48923631189-1gg32pij6ta55715ag4ij3bt15oi4cc9.apps.googleusercontent.com');

const googleLoginUser = async ({ idToken, accessToken }) => {
  if (!idToken && !accessToken) {
    throw new Error('Google authentication token is required');
  }

  let googleId, email, name;

  if (idToken) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID || '48923631189-1gg32pij6ta55715ag4ij3bt15oi4cc9.apps.googleusercontent.com'
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      name = payload.name;
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
    if (!user.isVerified) user.isVerified = true;
  } else {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      googleId,
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

module.exports = {
  registerUser,
  loginUser,
  googleLoginUser,
  refreshAccessToken,
  logoutUser,
  generateAccessToken,
  generateRefreshToken
};
