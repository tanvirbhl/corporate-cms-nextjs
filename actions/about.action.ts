"use server";

import { connectToDatabase } from "@/lib/mongoose";
import About from "@/models/About";

export async function getAboutData() {
  try {
    await connectToDatabase();
    const about = await About.findOne().lean();
    return about ? JSON.parse(JSON.stringify(about)) : null;
  } catch (error) {
    console.error("Error fetching about data:", error);
    return null;
  }
}