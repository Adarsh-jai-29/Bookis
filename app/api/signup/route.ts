import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/dbConnect";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return NextResponse.json({ message: "Signup successful", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
