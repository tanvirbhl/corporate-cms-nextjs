import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Achievement from "@/models/Achievement";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const body = await req.json();
    const updated = await Achievement.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    await Achievement.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}