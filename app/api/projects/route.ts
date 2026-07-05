import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Convert comma-separated string to an array before saving
    if (typeof body.technologies === 'string') {
      body.technologies = body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const newProject = await Project.create(body);
    
    revalidatePath("/", "layout"); // Force public site to update
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create project" }, { status: 500 });
  }
}