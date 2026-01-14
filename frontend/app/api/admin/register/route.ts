import { hashPassword, generateSessionToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    // This is a placeholder - in production, save to database and handle duplicates
    const sessionToken = generateSessionToken()

    const cookieStore = await cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return Response.json({ success: true, message: "Admin user created" }, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Registration failed" }, { status: 500 })
  }
}
