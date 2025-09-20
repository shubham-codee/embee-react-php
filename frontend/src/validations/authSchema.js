import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be between 3 and 20 characters.")
    .max(20, "Username must be between 3 and 20 characters.")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    ),

  email: z.string().trim().email("Invalid email format."),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    .regex(/[0-9]/, "Password must include at least one number.")
    .regex(/[\W_]/, "Password must include at least one symbol."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." }),

  password: z.string().min(1, { message: "Password cannot be empty." }),
});
