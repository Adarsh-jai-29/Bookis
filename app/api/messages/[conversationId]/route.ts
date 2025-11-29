import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Message from "@/lib/models/Message";

export async function GET(req: Request, { params }) {
  const { conversationId } = params;
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "30", 10);
  const skip = (page - 1) * limit;

  await connectDB();
  const total = await Message.countDocuments({ conversationId });
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // return in chronological order (oldest first)
  return NextResponse.json({
    messages: messages.reverse(),
    page,
    limit,
    total,
  });
}
