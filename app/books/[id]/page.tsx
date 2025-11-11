"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuthStore, useChatStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, ShoppingCart, ArrowLeft } from "lucide-react"
import React from "react"

export default function BookDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params?.id

  // const { books } = useBooksStore()
  const { user, isAuthenticated } = useAuthStore()
  const { createConversation } = useChatStore()
  const [loading, setLoading] = React.useState(true)

  // console.log(books)
  // const book = books.map((b) => b.id === id)
  //  console.log(book)

  const fetchBookById = async (bookId: number | string | string[] ) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "GET" })
      if (!res.ok) throw new Error("Failed to fetch book")
      const data = await res.json()
      setLoading(false)
      return data
    } catch (error) {
      console.error("Error fetching book:", error)
      setLoading(false)
      return null
    }
  }

  const [book, setBook] = React.useState<any>(null)
  React.useEffect(() => {
    const getBook = async () => {
      const fetchedBook = await fetchBookById(bookId)
      setBook(fetchedBook)
    }
    getBook()
  }, [bookId])


  const getConditionColor = (condition: string) => {
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

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    if (user.id === book?.sellerId) {
      return
    }
    const conversationId = createConversation(user.id, book!.sellerId, book!.id)
    router.push(`/messages?conversation=${conversationId}`)
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
    if (user.id === book?.sellerId) {
      return
    }
    router.push(`/checkout/${book!.id}`)
  }

  if (!book) {
    return (
      loading ?  (<div className="container mx-auto px-4 py-10">
           <p className="text-center text-muted-foreground">Loading book details...</p>
         </div>) :
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
        <Card>
          <CardContent className="py-10 text-center">
            <h1 className="text-2xl font-semibold mb-2">Book not found</h1>
            <p className="text-muted-foreground">The book you’re looking for doesn’t exist or was removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 m-2 gap-8">
        {/* Book Image */}
        <div className="relative h-[100%] aspect-[3/4] m-auto overflow-hidden rounded-lg border bg-muted/20">
          <Image
            src={book.image || "/placeholder.svg?height=700&width=525&query=book cover"}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Book Info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-balance">{book.title}</h1>
              <p className="text-lg text-muted-foreground mt-1">by {book.author}</p>
            </div>
            <Badge variant="secondary" className="text-lg">
              ${book.price}
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Badge className={`${getConditionColor(book.condition)} font-medium`}>{book.condition}</Badge>
            <Badge variant="outline">{book.category}</Badge>
            <span className="text-sm text-muted-foreground">Published: {book.publishedYear}</span>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Seller</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>{book.sellerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{book.sellerName}</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button size="lg" onClick={handleBuyNow}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
            <Button size="lg" variant="outline" onClick={handleContactSeller} className="bg-transparent">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>ISBN: {book.isbn}</p>
            <p className="mt-1">Listing created: {new Date(book.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
