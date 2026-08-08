import { z } from "zod";

export const subLinkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  href: z.string().min(1, "Href is required"),
  isVisible: z.boolean().default(true), 
  order: z.coerce.number().default(0),
});

export const navbarSchema = z.object({
  name: z.string().min(1, "Name is required"),
  href: z.string().min(1, "Href is required"),
  order: z.coerce.number(),
  isVisible: z.boolean().default(true),
  isCta: z.boolean().default(false),
  subLinks: z.array(subLinkSchema).optional().default([]), 
});

export type NavbarFormValues = z.infer<typeof navbarSchema>;