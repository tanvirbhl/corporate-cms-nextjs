import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Service from "@/models/Service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await connectToDatabase();

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID missing" },
      { status: 400 },
    );
  }

  await Service.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
