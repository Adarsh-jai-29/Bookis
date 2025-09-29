"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuthStore, useBooksStore, useOrdersStore } from "@/lib/store"
import { CreditCard, MapPin, Package, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function CheckoutForm({ bookId }) {
  const { user } = useAuthStore()
  const { books } = useBooksStore()
  const { createOrder } = useOrdersStore()
  const router = useRouter()

  const book = books.find((b) => b.id === bookId)
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  })

  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const shippingCost = 5.99
  const tax = book ? (book.price * 0.08).toFixed(2) : 0
  const total = book ? (book.price + shippingCost + Number.parseFloat(tax)).toFixed(2) : 0

  const handleAddressChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleCardChange = (field, value) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!book || !user) return

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orderData = {
        bookId: book.id,
        buyerId: user.id,
        sellerId: book.sellerId,
        totalAmount: Number.parseFloat(total),
        shippingAddress,
        paymentMethod,
      }

      const orderId = createOrder(orderData)
      router.push(`/orders/${orderId}`)
    } catch (error) {
      console.error("Order creation failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!book) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Book not found</p>
      </div>
    )
  }

  const isFormValid =
    shippingAddress.name &&
    shippingAddress.street &&
    shippingAddress.city &&
    shippingAddress.state &&
    shippingAddress.zipCode &&
    cardDetails.number &&
    cardDetails.expiry &&
    cardDetails.cvv &&
    cardDetails.name

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
            <CardDescription>Where should we send your book?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={shippingAddress.name}
                  onChange={(e) => handleAddressChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={shippingAddress.country}
                  onValueChange={(value) => handleAddressChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="CAN">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={shippingAddress.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>Your payment details are secure and encrypted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod.includes("card") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    value={cardDetails.name}
                    onChange={(e) => handleCardChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => handleCardChange("number", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardChange("expiry", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardChange("cvv", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 relative rounded overflow-hidden">
                <Image
                  src={book.image || "/placeholder.svg?height=80&width=64&query=book cover"}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{book.title}</h4>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-sm text-muted-foreground">Condition: {book.condition}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${book.price}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Book Price</span>
                <span>${book.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${shippingCost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Shield className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
            <Button onClick={handleSubmit} disabled={!isFormValid || isProcessing} className="w-full" size="lg">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                `Complete Purchase - $${total}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
