"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatWindow } from "./chat-window"
import { useSearchParams } from "next/navigation"

export function ChatInterface() {
  const searchParams = useSearchParams()
  const [activeConversationId, setActiveConversationId] = useState(null)

  useEffect(() => {
    const conversationParam = searchParams.get("conversation")
    if (conversationParam) {
      setActiveConversationId(conversationParam)
    }
  }, [searchParams])


  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <ChatSidebar activeConversationId={activeConversationId} onConversationSelect={setActiveConversationId} />
      </div>

      {/* Chat Window */}
      <div className="lg:col-span-2">
        <ChatWindow conversationId={activeConversationId} />
      </div>
    </div>
  )
}