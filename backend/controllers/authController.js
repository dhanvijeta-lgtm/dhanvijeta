const crypto = require('crypto');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const response = require('../helpers/response');

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
};

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    
    return response.success(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
          isVerified: user.isVerified
        }
      },
      'Registration successful! Please check your email to verify your account.',
      201
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return response.success(
      res,
      {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
          profilePicture: user.profilePicture,
          streakCount: user.streakCount,
          isVerified: user.isVerified
        }
      },
      'Login successful'
    );
  } catch (error) {
    if (error.isUnverified) {
      return response.error(res, error.message, 403);
    }
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      return response.error(res, 'Refresh token not found', 401);
    }

    const { accessToken, refreshToken: newRefreshToken, user } = await authService.refreshAccessToken(token);

    res.cookie('refreshToken', newRefreshToken, getCookieOptions());

    return response.success(res, {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        profilePicture: user.profilePicture,
        streakCount: user.streakCount,
        isVerified: user.isVerified
      }
    }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    await authService.logoutUser(token);
    
    const cookieOpts = getCookieOptions();
    delete cookieOpts.maxAge;
    res.clearCookie('refreshToken', cookieOpts);
    return response.success(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return response.error(res, 'Verification token is required', 400);
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return response.error(res, 'Invalid or expired verification token', 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return response.success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    }, 'Email successfully verified! You can now log in.');
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.resendVerificationToken(email);
    return response.success(res, null, 'Verification email sent. Please check your inbox.');
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return response.success(res, null, 'If this email is registered, a password reset link has been sent.');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await emailService.sendResetPasswordEmail(user.email, resetToken);

    return response.success(res, null, 'If this email is registered, a password reset link has been sent.');
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const queryToken = req.query.token || token;

    if (!queryToken) {
      return response.error(res, 'Reset token is required', 400);
    }

    const user = await User.findOne({
      resetPasswordToken: queryToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return response.error(res, 'Invalid or expired reset token', 400);
    }

    user.password = password; // Pre-save hook hashes password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return response.success(res, null, 'Password reset successful! You can now log in with your new password.');
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return response.error(res, 'User not found', 404);
    }

    // Calculate streak logic
    const today = new Date();
    const lastActive = new Date(user.lastActiveDate || today);
    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      if (diffDays === 1 && today.getDate() !== lastActive.getDate()) {
        user.streakCount += 1;
        user.lastActiveDate = today;
        await user.save();
      }
    } else {
      user.streakCount = 1;
      user.lastActiveDate = today;
      await user.save();
    }

    const purchases = await Purchase.find({ userId: user._id, paymentStatus: 'completed' })
      .populate('courseId', 'title thumbnail duration');

    return response.success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        streakCount: user.streakCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      purchasedCoursesCount: purchases.length,
      purchasedCourses: purchases
    }, 'User profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, password, profilePicture } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return response.error(res, 'User not found', 404);
    }

    if (name) user.name = name;
    if (password) user.password = password;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    return response.success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified
      }
    }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { idToken, accessToken, credential, token } = req.body;
    console.log('[Google Auth Debug] Direct authentication request received:', {
      hasIdToken: !!idToken,
      hasCredential: !!credential,
      hasToken: !!token,
      hasAccessToken: !!accessToken
    });
    const { user, accessToken: tokenRes, refreshToken } = await authService.googleLoginUser({
      idToken: idToken || credential || token,
      accessToken,
      credential,
      token
    });

    res.cookie('refreshToken', refreshToken, getCookieOptions());

    console.log(`[Google Auth Debug] Authentication successful for user: ${user.email}`);

    return response.success(
      res,
      {
        accessToken: tokenRes,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          provider: user.provider,
          profilePicture: user.profilePicture,
          streakCount: user.streakCount,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      'Google authentication successful'
    );
  } catch (error) {
    console.error('[Google Auth Debug] googleAuth error:', error.message);
    next(error);
  }
};

const googleCallback = async (req, res, next) => {
  try {
    const { code, error } = req.query;
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

    if (error) {
      console.error('[Google Auth Debug] OAuth Callback error from Google:', error);
      return res.redirect(`${clientUrl}?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      console.error('[Google Auth Debug] OAuth Callback missing code param');
      return res.redirect(`${clientUrl}?error=MissingAuthorizationCode`);
    }

    console.log('[Google Auth Debug] OAuth Callback code exchange started');
    const { accessToken: token, refreshToken } = await authService.googleCallbackCodeExchange(code);

    res.cookie('refreshToken', refreshToken, getCookieOptions());

    console.log(`[Google Auth Debug] OAuth Callback successful. Redirecting to frontend: ${clientUrl}`);
    return res.redirect(`${clientUrl}?token=${token}`);
  } catch (error) {
    console.error('[Google Auth Debug] OAuth Callback exception:', error.message);
    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    return res.redirect(`${clientUrl}?error=${encodeURIComponent(error.message)}`);
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  googleCallback,
  refreshToken,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
};
