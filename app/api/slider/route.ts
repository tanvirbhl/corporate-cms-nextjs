import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Slider from "@/models/Slider";

export async function GET() {
  try {
    await connectToDatabase();
    const slides = await Slider.find({ isActive: true }).sort({ sortOrder: 1 });
    return NextResponse.json({ success: true, data: slides }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newSlide = await Slider.create(body);
    return NextResponse.json({ success: true, data: newSlide }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}