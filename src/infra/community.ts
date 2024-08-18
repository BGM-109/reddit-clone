import { z } from "zod";

export const communitySchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(21, {
      message: "Name must be at most 21 characters.",
    }),
  description: z.string(),
});

export type communityType = z.infer<typeof communitySchema>;
