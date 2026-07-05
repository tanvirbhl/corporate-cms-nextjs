import mongoose, { Schema, Document } from "mongoose";

// Define the nested sub-link schema
const subLinkSchema = new Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
});

export interface INavbarLink extends Document {
  name: string;
  href: string;
  order: number;
  isVisible: boolean;
  isCta: boolean;
  subLinks: { name: string; href: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const navbarLinkSchema = new Schema<INavbarLink>(
  {
    name: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    isCta: { type: Boolean, default: false },
    subLinks: { type: [subLinkSchema], default: [] }, 
  },
  { timestamps: true }
);

// Prevent model overwrite in development
const NavbarLink = mongoose.models.NavbarLink || mongoose.model<INavbarLink>("NavbarLink", navbarLinkSchema);

export default NavbarLink;