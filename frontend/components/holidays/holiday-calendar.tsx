"use client"

import { Badge } from "@/components/ui/badge"
import type { Holiday, Leave } from "./holidays-management"

interface HolidayCalendarProps {
  selectedDate: Date
  holidays: Holiday[]
  leaves: Leave[]
  onEditHoliday: (holiday: Holiday) => void
  onEditLeave: (leave: Leave) => void
}

export function HolidayCalendar({ selectedDate, holidays, leaves, onEditHoliday, onEditLeave }: HolidayCalendarProps) {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Create calendar grid
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getEventsForDay = (day: number) => {
    const dateStr = formatDate(day)
    const dayHolidays = holidays.filter((h) => h.date === dateStr)
    const dayLeaves = leaves.filter((l) => {
      const startDate = new Date(l.startDate)
      const endDate = new Date(l.endDate)
      const currentDate = new Date(dateStr)
      return currentDate >= startDate && currentDate <= endDate
    })

    return { holidays: dayHolidays, leaves: dayLeaves }
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="w-full">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-24 p-1"></div>
          }

          const events = getEventsForDay(day)
          const isToday =
            new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year

          return (
            <div
              key={day}
              className={`h-24 p-1 border rounded-lg ${
                isToday ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
              } hover:bg-gray-50`}
            >
              <div className={`text-sm font-medium ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</div>
              <div className="mt-1 space-y-1">
                {events.holidays.map((holiday) => (
                  <Badge
                    key={holiday.id}
                    variant={
                      holiday.type === "public" ? "default" : holiday.type === "company" ? "secondary" : "outline"
                    }
                    className="text-xs cursor-pointer block truncate"
                    onClick={() => onEditHoliday(holiday)}
                  >
                    {holiday.name}
                  </Badge>
                ))}
                {events.leaves.map((leave) => (
                  <Badge
                    key={leave.id}
                    variant={
                      leave.status === "approved" ? "default" : leave.status === "pending" ? "secondary" : "destructive"
                    }
                    className="text-xs cursor-pointer block truncate"
                    onClick={() => onEditLeave(leave)}
                  >
                    {leave.employeeName}
                  </Badge>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
