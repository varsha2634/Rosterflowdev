"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { EmployeeManagement } from "@/components/employees/employee-management"

export default function EmployeesPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <EmployeeManagement />
      </MainLayout>
    </ProtectedRoute>
  )
}
