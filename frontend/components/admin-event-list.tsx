"use client"

import type { EventResponse, PaginationMetadata } from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin, Users, Edit, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { useState } from "react"
import UpdateEventModal from "./update-event-modal"
import DeleteEventModal from "./delete-event-modal"

export default function AdminEventList({ 
  events, 
  pagination,
  onEventUpdated,
  onPageChange 
}: { 
  events: EventResponse[]; 
  pagination?: PaginationMetadata;
  onEventUpdated: () => void;
  onPageChange?: (page: number) => void;
}) {
  const [editingEvent, setEditingEvent] = useState<EventResponse | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<EventResponse | null>(null)

  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-400",
      PUBLISHED: "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-400",
      CLOSED: "bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border-red-400"
    }
    const icons = {
      DRAFT: "⏸",
      PUBLISHED: "✓",
      CLOSED: "✕"
    }
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border-2 shadow-sm ${styles[status as keyof typeof styles] || styles.DRAFT}`}>
        <span className="text-base">{icons[status as keyof typeof icons] || icons.DRAFT}</span>
        <span className="font-khmer">
          {status === "DRAFT" && "ព្រាង"}
          {status === "PUBLISHED" && "បានបោះពុម្ព"}
          {status === "CLOSED" && "បិទ"}
        </span>
        <span className="hidden sm:inline">• {status}</span>
      </span>
    )
  }

  return (
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto rounded-xl border-2 border-amber-300 shadow-lg">
        <table className="w-full table-fixed lg:table-auto">
          <thead className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 sticky top-0 z-10">
            <tr className="border-b-2 border-amber-400">
              <th className="text-left py-4 px-4 lg:px-6 font-bold text-amber-900 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full"></span>
                  <span className="font-khmer">កិច្ចប្រជុំ</span> • Event
                </div>
              </th>
              <th className="text-left py-4 px-3 lg:px-4 font-bold text-amber-900 whitespace-nowrap">
                <span className="font-khmer">លេខកូដ</span> <span className="hidden lg:inline">• Code</span>
              </th>
              <th className="text-left py-4 px-3 lg:px-4 font-bold text-amber-900 whitespace-nowrap">
                <span className="font-khmer">កាលបរិច្ឆេទ</span> <span className="hidden lg:inline">• Date</span>
              </th>
              <th className="text-left py-4 px-3 lg:px-4 font-bold text-amber-900 whitespace-nowrap">
                <span className="font-khmer">ទីតាំង</span> <span className="hidden lg:inline">• Location</span>
              </th>
              <th className="text-left py-4 px-3 lg:px-4 font-bold text-amber-900 whitespace-nowrap">
                <span className="font-khmer">ស្ថានភាព</span> <span className="hidden lg:inline">• Status</span>
              </th>
              <th className="text-right py-4 px-4 lg:px-6 font-bold text-amber-900 whitespace-nowrap">
                <span className="font-khmer">សកម្មភាព</span> <span className="hidden lg:inline">• Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-amber-100">
            {events.map((event, index) => (
              <tr 
                key={event.hashId} 
                className={`hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'
                }`}
              >
                <td className="py-4 px-4 lg:px-6">
                  <div className="font-semibold text-amber-900 text-sm lg:text-base mb-1.5 line-clamp-2 leading-snug">{event.title}</div>
                  <div className="text-xs lg:text-sm text-amber-600/80 line-clamp-2 leading-relaxed">{event.description}</div>
                </td>
                <td className="py-4 px-3 lg:px-4 align-top">
                  <code className="text-xs lg:text-sm bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-md border-2 border-amber-300 font-mono font-semibold whitespace-nowrap block w-fit shadow-sm">
                    {event.code}
                  </code>
                </td>
                <td className="py-4 px-3 lg:px-4 align-top">
                  <div className="flex items-center gap-1.5 text-xs lg:text-sm mb-1.5">
                    <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-amber-900 font-semibold whitespace-nowrap">
                      {format(new Date(event.startAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="text-xs text-amber-600 pl-5 lg:pl-5.5 whitespace-nowrap font-medium">
                    {format(new Date(event.startAt), "HH:mm")} - {format(new Date(event.endAt), "HH:mm")}
                  </div>
                </td>
                <td className="py-4 px-3 lg:px-4 align-top">
                  {event.location ? (
                    <div className="flex items-center gap-1.5 text-xs lg:text-sm">
                      <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="text-amber-900 line-clamp-2 font-medium">{event.location}</span>
                    </div>
                  ) : (
                    <span className="text-amber-400 text-xs lg:text-sm italic">Not specified</span>
                  )}
                </td>
                <td className="py-4 px-3 lg:px-4 align-top">
                  {getStatusBadge(event.status)}
                </td>
                <td className="py-4 px-4 lg:px-6 text-right align-top">
                  <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 items-end lg:items-center justify-end max-w-xs ml-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-2 border-amber-600 text-amber-700 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-black font-semibold transition-all shadow-sm hover:shadow-md w-full lg:w-auto"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="w-4 h-4 lg:mr-1.5" />
                      <span className="hidden lg:inline">Edit</span>
                    </Button>
                    <Link href={`/admin/dashboard/event/${event.hashId}`} className="w-full lg:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-2 border-blue-600 text-blue-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-black font-semibold transition-all shadow-sm hover:shadow-md"
                      >
                        <Users className="w-4 h-4 lg:mr-1.5" />
                        <span className="hidden lg:inline">View</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-2 border-red-500 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-black font-semibold transition-all shadow-sm hover:shadow-md w-full lg:w-auto"
                      onClick={() => setDeletingEvent(event)}
                    >
                      <Trash2 className="w-4 h-4 lg:mr-1.5" />
                      <span className="hidden lg:inline">Delete</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Shown only on small screens */}
      <div className="md:hidden space-y-4">
        {events.map((event) => (
          <div 
            key={event.hashId} 
            className="bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 border-2 border-amber-300 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
          >
            {/* Header with Title and Status */}
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-amber-900 text-base mb-2 line-clamp-2 leading-snug">{event.title}</h3>
                <code className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-1.5 rounded-md border-2 border-amber-300 font-mono font-semibold shadow-sm inline-block">
                  {event.code}
                </code>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(event.status)}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <p className="text-sm text-amber-700/80 mb-3 line-clamp-2 leading-relaxed bg-white/50 p-2.5 rounded-lg border border-amber-200">
                {event.description}
              </p>
            )}

            {/* Date & Time */}
            <div className="flex items-start gap-2.5 text-sm text-amber-800 mb-2.5 bg-white/70 p-2.5 rounded-lg border border-amber-200">
              <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-amber-900">{format(new Date(event.startAt), "MMM dd, yyyy")}</div>
                <div className="text-xs text-amber-600 mt-0.5 font-medium">
                  {format(new Date(event.startAt), "HH:mm")} - {format(new Date(event.endAt), "HH:mm")}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2.5 text-sm text-amber-800 mb-4 bg-white/70 p-2.5 rounded-lg border border-amber-200">
              <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="flex-1 font-medium">
                {event.location || <span className="text-amber-400 italic">Not specified</span>}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-amber-300">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-2 border-amber-600 text-amber-700 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-black font-semibold shadow-sm"
                onClick={() => setEditingEvent(event)}
              >
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
              <Link href={`/admin/dashboard/event/${event.hashId}`} className="flex-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-2 border-blue-600 text-blue-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-black font-semibold shadow-sm"
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  View
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-2 border-red-500 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-black font-semibold shadow-sm"
                onClick={() => setDeletingEvent(event)}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-xl p-4 shadow-md">
          <div className="text-sm font-semibold text-amber-800 text-center sm:text-left">
            <span className="font-khmer">ទំព័រ</span> {pagination.currentPage} <span className="font-khmer">នៃ</span> {pagination.totalPages}
            <span className="ml-2 text-amber-600 font-medium">
              ({pagination.totalItems} <span className="font-khmer">សរុប</span>)
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevious}
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              className="border-2 border-amber-600 text-amber-700 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="font-khmer">មុន</span> <span className="hidden sm:inline">• Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              className="border-2 border-amber-600 text-amber-700 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="font-khmer">បន្ទាប់</span> <span className="hidden sm:inline">• Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {editingEvent && (
        <UpdateEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventUpdated={() => {
            setEditingEvent(null)
            onEventUpdated()
          }}
        />
      )}

      {deletingEvent && (
        <DeleteEventModal
          eventId={deletingEvent.hashId}
          eventTitle={deletingEvent.title}
          onClose={() => setDeletingEvent(null)}
          onEventDeleted={() => {
            setDeletingEvent(null)
            onEventUpdated()
          }}
        />
      )}
    </>
  )
}
