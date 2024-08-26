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

export const redditPostSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(21, {
      message: "Title must be at most 21 characters.",
    }),
  content: z.string(),
  imageUrl: z.string().optional(),
});

export type redditPostType = z.infer<typeof redditPostSchema>;
