import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string; // e.g., 'quickhire-job-board' or 'biolink'
  category: string;
  shortSummary: string;
  coverImage: string;
  technologies: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    shortSummary: { type: String, required: true },
    coverImage: { type: String, required: true },
    technologies: { type: [String], default: [] },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;