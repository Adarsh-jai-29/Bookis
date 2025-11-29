"use client"

import { CheckoutForm } from "@/components/orders/checkout-form"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CheckoutPage({ params }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const bookId = Number.parseInt(params.bookId)

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
      <div className="mb-8">
        <div className="mb-4  text-yellow-600">
          Attention: This is a demo checkout page. No real transactions will be processed.
        </div>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>

      <CheckoutForm bookId={bookId} />
    </div>
  )
}
