import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2, "Site name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
  }),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;