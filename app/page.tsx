"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBooksStore } from "@/lib/store"
import { BookOpen, Users, MessageCircle, Shield, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const { books, getFilteredBooks } = useBooksStore()
  const featuredBooks = getFilteredBooks().slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Your Next Great Read Awaits on <span className="text-primary">BOOKish</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
              The ultimate marketplace for book lovers. Buy rare finds, sell your collection, and connect with fellow
              readers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="text-lg px-8 py-6">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Books
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Books Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">5K+</div>
              <div className="text-muted-foreground">Happy Readers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Books</h2>
            <p className="text-muted-foreground text-lg">Discover amazing books from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] relative">
                  <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </div>
                    <Badge variant="secondary">${book.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{book.condition}</Badge>
                    <span className="text-sm text-muted-foreground">by {book.sellerName}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/browse">
              <Button variant="outline" size="lg">
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BOOKish?</h2>
            <p className="text-muted-foreground text-lg">The best platform for book enthusiasts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Trusted Community</CardTitle>
                <CardDescription>Connect with verified book lovers and trusted sellers worldwide</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Direct Communication</CardTitle>
                <CardDescription>Chat directly with sellers to ask questions and negotiate prices</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure Transactions</CardTitle>
                <CardDescription>Safe and secure payment processing with buyer protection</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Book Journey?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of book lovers buying and selling on BOOKish
            </p>
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-6">
                <Star className="mr-2 h-5 w-5" />
                Join BOOKish Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
