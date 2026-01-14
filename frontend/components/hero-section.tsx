"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Calendar, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-red-100 pt-20 pb-32 sm:pt-32 sm:pb-48">
      {/* Khmer Traditional Pattern Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, #d97706 0px, #d97706 2px, transparent 2px, transparent 10px),
                                repeating-linear-gradient(-45deg, #dc2626 0px, #dc2626 2px, transparent 2px, transparent 10px)`
             }} />
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '350ms' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 lg:space-y-10">
          {/* Khmer Traditional Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur rounded-full border-2 border-amber-400/50 shadow-lg">
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-800 font-khmer">កិច្ចប្រជុំ • សន្និសីទ • សិក្ខាសាលា</span>
            <Sparkles className="w-5 h-5 text-red-600" />
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          </div>

          {/* Main Heading with Khmer Style */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-amber-900 mb-2 font-khmer">គ្រប់គ្រងកិច្ចប្រជុំ</span>
              <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent font-khmer">
                សន្និសីទ និង សិក្ខាសាលា
              </span>
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-amber-800">
              Meetings, Conferences & Workshops
            </h2>
          </div>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-amber-900/80 leading-relaxed">
            <span className="block mb-2 font-khmer">រៀបចំកិច្ចប្រជុំ សន្និសីទ សិក្ខាសាលា និងប្រជុំផ្សេងៗ ដោយងាយស្រួល ចុះឈ្មោះរហ័ស ហើយគ្រប់គ្រងយ៉ាងល្អ</span>
            <span className="text-base sm:text-lg text-amber-700">Organize meetings, conferences, workshops and gatherings easily with quick registration and efficient management</span>
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-lg border border-amber-300 shadow-sm">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-900 font-khmer">កិច្ចប្រជុំ</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-lg border border-orange-300 shadow-sm">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900 font-khmer">សន្និសីទ</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-lg border border-red-300 shadow-sm">
              <Sparkles className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-900 font-khmer">សិក្ខាសាលា</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="#events">
              <Button size="lg" className="gap-2 h-14 px-10 text-base bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all">
                <Calendar className="w-5 h-5" />
                <span className="font-khmer">មើលកិច្ចប្រជុំ</span> • Browse Meetings
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="h-14 px-10 text-base bg-white/80 border-2 border-amber-600 text-amber-800 hover:bg-amber-50 shadow-lg">
                <span className="font-khmer">រៀបចំកិច្ចប្រជុំ?</span> • Organize Meeting
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 sm:pt-12 border-t border-border">
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-primary">500+</div>
              <p className="text-sm text-muted-foreground">Active Events</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-primary">50K+</div>
              <p className="text-sm text-muted-foreground">Happy Attendees</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-primary">24/7</div>
              <p className="text-sm text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
