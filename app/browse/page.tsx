"use client"

import { BookCard } from "@/components/books/book-card"
import { AdvancedSearch } from "@/components/books/advanced-search"
import { useBooksStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { useEffect, useState } from "react"

export default function BrowsePage() {
  const { getFilteredBooks } = useBooksStore()
  const [viewMode, setViewMode] = useState("grid")
  const { books, addBook} = useBooksStore()
  const [loading, setLoading] = useState(true)
  const [allBooks, setAllBooks] = useState([])
  
  useEffect(() => {
  try {
   const fetchBooks = async () => {
      const res = await fetch('/api/books', { method: 'GET' })
      if (!res.ok) throw new Error('Failed to fetch books')
      const data = await res.json()
      setAllBooks(data)  //store books in local state for rendering
      addBook(data)  //store books in Zustand store for global access and next time avoid fetching again
      setLoading(false)
    }

    fetchBooks()
   }
  catch (error) {
    console.log('failed to fetch Books: ',error)
  }
}, [])

// console.log(allBooks)

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
              <List className="h-4 w-2" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {allBooks.length} book{allBooks.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Books Grid */}
        {
        !loading ?
        allBooks.length > 0 ? (
          <div className={ viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "w-[50%] m-auto space-y-4" } >
            {allBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}</div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or browse all books</p>
            <Button onClick={() => window.location.reload()}>Reset Filters</Button>
          </div>
        ):
        <div className="text-center py-12">
        <div className="text-6xl mb-4">⏳</div>
        <h3 className="text-xl font-semibold mb-2">Loading books...</h3>
        <p className="text-muted-foreground mb-4">Please wait while we fetch the book listings</p>
      </div>
        }
      </div>
    </div>
  )
}
