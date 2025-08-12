"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import type { Holiday } from "./holidays-management"

interface HolidayModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (holiday: Omit<Holiday, "id">) => void
  onDelete: (holidayId: string) => void
  holiday?: Holiday | null
}

export function HolidayModal({ isOpen, onClose, onSave, onDelete, holiday }: HolidayModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    description: "",
    type: "company" as Holiday["type"],
    recurring: false,
  })

  useEffect(() => {
    if (holiday) {
      setFormData({
        date: holiday.date,
        name: holiday.name,
        description: holiday.description || "",
        type: holiday.type,
        recurring: holiday.recurring,
      })
    } else {
      setFormData({
        date: "",
        name: "",
        description: "",
        type: "company",
        recurring: false,
      })
    }
  }, [holiday, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleDelete = () => {
    if (holiday && window.confirm("Are you sure you want to delete this holiday?")) {
      onDelete(holiday.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{holiday ? "Edit Holiday" : "Add New Holiday"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Holiday Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Christmas Day"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Holiday Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: Holiday["type"]) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public Holiday</SelectItem>
                <SelectItem value="company">Company Holiday</SelectItem>
                <SelectItem value="optional">Optional Holiday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Additional details about this holiday..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.recurring}
              onCheckedChange={(checked) => setFormData({ ...formData, recurring: checked })}
            />
            <Label>Recurring annually</Label>
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <div>
                {holiday && (
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
                <Button type="submit">{holiday ? "Update" : "Add"} Holiday</Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
