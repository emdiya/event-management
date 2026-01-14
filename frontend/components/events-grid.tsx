"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchEvents } from "@/lib/redux/slices/eventsSlice"
import EventCard from "./event-card"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

export function EventsGrid() {
  const dispatch = useAppDispatch()
  const { items: events, loading, error, pagination } = useAppSelector((state) => state.events)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    dispatch(fetchEvents({ page: currentPage, size: pageSize }))
  }, [dispatch, currentPage])

  const eventsList = Array.isArray(events) ? events : []

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
          <p className="text-amber-700 font-semibold font-khmer">កំពុងផ្ទុក... • Loading events</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-2 border-red-400 bg-gradient-to-br from-red-50 to-rose-50 shadow-lg rounded-xl">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-800 text-lg">
                <span className="font-khmer">បរាជ័យក្នុងការផ្ទុក • </span>Failed to load events
              </p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (eventsList.length === 0) {
    return (
      <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg rounded-xl">
        <CardContent className="py-12 text-center">
          <p className="text-amber-800 font-semibold text-lg mb-2">
            <span className="font-khmer">មិនមានកិច្ចប្រជុំ • </span>No events available
          </p>
          <p className="text-sm text-amber-600 font-khmer">សូមពិនិត្យមើលនៅពេលក្រោយ!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsList.map((event) => (
          <EventCard key={event.hashId ?? event.id} event={event} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-xl p-4 shadow-md">
          <div className="text-sm font-semibold text-amber-800 text-center sm:text-left">
            <span className="font-khmer">ទំព័រ</span> {pagination.currentPage} <span className="font-khmer">នៃ</span>{" "}
            {pagination.totalPages}
            <span className="ml-2 text-amber-600 font-medium">
              ({pagination.totalItems} <span className="font-khmer">កិច្ចប្រជុំ</span>)
            </span>
          </div>

          <div className="flex gap-2">
            {/* ✅ Show Previous only if available */}
            {pagination.hasPrevious && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                className="border-2 border-amber-600 text-amber-700 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-black font-semibold shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="font-khmer">មុន</span> <span className="hidden sm:inline">• Previous</span>
              </Button>
            )}

            {/* ✅ Show Next only if available */}
            {pagination.hasNext && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                className="border-2 border-amber-600 text-amber-700 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-black font-semibold shadow-sm"
              >
                <span className="font-khmer">បន្ទាប់</span> <span className="hidden sm:inline">• Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
