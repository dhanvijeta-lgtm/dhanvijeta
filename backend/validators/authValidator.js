const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(50),
  email: z.string().email({ message: 'Please provide a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().optional(),
  acceptTerms: z.boolean().optional(),
  role: z.enum(['student', 'admin']).optional()
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address' })
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  token: z.string().optional()
});

const resendVerificationSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email address' })
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema
};
