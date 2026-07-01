import mongoose, { Schema, models, model } from "mongoose";

const AboutSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const About = models.About || model("About", AboutSchema);

export default About;