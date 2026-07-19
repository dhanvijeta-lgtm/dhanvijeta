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
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationLink = `${clientUrl}/verify-email?token=${token}`;
  const transporter = createTransporter();

  if (transporter) {
    const mailOptions = {
      from: '"Dhan Vijeta EdTech" <support@dhanvijeta.com>',
      to: email,
      subject: 'Verify your Dhan Vijeta Account',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #ffd700;">Welcome to Dhan Vijeta!</h2>
          <p>Please click the button below to verify your email address and activate your stock market learning journey.</p>
          <a href="${verificationLink}" style="background-color: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verify Account</a>
          <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">If you did not request this, please ignore this email.</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } else {
    console.log('--- EMAIL VERIFICATION FLOW (LOCAL DEVELOPMENT) ---');
    console.log(`To: ${email}`);
    console.log(`Link: ${verificationLink}`);
    console.log('----------------------------------------------------');
  }
};

const sendResetPasswordEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetLink = `${clientUrl}/reset-password?token=${token}`;
  const transporter = createTransporter();

  if (transporter) {
    const mailOptions = {
      from: '"Dhan Vijeta EdTech" <support@dhanvijeta.com>',
      to: email,
      subject: 'Reset Password - Dhan Vijeta',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b132b; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #ffd700;">Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to set a new password. The link is valid for 1 hour.</p>
          <a href="${resetLink}" style="background-color: #ef4444; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">If you did not request a password reset, please ignore this email.</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } else {
    console.log('--- PASSWORD RESET FLOW (LOCAL DEVELOPMENT) ---');
    console.log(`To: ${email}`);
    console.log(`Link: ${resetLink}`);
    console.log('------------------------------------------------');
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail
};
