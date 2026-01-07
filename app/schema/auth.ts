import z, { email } from "zod";

export const SignUpFormSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(6).max(30),
});

export const SignInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(30),
});
