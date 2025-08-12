"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { X } from "lucide-react"
import type { Employee } from "./employee-management"

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (employee: Omit<Employee, "id">) => void
  employee?: Employee | null
}

const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"]
const shifts = ["S1", "S2", "S3", "S4", "S5"]
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const commonSkills = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Java",
  "UI/UX",
  "Figma",
  "Photoshop",
  "Content Strategy",
  "SEO",
  "Analytics",
  "Sales",
  "CRM",
  "Project Management",
]

export function EmployeeModal({ isOpen, onClose, onSave, employee }: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    empId: "",
    email: "",
    phone: "",
    department: "",
    skills: [] as string[],
    weekOffs: [] as string[],
    fixedShift: "",
    status: "active" as "active" | "inactive",
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        empId: employee.empId,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        skills: employee.skills,
        weekOffs: employee.weekOffs,
        fixedShift: employee.fixedShift,
        status: employee.status,
      })
    } else {
      setFormData({
        name: "",
        empId: "",
        email: "",
        phone: "",
        department: "",
        skills: [],
        weekOffs: [],
        fixedShift: "",
        status: "active",
      })
    }
  }, [employee, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
    setNewSkill("")
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleWeekOffChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, weekOffs: [...formData.weekOffs, day] })
    } else {
      setFormData({
        ...formData,
        weekOffs: formData.weekOffs.filter((d) => d !== day),
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empId">Employee ID</Label>
              <Input
                id="empId"
                value={formData.empId}
                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fixedShift">Fixed Shift</Label>
              <Select
                value={formData.fixedShift}
                onValueChange={(value) => setFormData({ ...formData, fixedShift: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift} value={shift}>
                      {shift}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleSkillRemove(skill)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSkillAdd(newSkill)
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => handleSkillAdd(newSkill)}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonSkills
                .filter((skill) => !formData.skills.includes(skill))
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSkillAdd(skill)}
                  >
                    + {skill}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Week Offs</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={day}
                    checked={formData.weekOffs.includes(day)}
                    onCheckedChange={(checked) => handleWeekOffChange(day, checked as boolean)}
                  />
                  <Label htmlFor={day} className="text-sm">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{employee ? "Update" : "Add"} Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
