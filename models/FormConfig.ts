import mongoose, { Schema, Document } from "mongoose";

// 1. Define an interface for the individual field
export interface IField {
  label: string;
  name: string;
  type: string;
  required: boolean;
  options: string;
}

// 2. Apply the interface to the fieldSchema
const fieldSchema = new Schema<IField>({
  label: { type: String, required: true },
  name: { type: String, required: true }, 
  type: { type: String, enum: ["text", "email", "textarea", "select"], required: true },
  required: { type: Boolean, default: false },
  options: { type: String, default: "" }, 
});

// 3. Use IField[] instead of any[]
export interface IFormConfig extends Document {
  fields: IField[];
}

// 4. Simply pass [fieldSchema]. Mongoose automatically defaults arrays to []
const formConfigSchema = new Schema<IFormConfig>({
  fields: [fieldSchema],
});

const FormConfig = mongoose.models.FormConfig || mongoose.model<IFormConfig>("FormConfig", formConfigSchema);

export default FormConfig;