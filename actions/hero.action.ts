"use server";

import { connectToDatabase } from "@/lib/mongoose";
import HeroBanner from "@/models/HeroBanner";

export async function getHeroBanner() {
  try {
    await connectToDatabase();
    const hero = await HeroBanner.findOne().lean();
    return hero ? JSON.parse(JSON.stringify(hero)) : null;
  } catch (error) {
    console.error("Error fetching hero banner:", error);
    return null;
  }
}