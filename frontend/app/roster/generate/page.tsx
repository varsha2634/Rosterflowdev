"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { RosterGenerator } from "@/components/roster/roster-generator"

export default function RosterGeneratePage() {
  return (
    <ProtectedRoute>
      <RosterGenerator />
    </ProtectedRoute>
  )
}
