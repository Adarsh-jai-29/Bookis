"use client"

import { MyBooksList } from "@/components/books/my-books-list"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MyBooksPage() {
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

      <MyBooksList />
    </div>
  )
}
