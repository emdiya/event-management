"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import type { EventResponse } from "@/lib/api"
import api from "@/lib/api"
import AdminEventList from "@/components/admin-event-list"
import CreateEventModal from "@/components/create-event-modal"

export default function AdminDashboard() {
  const router = useRouter()
  const [events, setEvents] = useState<EventResponse[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [currentPage])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await api.admin.getAllEvents({ page: currentPage - 1, size: 10 })
      setEvents(response.data)
      setPagination(response.pagination)
      setError("")
    } catch (error) {
      console.error("Failed to fetch events:", error)
      setError("Failed to load events from backend")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLogout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem("authToken")
      localStorage.removeItem("username")
      localStorage.removeItem("roles")
      
      // Redirect to login
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
      router.push("/admin/login")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Traditional Khmer Pattern Border */}
      <div className="h-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600" />
      
      {/* Header */}
      <header className="border-b-4 border-amber-600/30 bg-gradient-to-r from-amber-50/95 via-white/95 to-orange-50/95 backdrop-blur shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  <span className="font-khmer">គ្រប់គ្រង</span> • Dashboard
                </h1>
                <p className="text-amber-700 mt-1 font-khmer">គ្រប់គ្រងកិច្ចប្រជុំ និងអ្នកចូលរួម</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                + <span className="font-khmer">បង្កើតកិច្ចប្រជុំ</span>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-amber-600 text-amber-700 hover:bg-amber-50">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-amber-200/50 bg-white/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-700 font-khmer">សរុបកិច្ចប្រជុំ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{events.length}</div>
              <p className="text-xs text-amber-600 mt-1">Total Meetings</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200/50 bg-white/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 font-khmer">កិច្ចប្រជុំដែលបោះពុម្ពផ្សាយ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{events.filter(e => e.status === 'PUBLISHED').length}</div>
              <p className="text-xs text-orange-600 mt-1">Published Meetings</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200/50 bg-white/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700 font-khmer">កិច្ចប្រជុំខាងមុខ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">{events.filter((e) => new Date(e.startAt) > new Date()).length}</div>
              <p className="text-xs text-red-600 mt-1">Upcoming Meetings</p>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card className="border-2 border-amber-200/50 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-amber-700 to-red-600 bg-clip-text text-transparent">
              <span className="font-khmer">កិច្ចប្រជុំរបស់អ្នក</span> • Your Meetings
            </CardTitle>
            <CardDescription>Manage and monitor all your meetings and conferences</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
                <p className="mt-4 text-amber-700 font-khmer">កំពុងផ្ទុក...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-amber-700">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                <p className="font-khmer text-lg mb-2">មិនមានកិច្ចប្រជុំ</p>
                <p className="text-sm">No meetings created yet. Create your first meeting to get started!</p>
              </div>
            ) : (
              <AdminEventList 
                events={events} 
                pagination={pagination}
                onEventUpdated={fetchEvents}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onEventCreated={() => {
            setShowCreateModal(false)
            fetchEvents()
          }}
        />
      )}
    </main>
  )
}
