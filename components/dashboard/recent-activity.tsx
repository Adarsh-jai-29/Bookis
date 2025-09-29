"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore, useBooksStore, useChatStore } from "@/lib/store"
import { MessageCircle, BookOpen, DollarSign, Calendar } from "lucide-react"

export function RecentActivity() {
  const { user } = useAuthStore()
  const { books } = useBooksStore()
  const { conversations, messages } = useChatStore()

  // Generate mock recent activities
  const activities = [
    {
      id: 1,
      type: "message",
      title: "New message from Sarah",
      description: "Interested in your copy of '1984'",
      time: "2 hours ago",
      icon: MessageCircle,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "listing",
      title: "Book listed successfully",
      description: "The Great Gatsby is now live",
      time: "1 day ago",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      id: 3,
      type: "inquiry",
      title: "Price inquiry received",
      description: "Someone asked about To Kill a Mockingbird",
      time: "2 days ago",
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      id: 4,
      type: "view",
      title: "Profile viewed",
      description: "Your profile was viewed 5 times today",
      time: "3 days ago",
      icon: Calendar,
      color: "text-purple-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest interactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
