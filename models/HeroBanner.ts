import mongoose, { Schema, models, model } from "mongoose";

const HeroBannerSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  buttonText: { type: String, required: true },
  buttonHref: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

const HeroBanner = models.HeroBanner || model("HeroBanner", HeroBannerSchema);

export default HeroBanner;