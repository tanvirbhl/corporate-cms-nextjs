import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Notice from "@/models/Notice";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deletedNotice = await Notice.findByIdAndDelete(id);
    
    if (!deletedNotice) {
      return NextResponse.json({ success: false, message: "Notice not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Notice deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}