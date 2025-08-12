"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { HolidayCalendar } from "./holiday-calendar"
import { HolidayModal } from "./holiday-modal"
import { LeaveModal } from "./leave-modal"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export interface Holiday {
  id: string
  date: string
  name: string
  description?: string
  type: "public" | "company" | "optional"
  recurring: boolean
}

export interface Leave {
  id: string
  employeeId: string
  employeeName: string
  startDate: string
  endDate: string
  reason: string
  type: "sick" | "vacation" | "personal" | "emergency"
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  approvedBy?: string
}

// Mock data
const mockHolidays: Holiday[] = [
  {
    id: "1",
    date: "2024-12-25",
    name: "Christmas Day",
    description: "Christmas celebration",
    type: "public",
    recurring: true,
  },
  {
    id: "2",
    date: "2024-01-01",
    name: "New Year's Day",
    description: "New Year celebration",
    type: "public",
    recurring: true,
  },
  {
    id: "3",
    date: "2024-07-04",
    name: "Independence Day",
    description: "National holiday",
    type: "public",
    recurring: true,
  },
  {
    id: "4",
    date: "2024-12-24",
    name: "Christmas Eve",
    description: "Company holiday",
    type: "company",
    recurring: true,
  },
  {
    id: "5",
    date: "2024-11-29",
    name: "Black Friday",
    description: "Optional company holiday",
    type: "optional",
    recurring: true,
  },
]

const mockLeaves: Leave[] = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "John Smith",
    startDate: "2024-12-20",
    endDate: "2024-12-22",
    reason: "Family vacation",
    type: "vacation",
    status: "approved",
    appliedDate: "2024-11-15",
    approvedBy: "Manager",
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Sarah Johnson",
    startDate: "2024-12-15",
    endDate: "2024-12-15",
    reason: "Medical appointment",
    type: "sick",
    status: "approved",
    appliedDate: "2024-12-10",
    approvedBy: "Manager",
  },
  {
    id: "3",
    employeeId: "3",
    employeeName: "Mike Davis",
    startDate: "2024-12-28",
    endDate: "2024-12-30",
    reason: "Personal matters",
    type: "personal",
    status: "pending",
    appliedDate: "2024-12-05",
  },
  {
    id: "4",
    employeeId: "4",
    employeeName: "Emily Chen",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    reason: "Vacation with family",
    type: "vacation",
    status: "approved",
    appliedDate: "2024-12-01",
    approvedBy: "Manager",
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

export function HolidaysManagement() {
  const [holidays, setHolidays] = useState<Holiday[]>(mockHolidays)
  const [leaves, setLeaves] = useState<Leave[]>(mockLeaves)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  const handlePreviousMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleMonthChange = (monthIndex: string) => {
    setSelectedDate(new Date(currentYear, Number.parseInt(monthIndex), 1))
  }

  const handleYearChange = (year: string) => {
    setSelectedDate(new Date(Number.parseInt(year), currentMonth, 1))
  }

  const handleAddHoliday = () => {
    setEditingHoliday(null)
    setIsHolidayModalOpen(true)
  }

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setIsHolidayModalOpen(true)
  }

  const handleSaveHoliday = (holidayData: Omit<Holiday, "id">) => {
    if (editingHoliday) {
      setHolidays(holidays.map((h) => (h.id === editingHoliday.id ? { ...holidayData, id: editingHoliday.id } : h)))
    } else {
      const newHoliday: Holiday = {
        ...holidayData,
        id: Date.now().toString(),
      }
      setHolidays([...holidays, newHoliday])
    }
    setIsHolidayModalOpen(false)
  }

  const handleDeleteHoliday = (holidayId: string) => {
    setHolidays(holidays.filter((h) => h.id !== holidayId))
  }

  const handleAddLeave = () => {
    setEditingLeave(null)
    setIsLeaveModalOpen(true)
  }

  const handleEditLeave = (leave: Leave) => {
    setEditingLeave(leave)
    setIsLeaveModalOpen(true)
  }

  const handleSaveLeave = (leaveData: Omit<Leave, "id" | "appliedDate">) => {
    if (editingLeave) {
      setLeaves(
        leaves.map((l) =>
          l.id === editingLeave.id ? { ...leaveData, id: editingLeave.id, appliedDate: editingLeave.appliedDate } : l,
        ),
      )
    } else {
      const newLeave: Leave = {
        ...leaveData,
        id: Date.now().toString(),
        appliedDate: new Date().toISOString().split("T")[0],
      }
      setLeaves([...leaves, newLeave])
    }
    setIsLeaveModalOpen(false)
  }

  const handleDeleteLeave = (leaveId: string) => {
    setLeaves(leaves.filter((l) => l.id !== leaveId))
  }

  const handleApproveLeave = (leaveId: string) => {
    setLeaves(leaves.map((l) => (l.id === leaveId ? { ...l, status: "approved" as const, approvedBy: user?.name } : l)))
  }

  const handleRejectLeave = (leaveId: string) => {
    setLeaves(leaves.map((l) => (l.id === leaveId ? { ...l, status: "rejected" as const } : l)))
  }

  const pendingLeaves = leaves.filter((leave) => leave.status === "pending")
  const approvedLeaves = leaves.filter((leave) => leave.status === "approved")
  const currentYearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Holidays & Leaves</h1>
              <p className="text-gray-600">Manage company holidays and employee leave requests</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={handleAddLeave}>
                <Plus className="h-4 w-4 mr-2" />
                Add Leave
              </Button>
              <Button onClick={handleAddHoliday}>
                <Plus className="h-4 w-4 mr-2" />
                Add Holiday
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Holidays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{holidays.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Leaves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingLeaves.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Leaves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedLeaves.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {holidays.filter((h) => new Date(h.date).getMonth() === currentMonth).length +
                  leaves.filter((l) => new Date(l.startDate).getMonth() === currentMonth).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Calendar View
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
                      <SelectTrigger className="w-32">
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
                    <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                      <SelectTrigger className="w-20">
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
                    <Button variant="outline" size="sm" onClick={handleNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <HolidayCalendar
                  selectedDate={selectedDate}
                  holidays={holidays}
                  leaves={leaves}
                  onEditHoliday={handleEditHoliday}
                  onEditLeave={handleEditLeave}
                />
              </CardContent>
            </Card>
          </div>

          {/* Pending Leaves */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Leave Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingLeaves.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No pending leave requests.</p>
                ) : (
                  pendingLeaves.map((leave) => (
                    <div key={leave.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{leave.employeeName}</h4>
                          <p className="text-sm text-gray-600">{leave.reason}</p>
                        </div>
                        <Badge variant="secondary">{leave.type}</Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} to ${leave.endDate}`}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleApproveLeave(leave.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectLeave(leave.id)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Upcoming Holidays */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Holidays</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {holidays
                  .filter((holiday) => new Date(holiday.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((holiday) => (
                    <div key={holiday.id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{holiday.name}</h4>
                        <p className="text-sm text-gray-600">{holiday.date}</p>
                      </div>
                      <Badge
                        variant={
                          holiday.type === "public" ? "default" : holiday.type === "company" ? "secondary" : "outline"
                        }
                      >
                        {holiday.type}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <HolidayModal
          isOpen={isHolidayModalOpen}
          onClose={() => setIsHolidayModalOpen(false)}
          onSave={handleSaveHoliday}
          onDelete={handleDeleteHoliday}
          holiday={editingHoliday}
        />

        <LeaveModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onSave={handleSaveLeave}
          onDelete={handleDeleteLeave}
          leave={editingLeave}
        />
      </main>
    </div>
  )
}
