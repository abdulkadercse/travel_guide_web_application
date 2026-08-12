import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password cannot be empty"),
  }),
});

const refreshTokenValidationSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }),
  }),
});

export const authValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
};
