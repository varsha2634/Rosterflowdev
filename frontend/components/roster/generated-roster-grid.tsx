"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Download, AlertTriangle } from "lucide-react"
import type { RosterEntry } from "./roster-generator"

interface GeneratedRosterGridProps {
  roster: RosterEntry[]
  month: number
  year: number
  onSaveRoster: () => void
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
  S1: "bg-blue-100 text-blue-800",
  S2: "bg-green-100 text-green-800",
  S3: "bg-purple-100 text-purple-800",
  S4: "bg-orange-100 text-orange-800",
  S5: "bg-pink-100 text-pink-800",
  WO: "bg-gray-100 text-gray-800",
  HOL: "bg-red-100 text-red-800",
  LEAVE: "bg-yellow-100 text-yellow-800",
}

export function GeneratedRosterGrid({ roster, month, year, onSaveRoster }: GeneratedRosterGridProps) {
  // Get unique employees
  const employees = Array.from(new Set(roster.map((entry) => ({ id: entry.employeeId, name: entry.employeeName }))))

  // Get all dates in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "short" })
    return { date, day, dayOfWeek }
  })

  // Get roster entry for specific employee and date
  const getRosterEntry = (employeeId: string, date: string) => {
    return roster.find((entry) => entry.employeeId === employeeId && entry.date === date)
  }

  const totalViolations = roster.reduce((sum, entry) => sum + entry.violations.length, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            Generated Roster - {months[month]} {year}
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button size="sm" onClick={onSaveRoster}>
              <Save className="h-4 w-4 mr-2" />
              Save Roster
            </Button>
          </div>
        </div>
        {totalViolations > 0 && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">{totalViolations} rule violations found in this roster</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header with dates */}
            <div className="grid grid-cols-[200px_repeat(31,_60px)] gap-1 mb-2">
              <div className="font-medium text-sm text-gray-600 p-2">Employee</div>
              {dates.map(({ date, day, dayOfWeek }) => (
                <div key={date} className="text-center p-1">
                  <div className="text-xs font-medium text-gray-600">{dayOfWeek}</div>
                  <div className="text-sm font-bold">{day}</div>
                </div>
              ))}
            </div>

            {/* Employee rows */}
            {employees.map((employee) => (
              <div key={employee.id} className="grid grid-cols-[200px_repeat(31,_60px)] gap-1 mb-1">
                <div className="font-medium text-sm p-2 bg-gray-50 rounded flex items-center">{employee.name}</div>
                {dates.map(({ date }) => {
                  const entry = getRosterEntry(employee.id, date)
                  const hasViolations = entry?.violations && entry.violations.length > 0

                  return (
                    <div key={date} className="relative">
                      {entry && (
                        <Badge
                          className={`w-full text-xs justify-center ${
                            shiftColors[entry.shift as keyof typeof shiftColors] || "bg-gray-100 text-gray-800"
                          } ${hasViolations ? "ring-2 ring-red-400" : ""}`}
                          title={
                            hasViolations ? `${entry.shift} - Violations: ${entry.violations.join(", ")}` : entry.shift
                          }
                        >
                          {entry.shift}
                          {hasViolations && <span className="ml-1 text-red-600">!</span>}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Shift Legend</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(shiftColors).map(([shift, colorClass]) => (
              <Badge key={shift} className={colorClass}>
                {shift}
                {shift === "WO" && " - Week Off"}
                {shift === "HOL" && " - Holiday"}
                {shift === "LEAVE" && " - Leave"}
              </Badge>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
              Red border indicates rule violations
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
