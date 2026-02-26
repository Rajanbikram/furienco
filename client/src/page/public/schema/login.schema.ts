import z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Email is invalid" }),
  password: z.string().nonempty({ message: "Password is required" }),
});
