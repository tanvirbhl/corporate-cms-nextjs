import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Message from "@/models/Message";

// Fetch all messages, sorted by newest first
export async function GET() {
  try {
    await connectToDatabase();
    const messages = await Message.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch messages" }, { status: 500 });
  }
}