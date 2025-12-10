import Message from "@/lib/models/Message";

export async function GET(req, { params }) {
  try {
    const { conversationId } = params;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // oldest → newest
      .populate("senderId", "name email")  // optional
      .populate("receiverId", "name email");

    return Response.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response("Failed to fetch messages", { status: 500 });
  }
}
