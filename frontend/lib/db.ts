import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const db = {
  query: (text: string, values?: any[]) => sql(text, values),
  events: {
    getAll: () => sql("SELECT * FROM events ORDER BY date DESC"),
    getById: (id: string) => sql("SELECT * FROM events WHERE id = $1", [id]),
    create: (data: any) =>
      sql(
        "INSERT INTO events (title, description, date, start_time, end_time, location, max_capacity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [data.title, data.description, data.date, data.start_time, data.end_time, data.location, data.max_capacity],
      ),
    update: (id: string, data: any) =>
      sql(
        "UPDATE events SET title = $1, description = $2, date = $3, start_time = $4, end_time = $5, location = $6, max_capacity = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *",
        [data.title, data.description, data.date, data.start_time, data.end_time, data.location, data.max_capacity, id],
      ),
    delete: (id: string) => sql("DELETE FROM events WHERE id = $1", [id]),
  },
  attendees: {
    getByEvent: (eventId: string) =>
      sql("SELECT * FROM attendees WHERE event_id = $1 ORDER BY registration_date DESC", [eventId]),
    getByQR: (qrCode: string) => sql("SELECT * FROM attendees WHERE qr_code = $1", [qrCode]),
    register: (data: any) =>
      sql("INSERT INTO attendees (event_id, name, email, phone, qr_code) VALUES ($1, $2, $3, $4, $5) RETURNING *", [
        data.eventId,
        data.name,
        data.email,
        data.phone,
        data.qrCode,
      ]),
    checkIn: (attendeeId: string) =>
      sql("UPDATE attendees SET checked_in = true, checked_in_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *", [
        attendeeId,
      ]),
  },
}
