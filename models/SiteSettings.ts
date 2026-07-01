import mongoose, { Schema, models, model } from "mongoose";

const SiteSettingsSchema = new Schema({
  siteName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  socialLinks: {
    facebook: String,
    linkedin: String,
    github: String,
  },
}, { timestamps: true });

const SiteSettings = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

export default SiteSettings;