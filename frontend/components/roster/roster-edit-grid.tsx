"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock, AlertTriangle } from "lucide-react"
import type { SavedRoster, EditableRosterEntry } from "./roster-viewer"

interface RosterEditGridProps {
  roster: SavedRoster
  entries: EditableRosterEntry[]
  isEditing: boolean
  availableShifts: string[]
  onCellEdit: (employeeId: string, date: string, newShift: string) => void
  onCellLock: (employeeId: string, date: string, isLocked: boolean) => void
}

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

const shiftColors = {
  S1: "bg-blue-100 text-blue-800 border-blue-200",
  S2: "bg-green-100 text-green-800 border-green-200",
  S3: "bg-purple-100 text-purple-800 border-purple-200",
  S4: "bg-orange-100 text-orange-800 border-orange-200",
  S5: "bg-pink-100 text-pink-800 border-pink-200",
  WO: "bg-gray-100 text-gray-800 border-gray-200",
  HOL: "bg-red-100 text-red-800 border-red-200",
  LEAVE: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

export function RosterEditGrid({
  roster,
  entries,
  isEditing,
  availableShifts,
  onCellEdit,
  onCellLock,
}: RosterEditGridProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  // Get unique employees with their details
  const employees = Array.from(
    new Map(
      entries.map((entry) => [
        entry.employeeId,
        {
          id: entry.employeeId,
          name: entry.employeeName,
          details: entry.employeeDetails,
        },
      ]),
    ).values(),
  )

  // Get all dates in the month
  const daysInMonth = new Date(roster.year, roster.month + 1, 0).getDate()
  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const date = `${roster.year}-${String(roster.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "short" })
    return { date, day, dayOfWeek }
  })

  // Get roster entry for specific employee and date
  const getRosterEntry = (employeeId: string, date: string) => {
    return entries.find((entry) => entry.employeeId === employeeId && entry.date === date)
  }

  const handleShiftChange = (employeeId: string, date: string, newShift: string) => {
    onCellEdit(employeeId, date, newShift)
  }

  const handleLockToggle = (employeeId: string, date: string, currentLockState: boolean) => {
    onCellLock(employeeId, date, !currentLockState)
  }

  const totalViolations = entries.reduce((sum, entry) => sum + entry.violations.length, 0)
  const lockedCells = entries.filter((entry) => entry.isLocked).length

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {months[roster.month]} {roster.year} - {isEditing ? "Edit Mode" : "View Mode"}
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Violations: {totalViolations}</span>
            <span>Locked: {lockedCells}</span>
            <Badge variant={roster.status === "published" ? "default" : "secondary"}>{roster.status}</Badge>
          </div>
        </div>
        {totalViolations > 0 && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">{totalViolations} rule violations in this roster</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[600px]">
          <div className="min-w-max">
            {/* Sticky header with dates */}
            <div className="sticky top-0 bg-white z-10 border-b-2 border-gray-200">
              {/* Two-row date header */}
              <div className="grid grid-cols-[300px_repeat(31,_80px)] gap-1 mb-1">
                <div className="font-medium text-sm text-gray-600 p-3 bg-gray-50 border-r-2 border-gray-200">
                  Employee Details
                </div>
                {dates.map(({ date, day, dayOfWeek }) => (
                  <div key={date} className="text-center p-1 bg-gray-50">
                    <div className="text-xs font-medium text-gray-600">{dayOfWeek}</div>
                    <div className="text-sm font-bold">{day}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employee rows */}
            <div className="space-y-1">
              {employees.map((employee) => (
                <div key={employee.id} className="grid grid-cols-[300px_repeat(31,_80px)] gap-1">
                  {/* Sticky employee details column */}
                  <div className="sticky left-0 bg-white border-r-2 border-gray-200 p-3 z-10">
                    <div className="font-medium text-sm">{employee.name}</div>
                    <div className="text-xs text-gray-500">{employee.details.empId}</div>
                    <div className="text-xs text-gray-500">{employee.details.department}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {employee.details.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Shift cells */}
                  {dates.map(({ date }) => {
                    const entry = getRosterEntry(employee.id, date)
                    const cellKey = `${employee.id}-${date}`
                    const hasViolations = entry?.violations && entry.violations.length > 0
                    const isLocked = entry?.isLocked || false
                    const isHovered = hoveredCell === cellKey

                    return (
                      <div
                        key={date}
                        className="relative h-16 border border-gray-200"
                        onMouseEnter={() => setHoveredCell(cellKey)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {entry && (
                          <div className="h-full flex flex-col">
                            {/* Shift display/editor */}
                            <div className="flex-1 p-1">
                              {isEditing && !isLocked ? (
                                <Select
                                  value={entry.shift}
                                  onValueChange={(value) => handleShiftChange(employee.id, date, value)}
                                >
                                  <SelectTrigger
                                    className={`h-8 text-xs ${
                                      shiftColors[entry.shift as keyof typeof shiftColors] ||
                                      "bg-gray-100 text-gray-800"
                                    } ${hasViolations ? "ring-2 ring-red-400" : ""}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableShifts.map((shift) => (
                                      <SelectItem key={shift} value={shift}>
                                        {shift}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div
                                  className={`h-8 flex items-center justify-center text-xs rounded border ${
                                    shiftColors[entry.shift as keyof typeof shiftColors] ||
                                    "bg-gray-100 text-gray-800 border-gray-200"
                                  } ${hasViolations ? "ring-2 ring-red-400" : ""} ${isLocked ? "opacity-75" : ""}`}
                                >
                                  {entry.shift}
                                  {hasViolations && <span className="ml-1 text-red-600">!</span>}
                                  {isLocked && <Lock className="ml-1 h-3 w-3" />}
                                </div>
                              )}
                            </div>

                            {/* Cell controls (visible on hover in edit mode) */}
                            {isEditing && isHovered && (
                              <div className="absolute top-0 right-0 p-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleLockToggle(employee.id, date, isLocked)}
                                  title={isLocked ? "Unlock cell" : "Lock cell"}
                                >
                                  {isLocked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                </Button>
                              </div>
                            )}

                            {/* Modification indicator */}
                            {entry.lastModified && (
                              <div
                                className="text-xs text-gray-400 px-1 truncate"
                                title={`Modified by ${entry.modifiedBy}`}
                              >
                                {entry.modifiedBy?.split(" ")[0]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Legend & Controls</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2">Shift Types</h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(shiftColors).map(([shift, colorClass]) => (
                  <Badge key={shift} className={colorClass.replace("border-", "")}>
                    {shift}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2">Indicators</h5>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  Red border = Rule violation
                </div>
                <div className="flex items-center">
                  <Lock className="h-3 w-3 mr-2" />
                  Lock icon = Cell is locked
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Name in corner = Recently modified
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
