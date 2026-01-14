import { generateSessionToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return Response.json({ error: "Missing credentials" }, { status: 400 })
    }

    // Mock authentication - in production, query database
    // This is a demonstration; implement proper user lookup
    const isValid = username === "admin" && password === "admin123"

    if (!isValid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const sessionToken = generateSessionToken()

    const cookieStore = await cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({ success: true, token: sessionToken })
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
