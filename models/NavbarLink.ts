import mongoose, { Schema, Document } from "mongoose";

// 1. Add isVisible to the nested sub-link schema
const subLinkSchema = new Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  isVisible: { type: Boolean, default: true }, 
  order: { type: Number, default: 0 },
});

// 2. Update the interface so TypeScript knows about isVisible
export interface INavbarLink extends Document {
  name: string;
  href: string;
  order: number;
  isVisible: boolean;
  isCta: boolean;
  subLinks: { name: string; href: string; isVisible: boolean }[]; 
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
    // 3. Remove the { type: ... } wrapper. This fixes the delete bug!
    subLinks: [subLinkSchema], 
  },
  { timestamps: true }
);

// Prevent model overwrite in development
const NavbarLink = mongoose.models.NavbarLink || mongoose.model<INavbarLink>("NavbarLink", navbarLinkSchema);

export default NavbarLink;