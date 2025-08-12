"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, Edit, Download, Save, Search } from "lucide-react"
import { RosterEditGrid } from "./roster-edit-grid"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export interface EditableRosterEntry {
  employeeId: string
  employeeName: string
  employeeDetails: {
    empId: string
    department: string
    skills: string[]
  }
  date: string
  shift: string
  isHoliday: boolean
  isLeave: boolean
  violations: string[]
  isLocked: boolean
  lastModified?: string
  modifiedBy?: string
}

export interface SavedRoster {
  id: string
  name: string
  month: number
  year: number
  createdDate: string
  createdBy: string
  lastModified: string
  status: "draft" | "published" | "archived"
  entries: EditableRosterEntry[]
}

// Mock saved rosters
const mockSavedRosters: SavedRoster[] = [
  {
    id: "1",
    name: "December 2024 Roster",
    month: 11,
    year: 2024,
    createdDate: "2024-11-25",
    createdBy: "Admin User",
    lastModified: "2024-12-01",
    status: "published",
    entries: [],
  },
  {
    id: "2",
    name: "January 2025 Roster",
    month: 0,
    year: 2025,
    createdDate: "2024-12-15",
    createdBy: "Manager User",
    lastModified: "2024-12-15",
    status: "draft",
    entries: [],
  },
  {
    id: "3",
    name: "November 2024 Roster",
    month: 10,
    year: 2024,
    createdDate: "2024-10-25",
    createdBy: "Admin User",
    lastModified: "2024-11-30",
    status: "archived",
    entries: [],
  },
]

// Mock employees for roster entries
const mockEmployees = [
  {
    id: "1",
    name: "John Smith",
    empId: "EMP001",
    department: "Engineering",
    skills: ["React", "Node.js"],
    weekOffs: ["Saturday", "Sunday"],
    fixedShift: "S1",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    empId: "EMP002",
    department: "Design",
    skills: ["UI/UX", "Figma"],
    weekOffs: ["Sunday", "Monday"],
    fixedShift: "S2",
  },
  {
    id: "3",
    name: "Mike Davis",
    empId: "EMP003",
    department: "Engineering",
    skills: ["Python", "Django"],
    weekOffs: ["Saturday", "Sunday"],
    fixedShift: "S1",
  },
  {
    id: "4",
    name: "Emily Chen",
    empId: "EMP004",
    department: "Marketing",
    skills: ["Content", "SEO"],
    weekOffs: ["Friday", "Saturday"],
    fixedShift: "S3",
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

const shifts = ["S1", "S2", "S3", "S4", "S5", "WO", "HOL", "LEAVE"]

export function RosterViewer() {
  const [savedRosters] = useState<SavedRoster[]>(mockSavedRosters)
  const [selectedRoster, setSelectedRoster] = useState<SavedRoster | null>(null)
  const [rosterEntries, setRosterEntries] = useState<EditableRosterEntry[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { user } = useAuth()
  const router = useRouter()

  const generateMockRosterEntries = (roster: SavedRoster): EditableRosterEntry[] => {
    const entries: EditableRosterEntry[] = []
    const daysInMonth = new Date(roster.year, roster.month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${roster.year}-${String(roster.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" })

      mockEmployees.forEach((employee) => {
        const isWeekOff = employee.weekOffs.includes(dayOfWeek)
        const shift = isWeekOff ? "WO" : employee.fixedShift
        const violations: string[] = []

        // Add some mock violations
        if (Math.random() > 0.95) {
          violations.push("Consecutive days limit exceeded")
        }
        if (Math.random() > 0.98) {
          violations.push("Insufficient rest period")
        }

        entries.push({
          employeeId: employee.id,
          employeeName: employee.name,
          employeeDetails: {
            empId: employee.empId,
            department: employee.department,
            skills: employee.skills,
          },
          date,
          shift,
          isHoliday: false,
          isLeave: false,
          violations,
          isLocked: Math.random() > 0.9, // 10% of entries are locked
          lastModified: Math.random() > 0.8 ? new Date().toISOString().split("T")[0] : undefined,
          modifiedBy: Math.random() > 0.8 ? user?.name : undefined,
        })
      })
    }

    return entries
  }

  const handleRosterSelect = (rosterId: string) => {
    const roster = savedRosters.find((r) => r.id === rosterId)
    if (roster) {
      setSelectedRoster(roster)
      const entries = generateMockRosterEntries(roster)
      setRosterEntries(entries)
      setIsEditing(false)
      setHasUnsavedChanges(false)
    }
  }

  const handleCellEdit = (employeeId: string, date: string, newShift: string) => {
    setRosterEntries((prev) =>
      prev.map((entry) =>
        entry.employeeId === employeeId && entry.date === date
          ? {
              ...entry,
              shift: newShift,
              lastModified: new Date().toISOString().split("T")[0],
              modifiedBy: user?.name,
              violations: newShift === "S1" && Math.random() > 0.8 ? ["Rule violation detected"] : [], // Mock validation
            }
          : entry,
      ),
    )
    setHasUnsavedChanges(true)
  }

  const handleCellLock = (employeeId: string, date: string, isLocked: boolean) => {
    setRosterEntries((prev) =>
      prev.map((entry) => (entry.employeeId === employeeId && entry.date === date ? { ...entry, isLocked } : entry)),
    )
    setHasUnsavedChanges(true)
  }

  const handleSaveChanges = () => {
    // Mock save operation
    setHasUnsavedChanges(false)
    alert("Roster changes saved successfully!")
  }

  const handleExportExcel = () => {
    // Mock export operation
    alert("Roster exported to Excel successfully!")
  }

  const filteredRosters = savedRosters.filter(
    (roster) =>
      roster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${months[roster.month]} ${roster.year}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Roster Viewer & Editor</h1>
              <p className="text-gray-600">View and edit existing employee rosters</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/roster/generate")}>
                Generate New
              </Button>
              {selectedRoster && (
                <>
                  <Button variant="outline" onClick={handleExportExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  {isEditing && hasUnsavedChanges && (
                    <Button onClick={handleSaveChanges}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                  <Button variant={isEditing ? "secondary" : "default"} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        View Mode
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Mode
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Roster Selection Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Rosters</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search rosters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredRosters.map((roster) => (
                  <div
                    key={roster.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoster?.id === roster.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleRosterSelect(roster.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{roster.name}</h4>
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
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Created: {roster.createdDate}</p>
                      <p>Modified: {roster.lastModified}</p>
                      <p>By: {roster.createdBy}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Roster Info */}
            {selectedRoster && (
              <Card>
                <CardHeader>
                  <CardTitle>Roster Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Period:</span>
                    <p className="text-sm">
                      {months[selectedRoster.month]} {selectedRoster.year}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <Badge
                      className="ml-2"
                      variant={
                        selectedRoster.status === "published"
                          ? "default"
                          : selectedRoster.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {selectedRoster.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Total Entries:</span>
                    <p className="text-sm">{rosterEntries.length}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Violations:</span>
                    <p className="text-sm text-red-600">
                      {rosterEntries.reduce((sum, entry) => sum + entry.violations.length, 0)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Locked Cells:</span>
                    <p className="text-sm">{rosterEntries.filter((entry) => entry.isLocked).length}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Roster Grid */}
          <div className="lg:col-span-3">
            {selectedRoster && rosterEntries.length > 0 ? (
              <RosterEditGrid
                roster={selectedRoster}
                entries={rosterEntries}
                isEditing={isEditing}
                availableShifts={shifts}
                onCellEdit={handleCellEdit}
                onCellLock={handleCellLock}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Roster Selected</h3>
                  <p className="text-gray-600 mb-4">Select a roster from the sidebar to view and edit it.</p>
                  <div className="text-sm text-gray-500">
                    <p>• Choose from saved rosters</p>
                    <p>• Switch between view and edit modes</p>
                    <p>• Make changes and save</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
