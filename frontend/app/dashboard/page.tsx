"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { EnhancedDashboard } from "@/components/dashboard/enhanced-dashboard"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <EnhancedDashboard />
      </MainLayout>
    </ProtectedRoute>
  )
}
