import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Achievement from "@/models/Achievement";

export async function GET() {
  try {
    await connectToDatabase();
    const achievements = await Achievement.find({ isActive: true }).sort({ sortOrder: 1 });
    return NextResponse.json({ success: true, data: achievements }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newAchievement = await Achievement.create(body);
    return NextResponse.json({ success: true, data: newAchievement }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}