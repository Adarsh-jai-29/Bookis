"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, MessageCircle, BookOpen } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "List New Book",
      description: "Add a book to your collection",
      icon: Plus,
      href: "/sell",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Browse Books",
      description: "Find your next great read",
      icon: Search,
      href: "/browse",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Messages",
      description: "Check your conversations",
      icon: MessageCircle,
      href: "/messages",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "My Books",
      description: "Manage your listings",
      icon: BookOpen,
      href: "/my-books",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 w-full bg-transparent"
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
