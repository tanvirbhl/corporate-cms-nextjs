import mongoose, { Schema, Document } from "mongoose";

export interface ISlider extends Document {
  imageUrl: string;
  title: string;
  description: string;
  sortOrder: number; // Used to determine display sequence
  isActive: boolean;
}

const sliderSchema = new Schema<ISlider>(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Slider = mongoose.models.Slider || mongoose.model<ISlider>("Slider", sliderSchema);

export default Slider;