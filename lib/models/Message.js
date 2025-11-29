import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", messageSchema);
