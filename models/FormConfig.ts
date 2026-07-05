import mongoose, { Schema, Document } from "mongoose";

const fieldSchema = new Schema({
  label: { type: String, required: true },
  name: { type: String, required: true }, // The internal ID (e.g., "firstName")
  type: { type: String, enum: ["text", "email", "textarea", "select"], required: true },
  required: { type: Boolean, default: false },
  options: { type: String, default: "" }, // Comma-separated options for 'select' type
});

export interface IFormConfig extends Document {
  fields: any[];
}

const formConfigSchema = new Schema<IFormConfig>({
  fields: { type: [fieldSchema], default: [] },
});

const FormConfig = mongoose.models.FormConfig || mongoose.model<IFormConfig>("FormConfig", formConfigSchema);

export default FormConfig;