import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import About from "@/models/About";

export async function GET() {
  try {
    await connectToDatabase();
    const about = await About.findOne();
    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    await About.deleteMany({}); // Keep only one "About" section
    const newAbout = await About.create(body);
    return NextResponse.json({ success: true, data: newAbout });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Save failed" }, { status: 500 });
  }
}