import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  favorites?: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: {type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model<IUser>("User", userSchema);