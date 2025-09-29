"use client"

import { BookCard } from "@/components/books/book-card"
import { AdvancedSearch } from "@/components/books/advanced-search"
import { useBooksStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { useState } from "react"

export default function BrowsePage() {
  const { getFilteredBooks } = useBooksStore()
  const [viewMode, setViewMode] = useState("grid")
  const filteredBooks = getFilteredBooks()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
        <p className="text-muted-foreground">Discover your next favorite book from our community</p>
      </div>

      <div className="space-y-6">
        <AdvancedSearch />

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or browse all books</p>
            <Button onClick={() => window.location.reload()}>Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
