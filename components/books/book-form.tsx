"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, useBooksStore } from "@/lib/store"
import { Upload, X, BookOpen, DollarSign, Tag, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function BookForm({ book, onSuccess }) {
  const { user } = useAuthStore()
  const { addBook, updateBook } = useBooksStore()
  const router = useRouter()
  const isEditing = !!book

  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    publishedYear: book?.publishedYear || new Date().getFullYear(),
    category: book?.category || "",
    condition: book?.condition || "",
    price: book?.price || "",
    description: book?.description || "",
    image: book?.image || "",
  })


  const [imagePreview, setImagePreview] = useState(book?.image || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Textbook",
    "Biography",
    "Science",
    "History",
    "Romance",
    "Mystery",
    "Fantasy",
    "Self-Help",
  ]
  const conditions = ["Excellent", "Good", "Fair", "Poor"]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

  console.log(book)
    try {
      const bookData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        publishedYear: Number.parseInt(formData.publishedYear),
        sellerId: user._id,
        sellerName: user.name,
        image: imagePreview || `/placeholder.svg?height=400&width=300&query=${formData.title} book cover`,
      }

      if (isEditing) {
        updateBook(book._id, bookData)   // todo: see book var
      } else {
          const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
          })

          if (res.ok) {
            const newBook = await res.json()
            addBook(newBook) 
            // addBook(bookData)
            // resetForm()
          }
      }

      router.push("/my-books")
    } catch (error) {
      console.error("Error saving book:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.title && formData.author && formData.category && formData.condition && formData.price

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {isEditing ? "Edit Book Listing" : "List a New Book"}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update your book listing details" : "Fill in the details to list your book for sale"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Book Cover Image</Label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <div className="w-32 h-40 relative rounded-lg overflow-hidden border">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Book cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-40 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a clear image of your book cover. JPG, PNG, or WebP formats accepted.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Book Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter the book title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Enter the author name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN (Optional)</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleInputChange("isbn", e.target.value)}
                placeholder="978-0-123456-78-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedYear">Published Year</Label>
              <Input
                id="publishedYear"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.publishedYear}
                onChange={(e) => handleInputChange("publishedYear", e.target.value)}
                placeholder="2023"
              />
            </div>
          </div>

          {/* Category and Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Condition <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      <Badge
                        variant="outline"
                        className={
                          condition === "Excellent"
                            ? "text-green-600 border-green-600"
                            : condition === "Good"
                              ? "text-blue-600 border-blue-600"
                              : condition === "Fair"
                                ? "text-yellow-600 border-yellow-600"
                                : "text-red-600 border-red-600"
                        }
                      >
                        {condition}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (USD) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the book's condition, any highlights, notes, or other relevant details..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={!isFormValid || isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isEditing ? "Updating..." : "Listing..."}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Listing" : "List Book"}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
