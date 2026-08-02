import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Notice from "@/models/Notice";

export async function GET() {
  try {
    await connectToDatabase();
    // Sort by newest first
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notices }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch notices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newNotice = await Notice.create(body);
    return NextResponse.json({ success: true, data: newNotice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create notice" }, { status: 500 });
  }
}