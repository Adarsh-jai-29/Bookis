"use client"

import { OrderCard } from "@/components/orders/order-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore, useOrdersStore } from "@/lib/store"
import { Package, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { getOrdersByUser } = useOrdersStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const buyerOrders = getOrdersByUser(user?.id, "buyer")
  const sellerOrders = getOrdersByUser(user?.id, "seller")
  const allOrders = getOrdersByUser(user?.id, "all")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track your purchases and sales</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            All Orders ({allOrders.length})
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Purchases ({buyerOrders.length})
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Sales ({sellerOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">Start buying or selling books to see your orders here</p>
              <Button onClick={() => router.push("/browse")}>Browse Books</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          {buyerOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-4">Browse our collection and make your first purchase</p>
              <Button onClick={() => router.push("/browse")}>Browse Books</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buyerOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          {sellerOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No sales yet</h3>
              <p className="text-muted-foreground mb-4">List your books to start selling</p>
              <Button onClick={() => router.push("/sell")}>List a Book</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sellerOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
