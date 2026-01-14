"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TelegramNotificationButtonProps {
  eventId: string
  message: string
  buttonText?: string
}

export default function TelegramNotificationButton({
  eventId,
  message,
  buttonText = "Send Telegram Notification",
}: TelegramNotificationButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSendNotification = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          message,
        }),
      })

      if (res.ok) {
        alert("Notification sent successfully!")
      } else {
        alert("Failed to send notification")
      }
    } catch (error) {
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSendNotification} disabled={loading}>
      {buttonText}
    </Button>
  )
}
