"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore, useBooksStore, useOrdersStore } from "@/lib/store"
import { Package, Truck, CheckCircle, Clock, AlertCircle, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function OrderCard({ order }) {
  const { user } = useAuthStore()
  const { books } = useBooksStore()
  const { updateOrderStatus } = useOrdersStore()

  const book = books.find((b) => b.id === order.bookId)
  const isUserBuyer = order.buyerId === user?.id
  const isUserSeller = order.sellerId === user?.id

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "shipped":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const handleStatusUpdate = (newStatus) => {
    updateOrderStatus(order.id, newStatus)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!book) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <CardDescription>{formatDate(order.createdAt)}</CardDescription>
          </div>
          <Badge className={`${getStatusColor(order.status)} font-medium gap-1`}>
            {getStatusIcon(order.status)}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Book Information */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="w-12 h-16 relative rounded overflow-hidden">
            <Image
              src={book.image || "/placeholder.svg?height=64&width=48&query=book cover"}
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
                ${order.totalAmount}
              </Badge>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isUserBuyer ? "Seller" : isUserSeller ? "Buyer" : "Other Party"}:
            </span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`/placeholder.svg?height=24&width=24&query=user avatar`} />
                <AvatarFallback className="text-xs">{isUserBuyer ? book.sellerName.charAt(0) : "B"}</AvatarFallback>
              </Avatar>
              <span>{isUserBuyer ? book.sellerName : "Buyer"}</span>
            </div>
          </div>

          {order.estimatedDelivery && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Delivery:</span>
              <span>{formatDate(order.estimatedDelivery)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment Method:</span>
            <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/orders/${order.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              View Details
            </Button>
          </Link>

          <Link href={`/messages?conversation=${order.buyerId}-${order.sellerId}-${order.bookId}`}>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </Link>

          {/* Status-specific actions */}
          {isUserSeller && order.status === "pending" && (
            <Button size="sm" onClick={() => handleStatusUpdate("confirmed")}>
              Confirm
            </Button>
          )}

          {isUserSeller && order.status === "confirmed" && (
            <Button size="sm" onClick={() => handleStatusUpdate("shipped")}>
              Mark Shipped
            </Button>
          )}

          {isUserBuyer && order.status === "shipped" && (
            <Button size="sm" onClick={() => handleStatusUpdate("delivered")}>
              Confirm Delivery
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
