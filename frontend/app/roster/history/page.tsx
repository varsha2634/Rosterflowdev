"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { RosterHistory } from "@/components/roster/roster-history"

export default function RosterHistoryPage() {
  return (
    <ProtectedRoute>
      <RosterHistory />
    </ProtectedRoute>
  )
}
