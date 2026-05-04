import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,

    index: true,
  },
isConversationHead: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    default: null,
    index: true,
  },

  title: {
    type: String,
    default: "New Chat",
  },

  user: {
    type: String, // encrypted
  },

  bot: {
    type: String, // encrypted
  },

  type: {
    type: String,
    enum: ["text", "image", "voice"],
    default: "text",
  },

  fileUrl: {
    type: String,
    default: null,
  },

}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);