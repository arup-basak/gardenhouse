import { create } from "domain";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .min(6, { message: "Passoword must be at least 6 characters long" }),
});



export { loginSchema };
