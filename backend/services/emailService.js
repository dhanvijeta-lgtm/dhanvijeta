const nodemailer = require('nodemailer');

const createTransporter = () => {
  const isMailConfigured = 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS;

  if (isMailConfigured) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

const sendVerificationEmail = async (email, token) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const verificationLink = `${clientUrl}/verify-email?token=${token}`;
  const transporter = createTransporter();

  if (transporter) {
    try {
      const mailOptions = {
        from: '"Dhan Vijeta EdTech" <support@dhanvijeta.com>',
        to: email,
        subject: 'Verify your Dhan Vijeta Account',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 215, 0, 0.2);">
            <h2 style="color: #ffd700; margin-top: 0;">Welcome to Dhan Vijeta!</h2>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Please click the button below to verify your email address and activate your stock market learning account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background: linear-gradient(135deg, #d97706, #eab308); color: #0b132b; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px;">Verify Account</a>
            </div>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">If the button above does not work, copy and paste this link into your browser:<br/><a href="${verificationLink}" style="color: #ffd700;">${verificationLink}</a></p>
            <p style="margin-top: 25px; font-size: 12px; color: #64748b; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px;">If you did not create a Dhan Vijeta account, please ignore this email.</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('[Email Service Error] Failed to send verification email:', err.message);
    }
  } else {
    console.log('----------------------------------------------------');
    console.log('--- EMAIL VERIFICATION FLOW (LOCAL DEVELOPMENT) ---');
    console.log(`To: ${email}`);
    console.log(`Verification Link: ${verificationLink}`);
    console.log('----------------------------------------------------');
  }
};

const sendResetPasswordEmail = async (email, token) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const resetLink = `${clientUrl}/reset-password?token=${token}`;
  const transporter = createTransporter();

  if (transporter) {
    try {
      const mailOptions = {
        from: '"Dhan Vijeta EdTech" <support@dhanvijeta.com>',
        to: email,
        subject: 'Reset Password - Dhan Vijeta',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 215, 0, 0.2);">
            <h2 style="color: #ffd700; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">You requested a password reset for your Dhan Vijeta account. Click the button below to choose a new password. This link is valid for 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: linear-gradient(135deg, #d97706, #eab308); color: #0b132b; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px;">Reset Password</a>
            </div>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">If the button above does not work, copy and paste this link into your browser:<br/><a href="${resetLink}" style="color: #ffd700;">${resetLink}</a></p>
            <p style="margin-top: 25px; font-size: 12px; color: #64748b; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px;">If you did not request a password reset, please ignore this email.</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('[Email Service Error] Failed to send password reset email:', err.message);
    }
  } else {
    console.log('----------------------------------------------------');
    console.log('--- PASSWORD RESET FLOW (LOCAL DEVELOPMENT) ---');
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('----------------------------------------------------');
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail
};
