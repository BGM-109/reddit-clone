import { z } from "zod";

export const usernameFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(21, {
      message: "Username must be at most 21 characters.",
    }),
});

export type usernameFormType = z.infer<typeof usernameFormSchema>;
