import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    // Insert sample events
    const events = await sql(`
      INSERT INTO events (title, description, date, start_time, end_time, location, max_capacity, current_attendance, status)
      VALUES 
        ('Tech Conference 2024', 'Join us for an amazing tech conference with industry leaders', '2024-02-20', '09:00', '17:00', 'Bangkok Convention Center', 500, 120, 'published'),
        ('Web Development Workshop', 'Learn modern web development with React and Next.js', '2024-02-25', '14:00', '18:00', 'Tech Hub Bangkok', 50, 35, 'published'),
        ('Startup Networking Meetup', 'Connect with fellow entrepreneurs and startup founders', '2024-03-05', '18:00', '20:00', 'Co-working Space', 100, 60, 'published'),
        ('AI & Machine Learning Seminar', 'Explore the latest trends in artificial intelligence', '2024-03-15', '10:00', '16:00', 'Innovation Hub', 200, 85, 'published'),
        ('Cloud Computing Certification', 'Get certified in AWS and cloud technologies', '2024-03-20', '09:00', '17:00', 'Training Center', 30, 28, 'published')
      RETURNING *
    `)

    return Response.json({
      message: "Events seeded successfully",
      events,
    })
  } catch (error: any) {
    console.error("Seeding error:", error)
    return Response.json({ error: "Failed to seed events", details: error.message }, { status: 500 })
  }
}
