const crypto = require('crypto');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const authService = require('../services/authService');
const emailService = require('../services/emailService');
const response = require('../helpers/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    
    // Generate verification token
    const token = crypto.randomBytes(20).toString('hex');
    user.verificationToken = token;
    await user.save();

    // Trigger email send
    await emailService.sendVerificationEmail(user.email, token);

    return response.success(
      res,
      { id: user._id, name: user.name, email: user.email, role: user.role },
      'Registration successful. Please check your email to verify your account.',
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
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return response.success(
      res,
      {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          streakCount: user.streakCount,
          isVerified: user.isVerified
        }
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    // Attempt to pull refresh token from cookies, headers, or body
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      return response.error(res, 'Refresh token not found', 401);
    }

    const { accessToken, refreshToken: newRefreshToken, user } = await authService.refreshAccessToken(token);

    // Reset cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return response.success(res, {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streakCount: user.streakCount
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
    
    res.clearCookie('refreshToken');
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

    return response.success(res, null, 'Email successfully verified');
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Avoid revealing that user doesn't exist for security, but log it locally
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
    const { token } = req.query;
    const { password } = req.body;

    if (!token) {
      return response.error(res, 'Reset token is required', 400);
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return response.error(res, 'Invalid or expired reset token', 400);
    }

    user.password = password; // Pre-save hooks will handle hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return response.success(res, null, 'Password reset successful');
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
    const lastActive = new Date(user.lastActiveDate);
    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      // Active within last day, maintain or update streak
      if (diffDays === 1 && today.getDate() !== lastActive.getDate()) {
        user.streakCount += 1;
        user.lastActiveDate = today;
        await user.save();
      }
    } else {
      // Streak broken, reset
      user.streakCount = 1;
      user.lastActiveDate = today;
      await user.save();
    }

    // Fetch purchased details
    const purchases = await Purchase.find({ userId: user._id, paymentStatus: 'completed' })
      .populate('courseId', 'title thumbnail duration');

    return response.success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        streakCount: user.streakCount,
        createdAt: user.createdAt
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
    const { name, password } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (password) user.password = password; // Hashed in pre-save hook

    await user.save();

    return response.success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const { user, accessToken, refreshToken } = await authService.googleLoginUser(idToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return response.success(
      res,
      {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          streakCount: user.streakCount,
          isVerified: user.isVerified
        }
      },
      'Google authentication successful'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
};
