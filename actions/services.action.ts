"use server";

import { connectToDatabase } from "@/lib/mongoose";
import Service from "@/models/Service";

export async function getServices() {
  try {
    await connectToDatabase();
    const services = await Service.find().lean();
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    return [];
  }
}