import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";
import NavbarLink from "@/models/NavbarLink";

// We define params as a Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the params here
  try {
    await connectToDatabase();
    const link = await NavbarLink.findById(id);
    if (!link) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: link }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the params here
  try {
    await connectToDatabase();
    const body = await request.json();
    const updatedLink = await NavbarLink.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!updatedLink) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, data: updatedLink }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the params here
  try {
    await connectToDatabase();
    const deletedLink = await NavbarLink.findByIdAndDelete(id);
    
    if (!deletedLink) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
  }
}