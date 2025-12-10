import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";

export async function PATCH(req) {
  const body = await req.json();
  const { conversationId, userId } = body;
  if (!conversationId || !userId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await connectDB();

  // Mark as read for messages NOT sent by this user
  const res = await Message.updateMany(
    { conversationId, senderId: { $ne: userId }, read: false },
    { $set: { read: true } }
  );

  return NextResponse.json({ ok: true, modifiedCount: res.nModified ?? res.modifiedCount });
}
