"use server";

import { connectToDatabase } from "@/lib/mongoose";
import NavbarLink from "@/models/NavbarLink";
import { INavbarLink } from "@/types/navbar";

// Local interface extending the base to include the MongoDB _id as a string
export interface NavbarLinkData extends INavbarLink {
  _id: string;
}

/**
 * Fetches all visible navbar links, sorted by their order.
 * This runs securely on the server.
 */
export async function getActiveNavbarLinks(): Promise<NavbarLinkData[]> {
  try {
    await connectToDatabase();
    
    // Only fetch links where isVisible is true, and sort them
    const links = await NavbarLink.find({ isVisible: true })
      .sort({ order: 1 })
      .lean(); // .lean() strips heavy Mongoose metadata, returning plain JavaScript objects

    // We must parse/stringify to safely pass MongoDB objects from Server to Client components
    return JSON.parse(JSON.stringify(links));
  } catch (error) {
    console.error("Failed to fetch active navbar links:", error);
    return []; // Return an empty array as a fallback so the UI doesn't crash
  }
}