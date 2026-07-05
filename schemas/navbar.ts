import { z } from "zod";

export const subLinkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  href: z.string().min(1, "Href is required"),
});

export const navbarSchema = z.object({
  name: z.string().min(1, "Name is required"),
  href: z.string().min(1, "Href is required"),
  order: z.coerce.number(),
  isVisible: z.boolean().default(true),
  isCta: z.boolean().default(false),
  subLinks: z.array(subLinkSchema).optional().default([]), // <-- Added this
});

export type NavbarFormValues = z.infer<typeof navbarSchema>;