import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Slider from "@/models/Slider";

// PUT: Update a specific slide
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const updatedSlide = await Slider.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedSlide) {
      return NextResponse.json({ success: false, message: "Slide not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedSlide }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}

// DELETE: Remove a specific slide
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deletedSlide = await Slider.findByIdAndDelete(id);
    
    if (!deletedSlide) {
      return NextResponse.json({ success: false, message: "Slide not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Slide deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
  }
}