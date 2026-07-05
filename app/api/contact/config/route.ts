import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import FormConfig from "@/models/FormConfig";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch the single configuration document, or return a default structure
    let config = await FormConfig.findOne({});
    if (!config) {
      config = await FormConfig.create({
        fields: [
          { label: "Full Name", name: "fullName", type: "text", required: true },
          { label: "Email Address", name: "email", type: "email", required: true },
          { label: "Message", name: "message", type: "textarea", required: true },
        ]
      });
    }
    return NextResponse.json({ success: true, data: config.fields }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const { fields } = await req.json();
    
    // Upsert updates the existing document or creates one if it doesn't exist
    const config = await FormConfig.findOneAndUpdate(
      {}, 
      { fields }, 
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ success: true, data: config.fields }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}