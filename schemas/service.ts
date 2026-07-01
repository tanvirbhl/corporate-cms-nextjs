import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  icon: z.string().optional(), // You can store an icon name or emoji
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;