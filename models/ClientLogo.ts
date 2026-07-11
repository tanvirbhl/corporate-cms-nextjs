import mongoose, { Schema, Document } from "mongoose";

export interface IClientLogo extends Document {
  name: string;
  imageUrl: string;
  sortOrder: number;
}

const clientLogoSchema = new Schema<IClientLogo>(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ClientLogo = mongoose.models.ClientLogo || mongoose.model<IClientLogo>("ClientLogo", clientLogoSchema);

export default ClientLogo;