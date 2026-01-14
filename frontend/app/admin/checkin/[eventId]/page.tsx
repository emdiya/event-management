"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event, Attendee } from "@/lib/types"
import QRScanner from "@/components/qr-scanner"
import CheckinStats from "@/components/checkin-stats"

export default function CheckInPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [event, setEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [scanMode, setScanMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchEventData()
  }, [eventId])

  const fetchEventData = async () => {
    try {
      const [eventRes, attendeesRes] = await Promise.all([
        fetch(`/api/events/${eventId}`),
        fetch(`/api/events/${eventId}/attendees`),
      ])

      if (eventRes.ok) {
        const eventData = await eventRes.json()
        setEvent(Array.isArray(eventData) ? eventData[0] : eventData)
      }

      if (attendeesRes.ok) {
        const attendeesData = await attendeesRes.json()
        setAttendees(Array.isArray(attendeesData) ? attendeesData : [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (qrCode: string) => {
    try {
      const res = await fetch(`/api/attendees/qr?code=${qrCode}`)
      const attendee = await res.json()

      if (attendee.error) {
        alert("Attendee not found")
        return
      }

      if (attendee.checked_in) {
        alert(`${attendee.name} already checked in`)
        return
      }

      const checkInRes = await fetch(`/api/attendees/${attendee.id}/checkin`, {
        method: "POST",
      })

      if (checkInRes.ok) {
        alert(`✓ ${attendee.name} checked in successfully!`)
        fetchEventData()
      }
    } catch (error) {
      console.error("Check-in failed:", error)
      alert("Check-in failed. Please try again.")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Event not found</div>
  }

  const filteredAttendees = attendees.filter(
    (a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery),
  )

  const checkedInCount = attendees.filter((a) => a.checked_in).length

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{event.title} - Check-in</h1>
              <p className="text-muted-foreground mt-1">{new Date(event.date).toLocaleDateString()}</p>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              ← Back
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner */}
          <div className="lg:col-span-2">
            {scanMode ? (
              <QRScanner onScan={handleCheckIn} eventId={eventId} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Manual Search</CardTitle>
                  <CardDescription>Search for attendee by name or email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredAttendees.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No attendees found</p>
                    ) : (
                      filteredAttendees.map((attendee) => (
                        <div
                          key={attendee.id}
                          className="flex justify-between items-center p-4 border border-border rounded-md hover:bg-muted/50"
                        >
                          <div>
                            <p className="font-semibold">{attendee.name}</p>
                            <p className="text-sm text-muted-foreground">{attendee.email}</p>
                          </div>
                          <Button
                            size="sm"
                            variant={attendee.checked_in ? "outline" : "default"}
                            disabled={attendee.checked_in}
                            onClick={() => {
                              if (!attendee.checked_in) {
                                handleCheckIn(attendee.qr_code)
                              }
                            }}
                          >
                            {attendee.checked_in ? "✓ Checked In" : "Check In"}
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <CheckinStats
              total={attendees.length}
              checkedIn={checkedInCount}
              remaining={attendees.length - checkedInCount}
            />

            <Card>
              <CardHeader>
                <CardTitle>Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={scanMode ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setScanMode(true)}
                  >
                    QR Scanner
                  </Button>
                  <Button
                    variant={!scanMode ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setScanMode(false)}
                  >
                    Manual Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
