"use client"

import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, useBooksStore } from "@/lib/store"
import { BookOpen, Star, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore()
  const { books } = useBooksStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const myBooks = books.filter((book) => book.sellerId === user?.id)
  const totalValue = myBooks.reduce((sum, book) => sum + book.price, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Your BOOKish statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Books Listed</span>
                </div>
                <Badge variant="secondary">{myBooks.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Value</span>
                </div>
                <Badge variant="secondary">${totalValue.toFixed(2)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Member Since</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(user?.joinedDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
              {user?.location && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Location</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{user.location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reading Preferences</CardTitle>
              <CardDescription>Your favorite genres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Fiction</Badge>
                <Badge variant="outline">Science</Badge>
                <Badge variant="outline">Biography</Badge>
                <Badge variant="outline">History</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
