import { cookies } from "next/headers"

export async function getSessionUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  try {
    // In production, validate token with database
    // For now, just check if it exists
    return sessionToken
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getSessionUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}
