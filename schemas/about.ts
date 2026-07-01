import { z } from "zod";

export const aboutSchema = z.object({
  title: z.string().min(3, "Title is required"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  imageUrl: z.string().url("Valid image URL is required"),
});

export type AboutFormValues = z.infer<typeof aboutSchema>;