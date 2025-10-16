"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore, useChatStore } from "@/lib/store"
import { MessageCircle, Heart, Eye, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function BookCard({ book }) {
  const { user, isAuthenticated } = useAuthStore()
  const { createConversation } = useChatStore()
  const router = useRouter()

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    if (user.id === book.sellerId) {
      return // Can't message yourself
    }

    const conversationId = createConversation(user.id, book.sellerId, book.id)
    router.push(`/messages?conversation=${conversationId}`)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    if (user.id === book.sellerId) {
      return // Can't buy your own book
    }

    router.push(`/checkout/${book.id}`)
  }

  const handleView = () => {
    router.push(`/books/${book.id}`)
  }

  const getConditionColor = (condition:string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "good":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "fair":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "poor":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-3/4 w-[60%] m-auto relative overflow-hidden">
        <Image
          src={book.image || "/placeholder.svg?height=400&width=300&query=book cover"}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge className={`${getConditionColor(book.condition)} font-medium`}>{book.condition}</Badge>
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            ${book.price}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-background/90 hover:bg-background"
              onClick={handleView}
              aria-label="View details"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
            <CardDescription className="text-sm">{book.author}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {book.category}
          </Badge>
          <span className="text-xs text-muted-foreground">{book.publishedYear}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`/placeholder.svg?height=24&width=24&query=user avatar`} />
              <AvatarFallback className="text-xs">{book.sellerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{book.sellerName}</span>
          </div>
        </div>

        {isAuthenticated && user.id !== book.sellerId && (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleBuyNow} className="flex-1">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Buy Now
            </Button>
            <Button size="sm" variant="outline" onClick={handleContactSeller} className="bg-transparent">
              <MessageCircle className="h-3 w-3 mr-1" />
              Contact
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
