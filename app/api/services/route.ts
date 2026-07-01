import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Service from "@/models/Service";

export async function GET() {
  await connectToDatabase();
  const services = await Service.find();
  return NextResponse.json({ success: true, data: services });
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const service = await Service.create(body);
  return NextResponse.json({ success: true, data: service });
}


export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params object
  const { id } = await params;
  
  await connectToDatabase();
  await Service.findByIdAndDelete(id);
  
  return NextResponse.json({ success: true });
}