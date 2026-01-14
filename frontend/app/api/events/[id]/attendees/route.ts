import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const result = await db.attendees.getByEvent(id)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: "Failed to fetch attendees" }, { status: 500 })
  }
}
