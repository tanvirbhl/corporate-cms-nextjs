import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import About from "@/models/About";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch the single About document
    let aboutData = await About.findOne();
    
    // If it doesn't exist yet, create an empty/default one
    if (!aboutData) {
      aboutData = await About.create({});
    }
    
    return NextResponse.json({ success: true, data: aboutData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch about data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Upsert: Update the first document it finds, or create it if none exists
    const updatedAbout = await About.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });
    
    return NextResponse.json({ success: true, data: updatedAbout }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update about data" }, { status: 500 });
  }
}