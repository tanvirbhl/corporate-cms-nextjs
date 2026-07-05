import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Message from "@/models/Message";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newMessage = await Message.create({
      data: body,
      status: "unread",
    });

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    // This will now print the exact database error in your VS Code terminal!
    console.error("CONTACT API ERROR:", error.message || error);
    
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}