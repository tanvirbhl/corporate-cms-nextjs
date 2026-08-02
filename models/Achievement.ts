import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  title: string;
  subtitle: string; 
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Achievement = mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", achievementSchema);

export default Achievement;