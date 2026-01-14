import { db } from "@/lib/db"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const result = await db.attendees.checkIn(id)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: "Failed to check in" }, { status: 500 })
  }
}
