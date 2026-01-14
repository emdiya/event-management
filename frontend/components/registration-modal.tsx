"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { submitRegistration, resetRegistration } from "@/lib/redux/slices/registrationSlice"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EventResponse } from "@/lib/api"
import { AlertCircle, CheckCircle, CalendarIcon, MapPinIcon } from "lucide-react"
import { format, parseISO } from "date-fns"

interface RegistrationModalProps {
  event: EventResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TelegramWebAppUser = {
  id: number
  first_name?: string
  last_name?: string
  username?: string
}

type TelegramWebApp = {
  initDataUnsafe?: {
    user?: TelegramWebAppUser
  }
  ready?: () => void
  expand?: () => void
  close?: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

export function RegistrationModal({ event, open, onOpenChange }: RegistrationModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, success, ticket } = useSelector((state: RootState) => state.registration)
  const [telegramUserIdLocked, setTelegramUserIdLocked] = useState(false)

  const [formData, setFormData] = useState({
    eventCode: event.code || "",
    fullName: "",
    email: "",
    phone: "",
    company: "",
    telegramUserId: "",
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.ready?.()
    tg.expand?.()

    const user = tg.initDataUnsafe?.user
    if (!user?.id) return

    const fullNameFromTelegram = [user.first_name, user.last_name].filter(Boolean).join(" ").trim()

    setFormData((prev) => {
      if (!prev.telegramUserId) {
        setTelegramUserIdLocked(true)
      }

      return {
        ...prev,
        telegramUserId: prev.telegramUserId || String(user.id),
        fullName: prev.fullName || fullNameFromTelegram,
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const registrationData = {
      eventCode: formData.eventCode,
      fullName: formData.fullName,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      telegramUserId: formData.telegramUserId ? Number.parseInt(formData.telegramUserId) : undefined,
    }
    await dispatch(submitRegistration(registrationData))
  }

  const handleClose = () => {
    onOpenChange(false)
    if (success) {
      dispatch(resetRegistration())
      setFormData({
        eventCode: event.code || "",
        fullName: "",
        email: "",
        phone: "",
        company: "",
        telegramUserId: "",
      })
    }
  }

  const startDate = parseISO(event.startAt)
  const formattedDate = format(startDate, "MMM dd, yyyy 'at' HH:mm")

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-2 border-amber-300 bg-gradient-to-b from-amber-50 via-white to-orange-50">
        <DialogHeader className="border-b-2 border-amber-200 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent">
            <span className="font-khmer">ចុះឈ្មោះ</span> • Register for Event
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-3">
            <div className="flex items-start gap-2 text-sm text-amber-800">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-amber-900">{event.title}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-amber-700">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <span>{event.location}</span>
              </div>
            </div>
            <div className="text-sm text-amber-600 pl-10">{formattedDate}</div>
          </DialogDescription>
        </DialogHeader>

        {success && ticket ? (
          <div className="space-y-4 text-center py-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-amber-900 font-khmer">ចុះឈ្មោះជោគជ័យ! • Success!</h3>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-300 shadow-md space-y-2">
              <p className="text-sm text-amber-700 font-khmer">លេខសំបុត្រ • Ticket Number</p>
              <p className="text-3xl font-mono font-bold text-amber-900">{ticket.ticketNo}</p>
            </div>
            {formData.email && (
              <p className="text-sm text-amber-700">
                Confirmation sent to <strong className="text-amber-900">{formData.email}</strong>
              </p>
            )}
            {formData.telegramUserId && (
              <p className="text-sm text-amber-700 font-khmer">
                ពិនិត្យ Telegram របស់អ្នក • Check your Telegram
              </p>
            )}
            <Button 
              onClick={handleClose} 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-6"
            >
              <span className="font-khmer">បិទ</span> • Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">{error && (
              <div className="flex gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-amber-900 font-medium">
                <span className="font-khmer">ឈ្មោះពេញ</span> • Full Name *
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-900 font-medium">
                <span className="font-khmer">អ៊ីមែល</span> • Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-amber-900 font-medium">
                <span className="font-khmer">លេខទូរស័ព្ទ</span> • Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+855 12 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              />
              <p className="text-xs text-amber-600 font-khmer">ស្រេចចិត្ត • Optional</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-amber-900 font-medium">
                <span className="font-khmer">ក្រុមហ៊ុន</span> • Company
              </Label>
              <Input
                id="company"
                placeholder="Tech Company Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegramUserId" className="text-amber-900 font-medium">
                Telegram User ID <span className="text-amber-600 font-khmer">(ស្រេចចិត្ត)</span>
              </Label>
              <Input
                id="telegramUserId"
                type="number"
                placeholder="123456789"
                value={formData.telegramUserId}
                onChange={(e) => setFormData({ ...formData, telegramUserId: e.target.value })}
                disabled={telegramUserIdLocked}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-6"
            >
              {loading ? (
                <span className="font-khmer">កំពុងដំណើរការ... • Processing...</span>
              ) : (
                <span className="font-khmer">បញ្ជាក់ការចុះឈ្មោះ • Complete Registration</span>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
