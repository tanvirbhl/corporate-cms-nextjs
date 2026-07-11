import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import ClientLogo from "@/models/ClientLogo";

export async function GET() {
  try {
    await connectToDatabase();
    const logos = await ClientLogo.find({}).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: logos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newLogo = await ClientLogo.create(body);
    return NextResponse.json({ success: true, data: newLogo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}