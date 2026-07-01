import { Document } from "mongoose";

// The base data shape for a Navbar link
export interface INavbarLink {
  name: string;
  href: string;
  order: number;
  isVisible: boolean;
  isCta: boolean;
}

// The extended interface for MongoDB documents
export interface INavbarLinkDocument extends INavbarLink, Document {
  createdAt: Date;
  updatedAt: Date;
}