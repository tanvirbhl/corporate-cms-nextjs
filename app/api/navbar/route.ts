import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";
import NavbarLink from "@/models/NavbarLink";

export async function GET() {
  try {
    await connectToDatabase();
    const links = await NavbarLink.find().sort({ order: 1 });
    return NextResponse.json({ success: true, data: links }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/navbar error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch navbar links" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const newLink = await NavbarLink.create(body);
    
    // OPTIMIZATION: Instantly clear the cache for the public website layout
    revalidatePath("/", "layout");
    
    return NextResponse.json({ success: true, data: newLink }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/navbar error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create navbar link" },
      { status: 500 }
    );
  }
}