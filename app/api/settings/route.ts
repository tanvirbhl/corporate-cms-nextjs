import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch the settings; we use findOne because there's only one global config
    const settings = await SiteSettings.findOne();
    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Upsert logic: Update the existing settings or create a new document if it doesn't exist
    const settings = await SiteSettings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });
    
    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update settings" }, { status: 500 });
  }
}