"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, useChatStore, useBooksStore } from "@/lib/store"
import { Send, BookOpen, MessageCircle } from "lucide-react"
import { cn, socketRef } from "@/lib/utils"
import Image from "next/image"
import { io } from "socket.io-client"
import { fetchMessages } from "@/app/services/chatService"

export function ChatWindow({ conversationId }) {
  const { user } = useAuthStore()
  const {
    conversations,
    messages,
    sendMessageViaSocket,
    // getConversationMessages,
    fetchConversationMessages
  } = useChatStore()
  // console.log(useChatStore())
  const { fetchBooks } = useBooksStore()
  
  const [newMessage, setNewMessage] = useState("")
  const [book, setBook] = useState(null)

  const messagesEndRef = useRef(null)
  // conversation data
  const conversation = conversations.find((c) => String(c?._id) === String(conversationId))
  const conversationMessages = messages[conversationId] || []
  
  console.log(conversation)

  useEffect(() => {
    const fetchBook = async () => {
   try {
   const books =await fetchBooks()
    console.log(books)
    const book = books.find((b) => b._id === conversation?.bookId)
    setBook(book)
  } catch (error) {
    console.error("Error fetching books:", error)
   }
  }
  fetchBook()
  }, [conversation])

  // console.log(books)
  // associated book
  
  // other user logic
  const otherUserId =
  conversation?.buyerId === user?._id ? conversation?.sellerId : conversation?.buyerId
  
  const otherUserName =
  conversation?.buyerId === user?._id ? (book?.sellerName || "Seller") : "Buyer"
  
  const isUserSeller = conversation?.sellerId === user?._id

  // socket logic
  const userId = user._id
  const targetUserId = conversation ? (conversation.buyerId === user._id ? conversation.sellerId : conversation.buyerId) : null
 console.log(userId, targetUserId)
 const bookId = conversation ? conversation.bookId : null

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  
useEffect(()=>{
  const fetchMessages = async () => {
    if (conversationId) {
      try{
    const message = await fetchConversationMessages(conversationId)
    console.log(message)
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }
  }
  fetchMessages()
}
  ,[conversationId])

useEffect(() => {
  
  const socket = socketRef()
    if (!userId) return;
    console.log(userId, targetUserId)
    socket.on("connect", () => {
      socket.emit("join", { userId, targetUserId });
     
    });

    return () => {
     if (socket.connected) socket.disconnect();
    };
    
  }, [userId, targetUserId]);
 

  useEffect(() => {
    scrollToBottom()
  }, [conversationMessages])
 
  const handleSendMessage = async(e) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversationId || !user) return
    
    const socket = socketRef()

   socket.emit('message:send',{conversationId, userId, newMessage, targetUserId, bookId } )
   // for showing on UI immediately
   sendMessageViaSocket({
      conversationId,
      senderId: user._id,
      content: newMessage,
   })
   
  //  res.map(msg => {
  //   msg.conte
  //   })

    setNewMessage("")
  }

  // useEffect(() => {
  //   fetchMessages()
  // }, [newMessage])

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const formatDate = (ts) => {
    const date = new Date(ts)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
    return date.toLocaleDateString()
  }
  console.log(conversation)
  console.log(book)
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
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{(otherUserName && otherUserName.charAt(0)) || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{otherUserName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isUserSeller ? "Interested in your book" : "Seller"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg mt-3">
          <div className="w-12 h-16 relative rounded overflow-hidden">
            <Image
              src={book.image || "/placeholder.svg"}
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
                ₹{book.price}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {conversationMessages.map((message, index) => {
              const isCurrentUser = message.senderId === user?._id
              const currentDate = formatDate(message.createdAt)
              const prevDate =
                index > 0 ? formatDate(conversationMessages[index - 1].createdAt) : null

              const showDate = index === 0 || currentDate !== prevDate

              return (
                <div key={message._id || message.tempId}>
                  {showDate && (
                    <div className="text-center text-xs text-muted-foreground py-2">
                      {currentDate}
                    </div>
                  )}

                  <div className={cn(
                    "flex gap-2",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}>
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{(otherUserName && otherUserName.charAt(0)) || "?"}</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg px-3 py-2",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>

                    {isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{(user?.name && user.name.charAt(0)) || (user?.email && user.email.charAt(0)) || "?"}</AvatarFallback>
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
