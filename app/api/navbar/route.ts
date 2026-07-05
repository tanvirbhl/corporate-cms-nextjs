import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";
import NavbarLink from "@/models/NavbarLink";

// GET all links
export async function GET() {
  try {
    await connectToDatabase();
    // Fetch all links, sorted by their 'order' field ascending
    const links = await NavbarLink.find({}).sort({ order: 1 });
    
    return NextResponse.json({ success: true, data: links }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch links" }, { status: 500 });
  }
}

// POST (Create) new link
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const newLink = await NavbarLink.create(body);
    
    revalidatePath("/", "layout"); // Force the public site to update
    return NextResponse.json({ success: true, data: newLink }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create link" }, { status: 500 });
  }
}