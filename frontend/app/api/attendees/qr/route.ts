import { db } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const qrCode = searchParams.get("code")

  if (!qrCode) {
    return Response.json({ error: "QR code not provided" }, { status: 400 })
  }

  try {
    const result = await db.attendees.getByQR(qrCode)
    const attendee = Array.isArray(result) ? result[0] : result

    if (!attendee) {
      return Response.json({ error: "Attendee not found" }, { status: 404 })
    }

    return Response.json(attendee)
  } catch (error) {
    return Response.json({ error: "Failed to fetch attendee" }, { status: 500 })
  }
}
