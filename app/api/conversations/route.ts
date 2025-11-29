import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import  Conversation  from "@/lib/models/Conversation";

export async function POST(req: Request) {
  // Create or get conversation by buyerId/sellerId/bookId
  const body = await req.json();
  const { buyerId, sellerId, bookId } = body;
  if (!buyerId || !sellerId || !bookId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await connectDB();

  let conv = await Conversation.findOne({ buyerId, sellerId, bookId });
  if (!conv) {
    conv = await Conversation.create({ buyerId, sellerId, bookId });
  }
  return NextResponse.json({ conversation: conv });
}

export async function GET(req) {
  // list conversations for a user: ?userId=...
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  await connectDB();
  const conversations = await Conversation.find({
    $or: [{ buyerId: userId }, { sellerId: userId }],
  })
    .sort({ updatedAt: -1 })
    .populate("lastMessage")
    .lean();

  return NextResponse.json({ conversations });
}
