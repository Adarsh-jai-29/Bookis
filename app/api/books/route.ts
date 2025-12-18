import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/dbConnect'
import Book from '@/lib/models/book'

// ✅ Create a new book
export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    const {
      title = '',
      author = '',
      sellerId,
      sellerName,
      isbn = '',
      publishedYear = new Date().getFullYear(),
      category = '',
      condition = '',
      price = '',
      description = '',
      image = '',
    } = body

    const newBook = new Book({
      title,
      author,
      sellerId,
      sellerName,
      isbn,
      publishedYear,
      category,
      condition,
      price,
      description,
      image,
    })
    await newBook.save()
    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}

// ✅ Fetch all books
export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const query = userId ? { userId } : {}

    const books = await Book.find(query).sort({ createdAt: -1 })
    return NextResponse.json(books, { status: 200 })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}
