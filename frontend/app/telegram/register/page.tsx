"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import api, { type EventResponse } from "@/lib/api"
import { RegistrationModal } from "@/components/registration-modal"
import { Button } from "@/components/ui/button"

export default function TelegramRegisterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const eventKey = useMemo(() => {
    return searchParams.get("code") || searchParams.get("event") || searchParams.get("id")
  }, [searchParams])

  const [event, setEvent] = useState<EventResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!eventKey) {
      setError("Missing event code.")
      setLoading(false)
      return
    }

    let active = true

    async function loadEvent() {
      try {
        const response = await api.events.getByHashId(eventKey)
        if (active) {
          setEvent(response.data)
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || "Failed to load event.")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadEvent()

    return () => {
      active = false
    }
  }, [eventKey])

  const handleClose = () => {
    const tg = window.Telegram?.WebApp
    if (tg?.close) {
      tg.close()
      return
    }
    if (event?.hashId) {
      router.push(`/events/${event.hashId}`)
    } else {
      router.push("/")
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      handleClose()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      <div className="min-h-screen flex items-center justify-center px-4">
        {loading && (
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600 mx-auto mb-3" />
            <p className="text-amber-700">Loading event...</p>
          </div>
        )}

        {!loading && error && (
          <div className="max-w-md w-full bg-white/90 border-2 border-red-200 rounded-xl p-6 text-center space-y-4 shadow-md">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-red-700">Unable to open registration</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-5"
            >
              Close
            </Button>
          </div>
        )}

        {!loading && event && !error && (
          <RegistrationModal event={event} open={open} onOpenChange={handleOpenChange} />
        )}
      </div>
    </main>
  )
}
