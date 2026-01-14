"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Lock, User } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axios"

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axiosInstance.post("/api/auth/login", formData)
      
      if (response.data.success && response.data.data.token) {
        // Store token in localStorage
        localStorage.setItem("authToken", response.data.data.token)
        
        // Store user info
        localStorage.setItem("username", response.data.data.username)
        localStorage.setItem("roles", JSON.stringify(response.data.data.roles))
        
        // Redirect to dashboard
        router.push("/admin/dashboard")
      } else {
        setError("Invalid credentials")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-amber-500/50 transition-all">
              <Calendar className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
                KD-Event
              </h1>
              <p className="text-sm text-amber-700 font-medium font-khmer mt-1">កិច្ចប្រជុំ សន្និសីទ សិក្ខាសាលា</p>
            </div>
          </Link>
        </div>

        <Card className="border-2 border-amber-200/50 shadow-2xl bg-white/80 backdrop-blur">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-red-600 bg-clip-text text-transparent">
              <span className="font-khmer">ចូលប្រព័ន្ធ</span> • Admin Login
            </CardTitle>
            <CardDescription className="text-base">Access the meeting management dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-amber-900">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-amber-200 rounded-lg bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    placeholder="admin"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-amber-900">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-amber-200 rounded-lg bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

            
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
