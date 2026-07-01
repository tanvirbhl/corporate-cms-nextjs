import mongoose, { Schema, Model } from "mongoose";
import { INavbarLinkDocument } from "@/types/navbar";

// STEP 3: Create MongoDB Schema
const NavbarLinkSchema = new Schema<INavbarLinkDocument>(
  {
    name: {
      type: String,
      required: [true, "Link name is required"],
      trim: true,
    },
    href: {
      type: String,
      required: [true, "URL/Href is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isCta: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// STEP 4: Create Mongoose Model
// Check if the model exists to prevent overwrite errors in serverless environments
const NavbarLink: Model<INavbarLinkDocument> =
  mongoose.models.NavbarLink ||
  mongoose.model<INavbarLinkDocument>("NavbarLink", NavbarLinkSchema);

export default NavbarLink;