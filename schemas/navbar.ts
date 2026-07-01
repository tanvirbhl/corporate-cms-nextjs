import { z } from "zod";

export const navbarSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Link name is required" })
    .max(50, { message: "Link name cannot exceed 50 characters" })
    .trim(),
  href: z
    .string()
    .min(1, { message: "URL/Href is required" })
    .trim(),
  order: z.coerce
    .number()
    .int()
    .min(0, { message: "Order must be 0 or greater" })
    .default(0),
  isVisible: z.boolean().default(true),
  isCta: z.boolean().default(false),
});

// Infer the TypeScript type from the Zod schema for form usage
export type NavbarFormValues = z.infer<typeof navbarSchema>;