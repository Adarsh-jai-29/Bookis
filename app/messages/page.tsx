"use client"

import { ChatInterface } from "@/components/chat/chat-interface"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MessagesPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">Chat with buyers and sellers</p>
      </div>

      <ChatInterface />
    </div>
  )
}
