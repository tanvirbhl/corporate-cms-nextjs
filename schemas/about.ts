import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  // Visibility Toggles
  showHero: boolean;
  showMissionVision: boolean;
  showChairman: boolean;
  showDirector: boolean;
  showCeo: boolean;

  // Hero
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  
  // Mission / Vision
  mission: string;
  vision: string;
  
  // Messages
  chairmanName: string;
  chairmanMessage: string;
  chairmanImage: string;
  
  directorName: string;
  directorMessage: string;
  directorImage: string;

  ceoName: string;
  ceoMessage: string;
  ceoImage: string;
}

const aboutSchema = new Schema<IAbout>(
  {
    showHero: { type: Boolean, default: true },
    showMissionVision: { type: Boolean, default: true },
    showChairman: { type: Boolean, default: true },
    showDirector: { type: Boolean, default: true },
    showCeo: { type: Boolean, default: false },

    heroTitle: { type: String, default: "" },
    heroDescription: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    
    chairmanName: { type: String, default: "" },
    chairmanMessage: { type: String, default: "" },
    chairmanImage: { type: String, default: "" },
    
    directorName: { type: String, default: "" },
    directorMessage: { type: String, default: "" },
    directorImage: { type: String, default: "" },

    ceoName: { type: String, default: "" },
    ceoMessage: { type: String, default: "" },
    ceoImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const About = mongoose.models.About || mongoose.model<IAbout>("About", aboutSchema);

export default About;