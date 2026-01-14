import { HeroSection } from "@/components/hero-section"
import { EventsGrid } from "@/components/events-grid"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Traditional Khmer Pattern Border */}
      <div className="h-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-amber-600/30 bg-gradient-to-r from-amber-50/95 via-white/95 to-orange-50/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  KD-Event
                </h1>
                <p className="text-xs sm:text-sm text-amber-700 font-medium font-khmer">កិច្ចប្រជុំ សន្និសីទ សិក្ខាសាលា • Meeting & Conference System</p>
              </div>
            </Link>
            <Link href="/admin/login">
              <Button size="default" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg">
                <span className="font-khmer">ចូល</span> • Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <HeroSection />

      {/* Events Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Section Header with Khmer Style */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-amber-300/50" />
            </div>
            <div className="relative flex justify-center">
              <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50 px-6 py-3 rounded-xl border-2 border-amber-400/30 shadow-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-700 to-red-600 bg-clip-text text-transparent">
                    <span className="font-khmer">កិច្ចប្រជុំខាងមុខ</span> • Upcoming Meetings
                  </h2>
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-center text-sm text-amber-700 mt-2 font-medium">
                  <span className="font-khmer">កិច្ចប្រជុំ សន្និសីទ សិក្ខាសាលា និងប្រជុំផ្សេងៗ</span> • Meetings, Conferences, Workshops & More
                </p>
              </div>
            </div>
          </div>
          <EventsGrid />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-amber-600/30 bg-gradient-to-r from-amber-100/50 via-orange-50/50 to-red-100/50 mt-20">
        <div className="h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600" />
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-red-600 bg-clip-text text-transparent">KD-Event</h3>
              </div>
              <p className="text-sm text-amber-800 font-khmer">ប្រព័ន្ធគ្រប់គ្រងកិច្ចប្រជុំ សន្និសីទ និងសិក្ខាសាលា<br/>Meeting, Conference & Workshop Management System</p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-sm text-foreground">Product</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/events" className="hover:text-foreground transition">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-sm text-foreground">For Organizers</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/admin/login" className="hover:text-foreground transition">
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-sm text-foreground">Connect</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-amber-300/50 pt-8">
            <p className="text-center text-sm text-amber-800">
              &copy; 2026 <span className="font-bold bg-gradient-to-r from-amber-700 to-red-600 bg-clip-text text-transparent">KD-Event</span> • <span className="font-khmer">ប្រព័ន្ធគ្រប់គ្រងកម្មវិធីខ្មែរ</span> • All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
