import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";
import NavbarLink from "@/models/NavbarLink";

// GET single link
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await connectToDatabase();
    const link = await NavbarLink.findById(id);
    
    if (!link) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: link }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching link" }, { status: 500 });
  }
}

// PUT (Update) link
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectToDatabase();
    const body = await req.json();
    
    const updatedLink = await NavbarLink.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true } 
    );

    if (!updatedLink) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    
    revalidatePath("/", "layout"); // Force the public site to update
    return NextResponse.json({ success: true, data: updatedLink });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update link" }, { status: 500 });
  }
}

// DELETE link
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await connectToDatabase();
    const deletedLink = await NavbarLink.findByIdAndDelete(id);
    
    if (!deletedLink) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
  }
}