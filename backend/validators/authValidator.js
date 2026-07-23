const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(50),
  email: z.string().email({ message: 'Please provide a valid email address' }),
  password: passwordSchema,
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
  password: passwordSchema,
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
