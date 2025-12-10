import { createServer } from "http"
import next from "next"
import { Server } from "socket.io"
import mongoose from "mongoose"
import Conversation from "./lib/models/Conversation.js"
import Message from "./lib/models/Message.js";

// 1. dev flag
const dev = process.env.NODE_ENV !== "production"

// 2. Init Next
const app = next({ dev })
const handle = app.getRequestHandler()

// 3. Run after Next is ready
app.prepare().then(async () => {
  // 4. Connect DB
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected")
  } catch (err) {
    console.error("Mongo connection error:", err)
  }

  // 5. Create HTTP server
  const server = createServer((req, res) => handle(req, res))

  // 6. Init socket
  const io = new Server(server, {
    cors: { origin: "*" },
  })
io.on("connect", (socket) => {
  // you may authenticate socket here and set socket.userId
  socket.on("join", ({ userId, targetUserId }) => {
    console.log('first')
    if (!userId) return;
    const room = [userId, targetUserId].sort().join("_");
    console.log('joining Room'+ room)
    socket.join(room); // join room for conversation between two users
  });

  // Client sends message: { conversationId, senderId, content, buyerId, sellerId, bookId }
  socket.on("message:send", async (payload) => {
    try {
      // ensure conversation exists
      let { conversationId, userId: senderId, newMessage: content, targetUserId: sellerId, bookId } = payload;
  console.log(conversationId, senderId, content, sellerId, bookId)
      if (!conversationId) {
        // try to find or create conversation
        let conv = await Conversation.findOne({ senderId, sellerId, bookId });
        if (!conv) conv = await Conversation.create({ senderId, sellerId, bookId });
        conversationId = conv._id;
        console.log('conv', conv)
      }
      const msg = await Message.create({ conversationId, senderId, receiverId: sellerId, content, read: false });

      // update lastMessage on conversation
      await Conversation.findByIdAndUpdate(conversationId, { lastMessage: msg._id, updatedAt: new Date() });

      // emit to participants: get conv participants
      const conv = await Conversation.findById(conversationId).lean();
      if (conv) {
        console.log('conv',conv)
        // emit to buyer and seller rooms (they should have joined a room with their userId)
        io.to(String(conv.senderId)).to(String(conv.sellerId)).emit("message:received", {
          message: msg,
          conversationId,
        });
      } else {
        // fallback: broadcast
        io.to("message:received", { message: msg, conversationId });
      }
    } catch (err) {
      console.error("socket message:send error", err);
      socket.emit("error", { message: "failed to send" });
    }
  });

  socket.on("message:read", async ({ conversationId, userId }) => {
    try {
      const res = await Message.updateMany({ conversationId, senderId: { $ne: userId }, read: false }, { $set: { read: true } });
      // notify other party
      const conv = await Conversation.findById(conversationId);
      if (conv) {
        io.to(String(conv.senderId)).to(String(conv.sellerId)).emit("message:read", { conversationId, by: userId });
      }
    } catch (err) {
      console.error("message:read error", err);
    }
  });
});

server.listen(4000, () => console.log("Socket server listening on 4000"));
})
