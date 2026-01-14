"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EventResponse } from "@/lib/api"
import api from "@/lib/api"
import { Loader2, X } from "lucide-react"
import { format } from "date-fns"

interface UpdateEventModalProps {
  event: EventResponse
  onClose: () => void
  onEventUpdated: () => void
}

export default function UpdateEventModal({ event, onClose, onEventUpdated }: UpdateEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "CLOSED",
  })

  useEffect(() => {
    // Parse the event data into form fields
    const startDate = new Date(event.startAt)
    const endDate = new Date(event.endAt)
    
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location || "",
      date: format(startDate, "yyyy-MM-dd"),
      startTime: format(startDate, "HH:mm"),
      endTime: format(endDate, "HH:mm"),
      status: event.status,
    })
  }, [event])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Combine date and time into ISO 8601 format
      const startAt = `${formData.date}T${formData.startTime}:00Z`
      const endAt = `${formData.date}T${formData.endTime}:00Z`

      const request = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startAt,
        endAt,
        status: formData.status,
      }

      await api.admin.updateEvent(event.hashId, request)
      onEventUpdated()
      onClose()
    } catch (err: any) {
      console.error("Failed to update event:", err)
      setError(err.response?.data?.message || err.message || "Failed to update event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen px-4 py-6 sm:py-8 md:py-12 flex items-center justify-center">
        <Card 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-white to-orange-50 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300 my-auto"
        >
          <CardHeader className="border-b-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 sticky top-0 z-10 shadow-sm">
            <div className="flex items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                  <span className="font-khmer">កែប្រែកិច្ចប្រជុំ</span> • Update Event
                </CardTitle>
                <p className="text-xs sm:text-sm text-amber-600 font-khmer">ធ្វើបច្ចុប្បន្នភាពព័ត៌មានកិច្ចប្រជុំ</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="hover:bg-amber-100 rounded-full w-9 h-9 sm:w-10 sm:h-10 p-0 flex-shrink-0 transition-all hover:scale-110"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
              </Button>
            </div>
          </CardHeader>
        <CardContent className="pt-4 sm:pt-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 p-3 sm:p-4 rounded-lg text-sm flex items-start gap-2 sm:gap-3 animate-in slide-in-from-top-2 duration-300">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 text-xs sm:text-sm">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-amber-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">ចំណងជើង</span> • Event Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter event title"
                className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-10 sm:h-11 text-sm sm:text-base transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-amber-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">ពិពណ៌នា</span> • Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter event description"
                className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-sm sm:text-base resize-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-amber-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">ទីតាំង</span> • Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-10 sm:h-11 text-sm sm:text-base transition-all"
              />
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 shadow-inner">
              <h3 className="text-amber-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">កាលបរិច្ឆេទ និង ពេលវេលា</span> • Date & Time
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-amber-800 font-medium text-xs sm:text-sm">
                    <span className="font-khmer">កាលបរិច្ឆេទ</span> • Date *
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-10 sm:h-11 bg-white text-sm sm:text-base transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-amber-800 font-medium text-xs sm:text-sm">
                    <span className="font-khmer">ពេលចាប់ផ្តើម</span> • Start *
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-10 sm:h-11 bg-white text-sm sm:text-base transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-amber-800 font-medium text-xs sm:text-sm">
                    <span className="font-khmer">ពេលបញ្ចប់</span> • End *
                  </Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-10 sm:h-11 bg-white text-sm sm:text-base transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-amber-900 font-semibold text-sm sm:text-base flex items-center gap-2">
                <span className="w-1 h-4 sm:h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">ស្ថានភាព</span> • Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-10 sm:h-11 text-sm sm:text-base transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-amber-300">
                  <SelectItem value="DRAFT" className="text-sm sm:text-base cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></span>
                      <span className="font-khmer">ព្រាង • </span>Draft
                    </div>
                  </SelectItem>
                  <SelectItem value="PUBLISHED" className="text-sm sm:text-base cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></span>
                      <span className="font-khmer">បោះពុម្ពផ្សាយ • </span>Published
                    </div>
                  </SelectItem>
                  <SelectItem value="CLOSED" className="text-sm sm:text-base cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
                      <span className="font-khmer">បិទ • </span>Closed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t-2 border-amber-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 hover:text-black h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base transition-all hover:scale-105"
              >
                <span className="font-khmer">បោះបង់ • </span>Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:text-black shadow-lg hover:shadow-xl transition-all h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    <span className="font-khmer text-xs sm:text-sm">កំពុងធ្វើបច្ចុប្បន្នភាព...</span>
                  </>
                ) : (
                  <>
                    <span className="font-khmer">ធ្វើបច្ចុប្បន្នភាព • </span>Update Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
