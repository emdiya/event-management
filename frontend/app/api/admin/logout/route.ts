import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session_token")

    return Response.json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
