import { z } from "zod"

export const UserRoleEnum = z.enum(["USER", "GARDENER"])
export const RoleEnum = z.union([UserRoleEnum, z.enum(["ADMIN", "SUPERADMIN"])])
export type UserRole = z.infer<typeof UserRoleEnum>
export type Role = z.infer<typeof RoleEnum>

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address1: z.string().min(5, "Address must be at least 5 characters"),
  address2: z.string().nullable().optional(),
  pincode: z.string().regex(/^\d{4,10}$/, "Invalid pincode"),
  role: UserRoleEnum.default("USER"),
  age: z.number().min(18).nullable().optional(),
  hourlyRate: z.number().min(0).nullable().optional(),
})

export const CreateUserSchema = UserSchema.omit({
  id: true,
})

