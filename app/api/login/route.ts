import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/dbConnect";
import { User } from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Optional: set cookie
    const response = NextResponse.json({ message: "Login successful", token, user }, { status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure : true,
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
