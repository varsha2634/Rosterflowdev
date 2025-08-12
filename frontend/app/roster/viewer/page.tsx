"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { RosterViewer } from "@/components/roster/roster-viewer"

export default function RosterViewerPage() {
  return (
    <ProtectedRoute>
      <RosterViewer />
    </ProtectedRoute>
  )
}
