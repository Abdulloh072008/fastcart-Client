import { z } from 'zod'

// Login → LoginDto { userName, password }. The Figma labels the first field
// "Email or phone number", but the API authenticates by userName, so the value
// is sent as `userName` (it is whatever the user chose at registration).
export const loginSchema = z.object({
  userName: z.string().trim().min(1, 'This field is required'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginValues = z.infer<typeof loginSchema>

// Register → RegisterDto { userName, phoneNumber, email, password,
// confirmPassword }. The Figma shows a simplified 3-field form; we keep its
// visual style but include every field the API requires so registration works.
export const registerSchema = z
  .object({
    userName: z.string().trim().min(3, 'Name must be at least 3 characters'),
    email: z.string().trim().email('Enter a valid email'),
    phoneNumber: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number')
      .regex(/^[+\d][\d\s-]*$/, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterValues = z.infer<typeof registerSchema>
