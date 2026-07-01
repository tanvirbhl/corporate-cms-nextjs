import { z } from "zod";

export const heroSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
  buttonText: z.string().min(2, "Button text is required"),
  buttonHref: z.string().min(1, "Link is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  isVisible: z.boolean().default(true),
});

export type HeroFormValues = z.infer<typeof heroSchema>;