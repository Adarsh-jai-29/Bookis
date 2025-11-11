import { connectDB } from "@/lib/dbConnect"
import { NextResponse } from "next/server"
import Book from "@/lib/models/book"


// ✅ Delete a book by ID
export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const bookId = searchParams.get("id")
    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }
    const deletedBook = await Book.findByIdAndDelete(bookId)
    if (!deletedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}

// ✅ Update a book by ID
export async function PUT(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const bookId = searchParams.get("id")
    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }
    const body = await req.json()
    const updatedBook = await Book.findByIdAndUpdate(bookId, body, { new: true })
    if (!updatedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    return NextResponse.json(updatedBook, { status: 200 })
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

// ✅ Fetch a single book by ID
export async function GET(req: Request) {
  try {
    await connectDB()
    console.log('req',req.url)
    const book = await Book.findById(new URL(req.url).pathname.split("/").pop())
    console.log('book',book)
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
   return NextResponse.json(book, { status: 200 })
  }
    catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}