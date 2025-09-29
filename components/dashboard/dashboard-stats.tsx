"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore, useBooksStore, useChatStore } from "@/lib/store"
import { BookOpen, DollarSign, MessageCircle, Eye } from "lucide-react"

export function DashboardStats() {
  const { user } = useAuthStore()
  const { books } = useBooksStore()
  const { conversations } = useChatStore()

  const myBooks = books.filter((book) => book.sellerId === user?.id)
  const totalValue = myBooks.reduce((sum, book) => sum + book.price, 0)
  const myConversations = conversations.filter((conv) => conv.sellerId === user?.id || conv.buyerId === user?.id)

  const stats = [
    {
      title: "Books Listed",
      value: myBooks.length,
      description: "Active listings",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      title: "Total Value",
      value: `$${totalValue.toFixed(2)}`,
      description: "Combined listing value",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Active Chats",
      value: myConversations.length,
      description: "Ongoing conversations",
      icon: MessageCircle,
      color: "text-purple-500",
    },
    {
      title: "Profile Views",
      value: "127",
      description: "This month",
      icon: Eye,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
