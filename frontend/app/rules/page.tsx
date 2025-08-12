"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { RulesManagement } from "@/components/rules/rules-management"

export default function RulesPage() {
  return (
    <ProtectedRoute>
      <RulesManagement />
    </ProtectedRoute>
  )
}
