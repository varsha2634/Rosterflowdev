"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { HolidaysManagement } from "@/components/holidays/holidays-management"

export default function HolidaysPage() {
  return (
    <ProtectedRoute>
      <HolidaysManagement />
    </ProtectedRoute>
  )
}
