"use server";

import { connectToDatabase } from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export async function getSiteSettings() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne().lean();
    return settings ? JSON.parse(JSON.stringify(settings)) : null;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}