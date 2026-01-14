import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const result = await db.events.getById(id)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json() // Updated line
    const result = await db.events.update(id, body)
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    await db.events.delete(id)
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
