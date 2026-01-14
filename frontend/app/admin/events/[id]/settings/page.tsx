"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/lib/types"

export default function EventSettingsPage() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [telegramSettings, setTelegramSettings] = useState({
    enabled: false,
    bot_token: "",
    chat_id: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchEventAndSettings()
  }, [eventId])

  const fetchEventAndSettings = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`)
      const data = await res.json()
      const eventData = Array.isArray(data) ? data[0] : data
      setEvent(eventData)

      // In production, fetch actual telegram settings from database
      // For now, initialize with empty values
    } catch (error) {
      console.error("Failed to fetch event:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setTelegramSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveTelegramSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/events/${eventId}/telegram-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          ...telegramSettings,
        }),
      })

      if (res.ok) {
        alert("Telegram settings saved successfully!")
      } else {
        alert("Failed to save Telegram settings")
      }
    } catch (error) {
      alert("An error occurred while saving settings")
    } finally {
      setSaving(false)
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
            <CardTitle>Event Settings</CardTitle>
            <CardDescription>{event.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveTelegramSettings} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Telegram Bot Integration</h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="telegram-enabled"
                      name="enabled"
                      checked={telegramSettings.enabled}
                      onChange={handleTelegramChange}
                      className="w-4 h-4"
                    />
                    <label htmlFor="telegram-enabled" className="text-sm font-medium cursor-pointer">
                      Enable Telegram Bot for this event
                    </label>
                  </div>

                  {telegramSettings.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Bot Token</label>
                        <input
                          type="password"
                          name="bot_token"
                          value={telegramSettings.bot_token}
                          onChange={handleTelegramChange}
                          placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                          className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Get your bot token from BotFather on Telegram
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Chat/Group ID</label>
                        <input
                          type="text"
                          name="chat_id"
                          value={telegramSettings.chat_id}
                          onChange={handleTelegramChange}
                          placeholder="-1001234567890"
                          className="w-full px-4 py-2 border border-border rounded-md bg-background"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          ID of the Telegram chat/group where notifications will be sent
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          <strong>Setup Instructions:</strong>
                        </p>
                        <ol className="text-sm text-blue-800 dark:text-blue-200 mt-2 ml-4 list-decimal space-y-1">
                          <li>Create a bot with BotFather (@BotFather)</li>
                          <li>Copy the token and paste it above</li>
                          <li>Create a group and add your bot</li>
                          <li>Get the group ID and paste it above</li>
                        </ol>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
