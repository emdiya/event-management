"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api, { type CreateEventRequest } from "@/lib/api"
import { Loader2, X } from "lucide-react"

interface CreateEventModalProps {
  onClose: () => void
  onEventCreated: () => void
}

export default function CreateEventModal({ onClose, onEventCreated }: CreateEventModalProps) {
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
      const startAt = `${formData.date}T${formData.startTime}:00+00:00`
      const endAt = `${formData.date}T${formData.endTime}:00+00:00`

      const request: CreateEventRequest = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startAt,
        endAt,
        status: formData.status,
      }

      await api.events.create(request)
      onEventCreated()
      onClose()
    } catch (err: any) {
      console.error("Failed to create event:", err)
      setError(err.response?.data?.message || err.message || "Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-white to-orange-50 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative z-[101]">
        <CardHeader className="border-b-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl lg:text-3xl bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                <span className="font-khmer">បង្កើតកិច្ចប្រជុំ</span> • Create New Event
              </CardTitle>
              <p className="text-sm text-amber-600 font-khmer">បង្កើតកិច្ចប្រជុំថ្មីមួយ</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              disabled={loading}
              className="hover:bg-amber-100 rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5 text-amber-700" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-lg text-sm flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-amber-900 font-semibold text-base flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">ចំណងជើង</span> • Event Title *
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter event title"
                className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-amber-900 font-semibold text-base flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">ពិពណ៌នា</span> • Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your event"
                className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 text-base resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-amber-900 font-semibold text-base flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">ទីតាំង</span> • Location *
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Event venue or address"
                className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-11 text-base"
              />
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 space-y-4">
              <h3 className="text-amber-900 font-semibold text-base flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">កាលបរិច្ឆេទ និង ពេលវេលា</span> • Date & Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-amber-800 font-medium text-sm">
                    <span className="font-khmer">កាលបរិច្ឆេទ</span> • Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-11 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-amber-800 font-medium text-sm">
                    <span className="font-khmer">ពេលចាប់ផ្តើម</span> • Start *
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-11 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-amber-800 font-medium text-sm">
                    <span className="font-khmer">ពេលបញ្ចប់</span> • End *
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-11 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-amber-900 font-semibold text-base flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
                <span className="font-khmer">ស្ថានភាព</span> • Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "DRAFT" | "PUBLISHED" | "CLOSED") =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-11 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-amber-300">
                  <SelectItem value="DRAFT" className="text-base">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                      <span className="font-khmer">ព្រាង • </span>Draft
                    </div>
                  </SelectItem>
                  <SelectItem value="PUBLISHED" className="text-base">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="font-khmer">បោះពុម្ពផ្សាយ • </span>Published
                    </div>
                  </SelectItem>
                  <SelectItem value="CLOSED" className="text-base">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="font-khmer">បិទ • </span>Closed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-amber-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
                className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 h-11 px-6 text-base order-2 sm:order-1"
              >
                <span className="font-khmer">បោះបង់ • </span>Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all h-11 px-6 text-base order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span className="font-khmer">កំពុងបង្កើត...</span>
                  </>
                ) : (
                  <>
                    <span className="font-khmer">បង្កើត • </span>Create Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
