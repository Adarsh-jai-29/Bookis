"use client"

import { BookForm } from "@/components/books/book-form"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SellPage() {
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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Sell Your Book</h1>
        <p className="text-muted-foreground">List your book and connect with potential buyers</p>
      </div>

      <BookForm />
    </div>
  )
}
