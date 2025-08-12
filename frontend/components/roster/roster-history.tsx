"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, Archive, Search, Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation"

interface HistoricalRoster {
  id: string
  name: string
  month: number
  year: number
  createdDate: string
  createdBy: string
  publishedDate?: string
  archivedDate?: string
  status: "draft" | "published" | "archived"
  employeeCount: number
  totalShifts: number
  violations: number
  version: number
}

const mockHistoricalRosters: HistoricalRoster[] = [
  {
    id: "1",
    name: "December 2024 Roster",
    month: 11,
    year: 2024,
    createdDate: "2024-11-25",
    createdBy: "Admin User",
    publishedDate: "2024-11-30",
    status: "published",
    employeeCount: 156,
    totalShifts: 3120,
    violations: 2,
    version: 3,
  },
  {
    id: "2",
    name: "November 2024 Roster",
    month: 10,
    year: 2024,
    createdDate: "2024-10-25",
    createdBy: "Manager User",
    publishedDate: "2024-10-30",
    archivedDate: "2024-12-01",
    status: "archived",
    employeeCount: 152,
    totalShifts: 3040,
    violations: 5,
    version: 2,
  },
  {
    id: "3",
    name: "October 2024 Roster",
    month: 9,
    year: 2024,
    createdDate: "2024-09-25",
    createdBy: "Admin User",
    publishedDate: "2024-09-30",
    archivedDate: "2024-11-01",
    status: "archived",
    employeeCount: 148,
    totalShifts: 2960,
    violations: 1,
    version: 1,
  },
  {
    id: "4",
    name: "January 2025 Roster",
    month: 0,
    year: 2025,
    createdDate: "2024-12-15",
    createdBy: "Manager User",
    status: "draft",
    employeeCount: 158,
    totalShifts: 3160,
    violations: 0,
    version: 1,
  },
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function RosterHistory() {
  const [rosters] = useState<HistoricalRoster[]>(mockHistoricalRosters)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const router = useRouter()

  const filteredRosters = rosters.filter((roster) => {
    const matchesSearch =
      roster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roster.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || roster.status === statusFilter
    const matchesYear = yearFilter === "all" || roster.year.toString() === yearFilter

    return matchesSearch && matchesStatus && matchesYear
  })

  const handleViewRoster = (rosterId: string) => {
    router.push(`/roster/viewer?id=${rosterId}`)
  }

  const handleArchiveRoster = (rosterId: string) => {
    alert(`Roster ${rosterId} archived successfully!`)
  }

  const handleExportRoster = (rosterId: string) => {
    alert(`Roster ${rosterId} exported successfully!`)
  }

  const availableYears = Array.from(new Set(rosters.map((r) => r.year))).sort((a, b) => b - a)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roster History</h1>
          <p className="text-gray-600">View and manage historical employee rosters</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Rosters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rosters.length}</div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rosters.filter((r) => r.status === "published").length}
            </div>
            <p className="text-xs text-gray-500">Active rosters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {rosters.filter((r) => r.status === "archived").length}
            </div>
            <p className="text-xs text-gray-500">Historical data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(rosters.reduce((sum, r) => sum + r.violations, 0) / rosters.length)}
            </div>
            <p className="text-xs text-gray-500">Per roster</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search rosters by name or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Roster List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roster Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRosters.map((roster) => (
                  <tr key={roster.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{roster.name}</div>
                        <div className="text-sm text-gray-500">
                          Created by {roster.createdBy} • v{roster.version}
                        </div>
                        <div className="text-xs text-gray-400">{roster.createdDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {months[roster.month]} {roster.year}
                          </div>
                          {roster.publishedDate && (
                            <div className="text-xs text-gray-500">Published: {roster.publishedDate}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{roster.employeeCount} employees</div>
                          <div className="text-xs text-gray-500">
                            {roster.totalShifts} shifts • {roster.violations} violations
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          roster.status === "published"
                            ? "default"
                            : roster.status === "draft"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {roster.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewRoster(roster.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleExportRoster(roster.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {roster.status === "published" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchiveRoster(roster.id)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredRosters.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rosters Found</h3>
            <p className="text-gray-600">No rosters match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
