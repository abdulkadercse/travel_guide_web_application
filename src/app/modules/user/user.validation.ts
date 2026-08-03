import { z } from 'zod';
import { UserRole, UserStatus } from './user.interface';

const createUserValidationSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }).min(2, 'Name must be at least 2 characters'),

  email: z.string({
    required_error: 'Email is required',
  }).email('Invalid email address'),

  phone: z.string().optional(),

  password: z.string({
    required_error: 'Password is required',
  }).min(6, 'Password must be at least 6 characters'),

  address: z.string().optional(),

  companyName: z.string().optional(),

  avatar: z.string().url('Avatar must be a valid URL').optional(),

  role: z.nativeEnum(UserRole).default(UserRole.USER),
});

const updateUserValidationSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
  address: z.string().optional(),
  companyName: z.string().optional(),
  avatar: z.string().url().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  isVerified: z.boolean().optional(),
});

export const userValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
