import mongoose, { Schema, Document } from "mongoose";

const messageSchema = new Schema({
  
  data: { type: Schema.Types.Mixed, required: true },
  status: { 
    type: String, 
    enum: ["unread", "read", "archived"], 
    default: "unread" 
  },
}, { 
  timestamps: true,
  strict: false 
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;