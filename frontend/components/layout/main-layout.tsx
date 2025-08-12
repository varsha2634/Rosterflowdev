"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import {
  Users,
  Calendar,
  Settings,
  FileSpreadsheet,
  Eye,
  BarChart3,
  Menu,
  X,
  Home,
  Clock,
  ChevronRight,
} from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions",
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
    description: "Manage team members",
  },
  {
    name: "Rules",
    href: "/rules",
    icon: Settings,
    description: "Scheduling rules and policies",
  },
  {
    name: "Holidays & Leaves",
    href: "/holidays",
    icon: Calendar,
    description: "Manage holidays and leave requests",
  },
  {
    name: "Generate Roster",
    href: "/roster/generate",
    icon: FileSpreadsheet,
    description: "Create new schedules",
  },
  {
    name: "View Rosters",
    href: "/roster/viewer",
    icon: Eye,
    description: "Edit existing rosters",
  },
  {
    name: "Roster History",
    href: "/roster/history",
    icon: Clock,
    description: "View past rosters",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Reports and insights",
  },
]

const breadcrumbMap: Record<string, string[]> = {
  "/dashboard": ["Dashboard"],
  "/employees": ["Dashboard", "Employees"],
  "/rules": ["Dashboard", "Rules"],
  "/holidays": ["Dashboard", "Holidays & Leaves"],
  "/roster/generate": ["Dashboard", "Roster", "Generate"],
  "/roster/viewer": ["Dashboard", "Roster", "Viewer"],
  "/roster/history": ["Dashboard", "Roster", "History"],
  "/analytics": ["Dashboard", "Analytics"],
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const currentBreadcrumb = breadcrumbMap[pathname] || ["Dashboard"]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Roster Manager</h1>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-400"}`} />
                  <div className="text-left">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {user?.role}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              {currentBreadcrumb.map((crumb, index) => (
                <div key={crumb} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
                  <span
                    className={
                      index === currentBreadcrumb.length - 1 ? "text-gray-900 font-medium" : "hover:text-gray-700"
                    }
                  >
                    {crumb}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Badge>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
