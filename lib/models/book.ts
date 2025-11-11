import mongoose, { Schema, Document } from 'mongoose'

export interface IBook extends Document {
  sellerId?: mongoose.Types.ObjectId;
  sellerName?: string;
  title: string
  author: string
  isbn: string
  publishedYear: number
  category: string
  condition: string
  price: number
  description: string
  image: string
  createdAt?: Date
}

const BookSchema = new Schema<IBook>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, },
    sellerName: { type: String, default: '' },
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, default: '' },
    publishedYear: { type: Number, default: new Date().getFullYear() },
    category: { type: String, default: '' },
    condition: { type: String, default: '' },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    
  },
  { timestamps: true }
)

// Prevent model overwrite in Next.js hot reload
export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema)
