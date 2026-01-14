"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EventResponse } from "@/lib/api"
import api from "@/lib/api"
import { CalendarIcon, MapPinIcon, ClockIcon, Loader2, ArrowLeft, Calendar, Edit, Trash2, Users } from "lucide-react"
import { format, parseISO } from "date-fns"
import UpdateEventModal from "@/components/update-event-modal"
import DeleteEventModal from "@/components/delete-event-modal"

export default function AdminEventDetail() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const [event, setEvent] = useState<EventResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await api.events.getByHashId(eventId)
      setEvent(response.data)
      setError(null)
    } catch (error: any) {
      console.error("Failed to fetch event:", error)
      setError(error.message || "Failed to load event")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <div className="h-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600" />
        <div className="flex items-center justify-center min-h-[calc(100vh-8px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-amber-700 font-khmer">កំពុងផ្ទុក...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <div className="h-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600" />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8px)] gap-4 px-4">
          <Calendar className="w-20 h-20 text-amber-400" />
          <p className="text-xl text-amber-900 font-khmer">រកមិនឃើញកិច្ចប្រជុំ</p>
          <p className="text-amber-700">{error || "Event not found"}</p>
          <Button 
            variant="outline" 
            onClick={() => router.push("/admin/dashboard")}
            className="border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    )
  }

  const startDate = parseISO(event.startAt)
  const endDate = parseISO(event.endAt)
  const formattedDate = format(startDate, "MMMM dd, yyyy")
  const startTime = format(startDate, "HH:mm")
  const endTime = format(endDate, "HH:mm")

  const statusColors = {
    DRAFT: "bg-gray-100 text-gray-800 border-gray-300",
    PUBLISHED: "bg-green-100 text-green-800 border-green-300",
    CLOSED: "bg-red-100 text-red-800 border-red-300",
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
      {/* Traditional Khmer Pattern Border */}
      <div className="h-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600" />
      
      {/* Header */}
      <header className="border-b-4 border-amber-600/30 bg-gradient-to-r from-amber-50/95 via-white/95 to-orange-50/95 backdrop-blur shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push("/admin/dashboard")}
                className="border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    <span className="font-khmer">ព័ត៌មានកិច្ចប្រជុំ</span> • Event Details
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-black"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowDeleteModal(true)}
                className="border-red-400 text-red-600 hover:bg-red-400 hover:text-black"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Details - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-amber-200/50 bg-white/80 backdrop-blur shadow-lg">
              <CardHeader className="border-b-2 border-amber-200/50">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-2xl sm:text-3xl mb-3 text-amber-900 break-words">
                      {event.title}
                    </CardTitle>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-amber-700">
                        <MapPinIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <span className="text-base font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusColors[event.status]}`}>
                          {event.status}
                        </span>
                        <code className="text-xs bg-amber-100 px-3 py-1 rounded border border-amber-200 font-mono">
                          {event.code}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-red-600 rounded-full"></span>
                    <span className="font-khmer">ពិពណ៌នា</span> • Description
                  </h3>
                  <p className="text-amber-800 whitespace-pre-wrap leading-relaxed pl-4 border-l-2 border-amber-200">
                    {event.description}
                  </p>
                </div>

                {/* Date and Time Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t-2 border-amber-200/50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-khmer text-amber-600">កាលបរិច្ឆេទ</p>
                        <p className="text-sm font-medium">Date</p>
                      </div>
                    </div>
                    <p className="font-semibold text-xl text-amber-900 pl-10">{formattedDate}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-700">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-khmer text-amber-600">ពេលវេលា</p>
                        <p className="text-sm font-medium">Time</p>
                      </div>
                    </div>
                    <p className="font-semibold text-xl text-amber-900 pl-10">
                      {startTime} - {endTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="border-2 border-amber-200/50 bg-white/80 backdrop-blur shadow-lg">
              <CardHeader className="border-b-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardTitle className="text-xl text-amber-900">
                  <span className="font-khmer">ស្ថិតិ</span> • Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-khmer">អ្នកចុះឈ្មោះ</p>
                        <p className="text-sm font-medium text-blue-900">Registrations</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">0</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-khmer">បានចូលរួម</p>
                        <p className="text-sm font-medium text-green-900">Checked In</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-900">0</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-amber-200">
                  <p className="text-xs text-amber-600 text-center font-khmer">
                    ស្ថិតិនឹងត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិ
                  </p>
                  <p className="text-xs text-amber-600 text-center">
                    Stats will be updated automatically
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Event Info Card */}
            <Card className="border-2 border-amber-200/50 bg-white/80 backdrop-blur shadow-lg">
              <CardHeader className="border-b-2 border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardTitle className="text-xl text-amber-900">
                  <span className="font-khmer">ព័ត៌មានបន្ថែម</span> • Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-xs text-amber-600 font-khmer mb-1">លេខកូដ • Event Code</p>
                  <code className="text-sm font-mono bg-amber-100 px-3 py-2 rounded border border-amber-200 block">
                    {event.code}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-khmer mb-1">ស្ថានភាព • Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-khmer mb-1">Hash ID</p>
                  <code className="text-xs font-mono bg-amber-50 px-2 py-1 rounded border border-amber-200 block break-all">
                    {event.hashId}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Event Modal */}
      {showEditModal && event && (
        <UpdateEventModal
          event={event}
          onClose={() => setShowEditModal(false)}
          onEventUpdated={() => {
            setShowEditModal(false)
            fetchEvent()
          }}
        />
      )}

      {/* Delete Event Modal */}
      {showDeleteModal && event && (
        <DeleteEventModal
          eventId={event.hashId}
          eventTitle={event.title}
          onClose={() => setShowDeleteModal(false)}
          onEventDeleted={() => {
            setShowDeleteModal(false)
            router.push("/admin/dashboard")
          }}
        />
      )}
    </main>
  )
}
