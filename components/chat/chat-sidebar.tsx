"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, useChatStore, useBooksStore } from "@/lib/store"
import { Search, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatSidebar({ activeConversationId, onConversationSelect }) {
  const { user } = useAuthStore()
  const { conversations, messages, loadConversations } = useChatStore()
  const { books } = useBooksStore()
  const [searchQuery, setSearchQuery] = useState("")

  // 🔥 Load conversations when user is available
  useEffect(() => {
    if (user?._id) {
      loadConversations(user._id)
    }
  }, [user?._id, loadConversations])

  const getConversationInfo = (conversation) => {
    const book = books.find((b) => b._id === conversation.bookId)

    const otherUserId =
      conversation.buyerId === user?._id
        ? conversation.sellerId
        : conversation.buyerId

    const otherUserName =
      conversation.buyerId === user?._id
        ? book?.sellerName || "Seller"
        : conversation.otherName || "Buyer"

    const conversationMessages = messages[conversation._id] || []
    const lastMessage = conversationMessages[conversationMessages.length - 1] || null

    const unreadCount = conversationMessages.filter(
      (msg) => msg.senderId !== user?._id && !msg.read
    ).length

    return {
      ...conversation,
      book,
      otherUserName,
      lastMessage,
      unreadCount,
    }
  }

  const filteredConversations = conversations
    .map(getConversationInfo)
    .filter((conv) => {
      if (!searchQuery) return true
      return (
        (conv.otherUserName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conv.book?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      const aTime = new Date(
        a.lastMessage?.timestamp ||
          a.lastMessage?.createdAt ||
          a.updatedAt ||
          a.createdAt
      ).getTime()

      const bTime = new Date(
        b.lastMessage?.timestamp ||
          b.lastMessage?.createdAt ||
          b.updatedAt ||
          b.createdAt
      ).getTime()

      return bTime - aTime
    })

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => onConversationSelect(conversation._id)}
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                  activeConversationId === conversation._id && "bg-muted"
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&query=user avatar`} />
                  <AvatarFallback>
                    {(conversation.otherUserName && conversation.otherUserName.charAt(0)) || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {conversation.otherUserName}
                    </p>

                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.book?.title}
                  </p>

                  {conversation.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
