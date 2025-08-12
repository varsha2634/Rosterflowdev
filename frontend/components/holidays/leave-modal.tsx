"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import type { Leave } from "./holidays-management"

interface LeaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (leave: Omit<Leave, "id" | "appliedDate">) => void
  onDelete: (leaveId: string) => void
  leave?: Leave | null
}

// Mock employees for dropdown
const mockEmployees = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Mike Davis" },
  { id: "4", name: "Emily Chen" },
  { id: "5", name: "David Wilson" },
  { id: "6", name: "Lisa Brown" },
]

export function LeaveModal({ isOpen, onClose, onSave, onDelete, leave }: LeaveModalProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    startDate: "",
    endDate: "",
    reason: "",
    type: "vacation" as Leave["type"],
    status: "pending" as Leave["status"],
    approvedBy: "",
  })

  useEffect(() => {
    if (leave) {
      setFormData({
        employeeId: leave.employeeId,
        employeeName: leave.employeeName,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        type: leave.type,
        status: leave.status,
        approvedBy: leave.approvedBy || "",
      })
    } else {
      setFormData({
        employeeId: "",
        employeeName: "",
        startDate: "",
        endDate: "",
        reason: "",
        type: "vacation",
        status: "pending",
        approvedBy: "",
      })
    }
  }, [leave, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleDelete = () => {
    if (leave && window.confirm("Are you sure you want to delete this leave request?")) {
      onDelete(leave.id)
      onClose()
    }
  }

  const handleEmployeeChange = (employeeId: string) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId)
    setFormData({
      ...formData,
      employeeId,
      employeeName: employee?.name || "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{leave ? "Edit Leave Request" : "Add New Leave Request"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Leave Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Leave["type"]) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="emergency">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Leave["status"]) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              required
              placeholder="Please provide a reason for this leave request..."
            />
          </div>

          {formData.status === "approved" && (
            <div className="space-y-2">
              <Label htmlFor="approvedBy">Approved By</Label>
              <Input
                id="approvedBy"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                placeholder="Manager name"
              />
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              <div>
                {leave && (
                  <Button type="button" variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">{leave ? "Update" : "Add"} Leave</Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
