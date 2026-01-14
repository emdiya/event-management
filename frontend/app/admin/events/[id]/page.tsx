"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/lib/types"

export default function EditEventPage() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`)
      const data = await res.json()
      const eventData = Array.isArray(data) ? data[0] : data
      setEvent(eventData)
      setFormData(eventData)
    } catch (error) {
      console.error("Failed to fetch event:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert("Event updated successfully!")
        fetchEvent()
      }
    } catch (error) {
      alert("Failed to update event")
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!event) return <div className="flex items-center justify-center min-h-screen">Event not found</div>

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => window.history.back()} className="mb-6">
          ← Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date?.split("T")[0] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Capacity</label>
                <input
                  type="number"
                  name="max_capacity"
                  value={formData.max_capacity || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-md bg-background"
                />
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
