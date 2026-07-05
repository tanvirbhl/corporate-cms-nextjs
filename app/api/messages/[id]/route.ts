import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Message from "@/models/Message";

// Update message status (e.g., mark as read or archived)
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const { status } = await req.json();
    
    const updatedMessage = await Message.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    return NextResponse.json({ success: true, data: updatedMessage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update status" }, { status: 500 });
  }
}

// Delete a message permanently
export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    await Message.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: "Message deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}