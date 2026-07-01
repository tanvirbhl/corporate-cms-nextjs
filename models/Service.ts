import mongoose, { Schema, models, model } from "mongoose";

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: String,
}, { timestamps: true });

const Service = models.Service || model("Service", ServiceSchema);

export default Service;