import { db } from "@/lib/db"
import { validateEventData } from "@/lib/validation"
import { logError } from "@/lib/logging"

export async function GET() {
  try {
    const result = await db.events.getAll()
    return Response.json(result)
  } catch (error) {
    logError("Failed to fetch events", error)
    return Response.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validation = validateEventData(body)
    if (!validation.valid) {
      return Response.json({ error: validation.errors.join(", ") }, { status: 400 })
    }

    const result = await db.events.create(body)
    return Response.json(result, { status: 201 })
  } catch (error) {
    logError("Failed to create event", error)
    return Response.json({ error: "Failed to create event" }, { status: 500 })
  }
}
