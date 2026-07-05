import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";
import Project from "@/models/Project";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Convert comma-separated string to an array before updating
    if (typeof body.technologies === 'string') {
      body.technologies = body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const updatedProject = await Project.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedProject) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, data: updatedProject }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await connectToDatabase();
    const deletedProject = await Project.findByIdAndDelete(id);
    
    if (!deletedProject) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }
    
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, message: "Project deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete project" }, { status: 500 });
  }
}