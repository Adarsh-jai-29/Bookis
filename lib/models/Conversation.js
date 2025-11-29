import mongoose, {Schema} from 'mongoose';

const conversationSchema = new Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  sellerId: { type:  mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  lastMessage: {  type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });

export default mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);