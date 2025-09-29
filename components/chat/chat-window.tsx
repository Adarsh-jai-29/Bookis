"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, useChatStore, useBooksStore } from "@/lib/store"
import { Send, BookOpen, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function ChatWindow({ conversationId }) {
  const { user } = useAuthStore()
  const { conversations, messages, sendMessage, getConversationMessages } = useChatStore()
  const { books } = useBooksStore()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)

  const conversation = conversations.find((c) => c.id === conversationId)
  const conversationMessages = getConversationMessages(conversationId)
  const book = books.find((b) => b.id === conversation?.bookId)

  const otherUserId = conversation?.buyerId === user?.id ? conversation?.sellerId : conversation?.buyerId
  const otherUserName = conversation?.buyerId === user?.id ? book?.sellerName : "Buyer"
  const isUserSeller = conversation?.sellerId === user?.id

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationMessages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversationId || !user) return

    sendMessage(conversationId, user.id, newMessage.trim())
    setNewMessage("")
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  if (!conversation || !book) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <div className="text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a conversation to start chatting</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`/placeholder.svg?height=40&width=40&query=user avatar`} />
            <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{otherUserName}</CardTitle>
            <p className="text-sm text-muted-foreground">{isUserSeller ? "Interested in your book" : "Seller"}</p>
          </div>
        </div>

        {/* Book Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg mt-3">
          <div className="w-12 h-16 relative rounded overflow-hidden">
            <Image
              src={book.image || "/placeholder.svg?height=64&width=48&query=book cover"}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">{book.title}</h4>
            <p className="text-xs text-muted-foreground">{book.author}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {book.condition}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                ${book.price}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {conversationMessages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.id
              const showDate =
                index === 0 || formatDate(message.timestamp) !== formatDate(conversationMessages[index - 1].timestamp)

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center text-xs text-muted-foreground py-2">
                      {formatDate(message.timestamp)}
                    </div>
                  )}
                  <div className={cn("flex gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&query=user avatar`} />
                        <AvatarFallback className="text-xs">{otherUserName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2",
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground/70",
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
