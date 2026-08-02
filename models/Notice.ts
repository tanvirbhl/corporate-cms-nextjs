import mongoose, { Schema, Document } from "mongoose";

export interface INotice extends Document {
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  isActive: boolean;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Notice = mongoose.models.Notice || mongoose.model<INotice>("Notice", noticeSchema);

export default Notice;