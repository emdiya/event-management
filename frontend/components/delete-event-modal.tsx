"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, X, Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import api from "@/lib/api"

interface DeleteEventModalProps {
  eventId: string
  eventTitle: string
  onClose: () => void
  onEventDeleted: () => void
}

export default function DeleteEventModal({ eventId, eventTitle, onClose, onEventDeleted }: DeleteEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    try {
      await api.admin.deleteEvent(eventId)
      onEventDeleted()
      onClose()
    } catch (err: any) {
      console.error("Failed to delete event:", err)
      setError(err.response?.data?.message || err.message || "Failed to delete event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen px-4 py-6 sm:py-8 md:py-12 flex items-center justify-center">
        <Card 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md border-2 border-red-300 bg-gradient-to-b from-red-50 via-white to-orange-50 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300 my-auto"
        >
          <CardHeader className="border-b-2 border-red-300 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl sm:text-2xl text-red-700 mb-1">
                    <span className="font-khmer">លុបកិច្ចប្រជុំ</span> • Delete Event
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-red-600 font-khmer">សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="hover:bg-red-100 rounded-full w-9 h-9 sm:w-10 sm:h-10 p-0 flex-shrink-0 transition-all hover:scale-110"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-700" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4 sm:pt-6 pb-6">
            {error && (
              <div className="mb-4 bg-red-100 border-2 border-red-400 text-red-800 p-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
                <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs sm:text-sm">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <p className="text-sm sm:text-base text-gray-700 mb-2">
                  <span className="font-khmer">តើអ្នកពិតជាចង់លុបកិច្ចប្រជុំនេះមែនទេ?</span>
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-3">
                  Are you sure you want to delete this event?
                </p>
                <div className="bg-white border border-amber-300 rounded p-3 mt-3">
                  <p className="text-xs text-amber-700 font-medium mb-1">
                    <span className="font-khmer">ឈ្មោះកិច្ចប្រជុំ • </span>Event Title:
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                    {eventTitle}
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-red-800 font-semibold font-khmer">
                      ការព្រមាន • Warning
                    </p>
                    <p className="text-xs sm:text-sm text-red-700 mt-1">
                      This action cannot be undone. All event data, registrations, and check-ins will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
                className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 hover:text-black h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base transition-all hover:scale-105"
              >
                <span className="font-khmer">បោះបង់ • </span>Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleDelete}
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:text-black shadow-lg hover:shadow-xl transition-all h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    <span className="font-khmer text-xs sm:text-sm">កំពុងលុប...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="font-khmer">លុប • </span>Delete Event
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
