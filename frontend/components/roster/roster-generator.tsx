"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Play, Settings, Users, AlertTriangle } from "lucide-react"
import { GeneratedRosterGrid } from "./generated-roster-grid"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export interface RosterEntry {
  employeeId: string
  employeeName: string
  date: string
  shift: string
  isHoliday: boolean
  isLeave: boolean
  violations: string[]
}

export interface GenerationConfig {
  month: number
  year: number
  includeHolidays: boolean
  respectWeekOffs: boolean
  enforceSkillMatching: boolean
  minimumRestPeriod: boolean
  balanceWorkload: boolean
  allowOverrides: boolean
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

const shifts = ["S1", "S2", "S3", "S4", "S5"]

// Mock employees data
const mockEmployees = [
  { id: "1", name: "John Smith", skills: ["React", "Node.js"], weekOffs: ["Saturday", "Sunday"], fixedShift: "S1" },
  { id: "2", name: "Sarah Johnson", skills: ["UI/UX", "Figma"], weekOffs: ["Sunday", "Monday"], fixedShift: "S2" },
  { id: "3", name: "Mike Davis", skills: ["Python", "Django"], weekOffs: ["Saturday", "Sunday"], fixedShift: "S1" },
  { id: "4", name: "Emily Chen", skills: ["Content", "SEO"], weekOffs: ["Friday", "Saturday"], fixedShift: "S3" },
  { id: "5", name: "David Wilson", skills: ["Java", "Spring"], weekOffs: ["Saturday", "Sunday"], fixedShift: "S2" },
  { id: "6", name: "Lisa Brown", skills: ["Design", "Photoshop"], weekOffs: ["Sunday", "Monday"], fixedShift: "S4" },
]

// Mock holidays
const mockHolidays = ["2024-12-25", "2024-01-01", "2024-07-04"]

export function RosterGenerator() {
  const [config, setConfig] = useState<GenerationConfig>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    includeHolidays: true,
    respectWeekOffs: true,
    enforceSkillMatching: true,
    minimumRestPeriod: true,
    balanceWorkload: true,
    allowOverrides: false,
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedRoster, setGeneratedRoster] = useState<RosterEntry[]>([])
  const [generationStats, setGenerationStats] = useState({
    totalAssignments: 0,
    violations: 0,
    coverage: 0,
    efficiency: 0,
  })

  const { user } = useAuth()
  const router = useRouter()

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGeneratedRoster([])

    // Simulate generation process with progress updates
    const steps = [
      "Analyzing employee data...",
      "Processing rules and constraints...",
      "Checking holidays and leaves...",
      "Generating initial assignments...",
      "Optimizing for rule compliance...",
      "Finalizing roster...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }

    // Generate mock roster data
    const roster = generateMockRoster(config)
    setGeneratedRoster(roster)

    // Calculate stats
    const stats = calculateStats(roster)
    setGenerationStats(stats)

    setIsGenerating(false)
  }

  const generateMockRoster = (config: GenerationConfig): RosterEntry[] => {
    const roster: RosterEntry[] = []
    const daysInMonth = new Date(config.year, config.month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${config.year}-${String(config.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" })
      const isHoliday = mockHolidays.includes(date)

      mockEmployees.forEach((employee) => {
        const isWeekOff = employee.weekOffs.includes(dayOfWeek)
        let shift = "WO"
        const violations: string[] = []

        if (isHoliday && config.includeHolidays) {
          shift = "HOL"
        } else if (!isWeekOff || !config.respectWeekOffs) {
          // Assign shifts based on employee's fixed shift with some variation
          const shiftOptions = [employee.fixedShift, ...shifts.filter((s) => s !== employee.fixedShift)]
          shift = Math.random() > 0.8 ? shiftOptions[1] || employee.fixedShift : employee.fixedShift

          // Add some mock violations for demonstration
          if (Math.random() > 0.9) {
            violations.push("Consecutive days limit exceeded")
          }
          if (Math.random() > 0.95) {
            violations.push("Insufficient rest period")
          }
        }

        roster.push({
          employeeId: employee.id,
          employeeName: employee.name,
          date,
          shift,
          isHoliday,
          isLeave: false,
          violations,
        })
      })
    }

    return roster
  }

  const calculateStats = (roster: RosterEntry[]) => {
    const totalAssignments = roster.filter((entry) => !["WO", "HOL", "LEAVE"].includes(entry.shift)).length
    const violations = roster.reduce((sum, entry) => sum + entry.violations.length, 0)
    const coverage = Math.round((totalAssignments / (roster.length * 0.7)) * 100) // Mock calculation
    const efficiency = Math.max(0, 100 - violations * 2) // Mock calculation

    return {
      totalAssignments,
      violations,
      coverage: Math.min(coverage, 100),
      efficiency,
    }
  }

  const currentYearOptions = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Roster Generator</h1>
              <p className="text-gray-600">Generate employee schedules with intelligent rule-based assignments</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => router.push("/roster/history")}>
                View History
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Generation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select
                    value={config.month.toString()}
                    onValueChange={(value) => setConfig({ ...config, month: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select
                    value={config.year.toString()}
                    onValueChange={(value) => setConfig({ ...config, year: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentYearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label>Include Holidays</Label>
                    <Switch
                      checked={config.includeHolidays}
                      onCheckedChange={(checked) => setConfig({ ...config, includeHolidays: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Respect Week Offs</Label>
                    <Switch
                      checked={config.respectWeekOffs}
                      onCheckedChange={(checked) => setConfig({ ...config, respectWeekOffs: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Enforce Skill Matching</Label>
                    <Switch
                      checked={config.enforceSkillMatching}
                      onCheckedChange={(checked) => setConfig({ ...config, enforceSkillMatching: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Minimum Rest Period</Label>
                    <Switch
                      checked={config.minimumRestPeriod}
                      onCheckedChange={(checked) => setConfig({ ...config, minimumRestPeriod: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Balance Workload</Label>
                    <Switch
                      checked={config.balanceWorkload}
                      onCheckedChange={(checked) => setConfig({ ...config, balanceWorkload: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Allow Overrides</Label>
                    <Switch
                      checked={config.allowOverrides}
                      onCheckedChange={(checked) => setConfig({ ...config, allowOverrides: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Roster"}
                </Button>

                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={generationProgress} className="w-full" />
                    <p className="text-sm text-gray-600 text-center">{Math.round(generationProgress)}% Complete</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generation Stats */}
            {generatedRoster.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Generation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Assignments</span>
                    <Badge variant="secondary">{generationStats.totalAssignments}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rule Violations</span>
                    <Badge variant={generationStats.violations > 0 ? "destructive" : "default"}>
                      {generationStats.violations}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Coverage</span>
                    <Badge variant={generationStats.coverage >= 80 ? "default" : "secondary"}>
                      {generationStats.coverage}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Efficiency</span>
                    <Badge variant={generationStats.efficiency >= 90 ? "default" : "secondary"}>
                      {generationStats.efficiency}%
                    </Badge>
                  </div>

                  {generationStats.violations > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">Some rule violations detected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Generated Roster Display */}
          <div className="lg:col-span-2">
            {generatedRoster.length > 0 ? (
              <GeneratedRosterGrid
                roster={generatedRoster}
                month={config.month}
                year={config.year}
                onSaveRoster={() => {
                  // Handle saving roster
                  alert("Roster saved successfully!")
                }}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Roster Generated</h3>
                  <p className="text-gray-600 mb-4">
                    Configure your settings and click "Generate Roster" to create a new schedule.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>• Select month and year</p>
                    <p>• Configure generation options</p>
                    <p>• Review and generate roster</p>
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
