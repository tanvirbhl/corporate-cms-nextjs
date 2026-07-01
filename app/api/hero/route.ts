import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";
import HeroBanner from "@/models/HeroBanner";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch the first hero banner (we only need one)
    const hero = await HeroBanner.findOne();
    return NextResponse.json({ success: true, data: hero }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // We only support one hero banner, so we clear the existing one first
    await HeroBanner.deleteMany({});
    const newHero = await HeroBanner.create(body);
    
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, data: newHero }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to save" }, { status: 500 });
  }
}