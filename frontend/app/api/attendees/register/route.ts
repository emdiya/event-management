import { db } from "@/lib/db"
import { validateAttendeeData } from "@/lib/validation"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validation = validateAttendeeData(body)
    if (!validation.valid) {
      return Response.json({ error: validation.errors.join(", ") }, { status: 400 })
    }

    const qrCode = uuidv4()

    const result = await db.attendees.register({
      ...body,
      qrCode,
    })

    return Response.json(result, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to register attendee" }, { status: 500 })
  }
}
