"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EventResponse } from "@/lib/api"
import { CalendarIcon, MapPinIcon, ClockIcon, Users2Icon } from "lucide-react"
import { format, parseISO } from "date-fns"
import { RegistrationModal } from "@/components/registration-modal"

export default function EventCard({ event }: { event: EventResponse }) {
  const [registrationOpen, setRegistrationOpen] = useState(false)

  // Parse dates
  const startDate = parseISO(event.startAt)
  const endDate = parseISO(event.endAt)

  const formattedDate = format(startDate, "MMM dd, yyyy")
  const startTime = format(startDate, "HH:mm")
  const endTime = format(endDate, "HH:mm")

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: "bg-gray-50 text-gray-700 border-gray-300",
      PUBLISHED: "bg-green-50 text-green-700 border-green-300",
      CLOSED: "bg-red-50 text-red-700 border-red-300"
    }
    const icons = {
      DRAFT: "⏸",
      PUBLISHED: "✓",
      CLOSED: "✕"
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles] || styles.DRAFT}`}>
        <span className="text-sm">{icons[status as keyof typeof icons] || icons.DRAFT}</span>
        <span className="font-khmer text-[10px]">
          {status === "DRAFT" && "ព្រាង"}
          {status === "PUBLISHED" && "បានបោះពុម្ព"}
          {status === "CLOSED" && "បិទ"}
        </span>
      </span>
    )
  }

  return (
    <>
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-2 text-gray-900 font-semibold text-base leading-tight mb-2 group-hover:text-amber-700 transition-colors">{event.title}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 text-gray-600 text-sm">
                <MapPinIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                {event.location || <span className="text-gray-400 italic text-xs">Not specified</span>}
              </CardDescription>
            </div>
            <div className="flex-shrink-0">
              {getStatusBadge(event.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 pb-4">
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{event.description}</p>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
              <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{formattedDate}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
              <ClockIcon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="font-medium text-gray-900">
                {startTime} - {endTime}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <Link href={`/events/${event.hashId}`} className="flex-1">
              <Button variant="outline" className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium text-sm">
                <span className="font-khmer text-xs">មើល • </span>View
              </Button>
            </Link>
            <Button
              onClick={() => setRegistrationOpen(true)}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm disabled:opacity-50"
              disabled={event.status !== "PUBLISHED"}
            >
              <span className="font-khmer text-xs">ចុះឈ្មោះ • </span>Register
            </Button>
          </div>
        </CardContent>
      </Card>

      <RegistrationModal event={event} open={registrationOpen} onOpenChange={setRegistrationOpen} />
    </>
  )
}

