// app/chat/page.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import useSocket from "./useSocket";
import { useChatStore } from "@/lib/store";

export default function ChatPage({ currentUserId }) {
  // currentUserId should be provided by your auth layer (string ObjectId)
  const socketRef = useSocket(currentUserId);
  const attachSocket = useChatStore((s) => s.attachSocket);
  const loadConversations = useChatStore((s) => s.loadConversations);
  const conversations = useChatStore((s) => s.conversations);
  const openConversation = useChatStore((s) => s.openConversation);
  const messages = useChatStore((s) => s.messages);
  const sendMessageViaSocket = useChatStore((s) => s.sendMessageViaSocket);
  const activeConversation = useChatStore((s) => s.activeConversation);

  const [messageText, setMessageText] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (socketRef.current) attachSocket(socketRef.current);
  }, [socketRef.current]);

  useEffect(() => {
    if (currentUserId) loadConversations(currentUserId);
  }, [currentUserId]);

  const handleOpen = async (conv) => {
    // conv should include buyerId sellerId bookId
    await openConversation({ buyerId: conv.buyerId, sellerId: conv.sellerId, bookId: conv.bookId, userId: currentUserId });
  };

  const handleSend = () => {
    if (!activeConversation || !messageText.trim()) return;
    sendMessageViaSocket({
      conversationId: activeConversation,
      senderId: currentUserId,
      content: messageText.trim(),
      // include buyerId/sellerId/bookId optionally if conversationId missing server-side
    });
    setMessageText("");
    inputRef.current?.focus();
  };

  const convMessages = messages[activeConversation] || [];

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <div style={{ width: 320, borderRight: "1px solid #ddd", paddingRight: 12 }}>
        <h3>Conversations</h3>
        {conversations.map((c) => (
          <div key={c._id} style={{ padding: 8, borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => handleOpen(c)}>
            <div>Book: {c.bookId}</div>
            <div>Last: {c.lastMessage?.content ? c.lastMessage.content : "—"}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{c.updatedAt ? new Date(c.updatedAt).toLocaleString() : ""}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
          {activeConversation ? (
            convMessages.map((m) => (
              <div key={m._id} style={{ marginBottom: 8, textAlign: String(m.senderId) === String(currentUserId) ? "right" : "left" }}>
                <div style={{ display: "inline-block", padding: "8px 12px", borderRadius: 12, background: "#f3f3f3" }}>
                  <div>{m.content}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>{new Date(m.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#888" }}>Open a conversation</div>
          )}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type message..."
            style={{ flex: 1, padding: 8 }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
