"use client"

import { MyBooksList } from "@/components/books/my-books-list"
import { Button } from "@/components/ui/button"
import { useAuthStore, useBooksStore } from "@/lib/store"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export interface Book {
  _id: string
  title: string
  sellerId: string
  author: string
  price: number
  image?: string
  description?: string
  condition?: string
  category?: string
}

export default function MyBooksPage() {
  const { isAuthenticated, user } = useAuthStore()
  const { addBook } = useBooksStore()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])
  
  // 📦 Fetch user's books
  useEffect(() => {
    const fetchMyBooks = async () => {
      // console.log('usr:',user)
      if (!user?._id) return

      try {
        const res = await fetch(`/api/books`,
          { method: "GET" }
        )
        if (!res.ok) throw new Error("Failed to fetch books")
        const data = await res.json()
        setBooks(data)
        addBook(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) fetchMyBooks()
  }, [isAuthenticated, user?._id])

  if (!isAuthenticated) return null
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Books</h1>
          <p className="text-muted-foreground">Manage your book listings</p>
        </div>
        <Link href="/sell">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List New Book
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading your books...</p>
      ) : books.length === 0 ? (
        <div className="text-center text-muted-foreground">
          You haven’t listed any books yet.
        </div>
      ) : (
        <MyBooksList books={books} />
      )}
    </div>
  )
}
