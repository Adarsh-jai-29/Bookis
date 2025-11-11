"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuthStore, useBooksStore } from "@/lib/store"
import { MoreHorizontal, Edit, Trash2, Eye, MessageCircle, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Book } from "@/app/my-books/page"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"


interface MyBooksListProps {
  books: Book[]
}

export function MyBooksList({books}: MyBooksListProps) {
  const { user } = useAuthStore()
  const {  deleteBook } = useBooksStore()
  const [bookToDelete, setBookToDelete] = useState(null)
  const myBooks = books.filter((book) =>
  {  
    // console.log(book,user._id)
    return book.sellerId === user?._id
  })
  // console.log(user)

  const handleDeleteBook = (book) => {
    setBookToDelete(book)
  }

  const confirmDelete = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete.id)
      setBookToDelete(null)
    }
  }

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "good":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "fair":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "poor":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  if (myBooks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">No books listed yet</h3>
        <p className="text-muted-foreground mb-4">Start selling by listing your first book</p>
        <Link href="/sell">
          <Button>List Your First Book</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            <div className="aspect-[3/4] relative">
              <Image
                src={book.image || "/placeholder.svg?height=400&width=300&query=book cover"}
                alt={book.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <Badge className={`${getConditionColor(book.condition)} font-medium`}>{book.condition}</Badge>
                <Badge variant="secondary" className="bg-background/90 text-foreground">
                  ${book.price}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </div>
               <DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="ghost" size="sm" className="p-0 rounded-full">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
        <DropdownMenuItem asChild>
                      <Link href={`/book/${book.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Listing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/sell/edit/${book.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteBook(book)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {book.category}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(book.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{book.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">0 inquiries</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/sell/edit/${book.id}`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!bookToDelete} onOpenChange={() => setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{bookToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
