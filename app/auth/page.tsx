import { LoginForm } from "@/components/auth/login-form"
import { connectDB } from "@/lib/dbConnect";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
