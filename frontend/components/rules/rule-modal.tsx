"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2 } from "lucide-react"
import type { Rule } from "./rules-management"

interface RuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rule: Omit<Rule, "id" | "createdAt" | "updatedAt">) => void
  onDelete: (ruleId: string) => void
  rule?: Rule | null
}

const ruleTemplates = [
  {
    id: "min-rest",
    name: "Minimum Rest Period",
    description: "Ensure employees have adequate rest between shifts",
    type: "rest" as const,
    conditions: { minRestHours: 12, applyToAllShifts: true },
    constraints: { violationAction: "block", allowOverride: false },
  },
  {
    id: "max-consecutive",
    name: "Maximum Consecutive Days",
    description: "Limit consecutive working days",
    type: "shift" as const,
    conditions: { maxConsecutiveDays: 6, includeWeekends: true },
    constraints: { violationAction: "warn", allowOverride: true },
  },
  {
    id: "skill-match",
    name: "Skill-Based Assignment",
    description: "Match employee skills to shift requirements",
    type: "skill" as const,
    conditions: { requireExactMatch: false, minimumSkillLevel: "intermediate" },
    constraints: { violationAction: "block", allowOverride: true },
  },
  {
    id: "min-coverage",
    name: "Minimum Coverage",
    description: "Ensure adequate staffing levels",
    type: "coverage" as const,
    conditions: { minEmployeesPerShift: { S1: 3, S2: 2, S3: 4, S4: 2, S5: 1 } },
    constraints: { violationAction: "warn", allowOverride: true },
  },
]

export function RuleModal({ isOpen, onClose, onSave, onDelete, rule }: RuleModalProps) {
  const [activeTab, setActiveTab] = useState("template")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "custom" as Rule["type"],
    enabled: true,
    priority: 5,
    conditions: {} as any,
    constraints: {
      violationAction: "warn",
      allowOverride: true,
    },
  })

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        type: rule.type,
        enabled: rule.enabled,
        priority: rule.priority,
        conditions: rule.conditions,
        constraints: rule.constraints,
      })
      setActiveTab("custom")
    } else {
      setFormData({
        name: "",
        description: "",
        type: "custom",
        enabled: true,
        priority: 5,
        conditions: {},
        constraints: {
          violationAction: "warn",
          allowOverride: true,
        },
      })
      setActiveTab("template")
    }
  }, [rule, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleTemplateSelect = (template: (typeof ruleTemplates)[0]) => {
    setFormData({
      name: template.name,
      description: template.description,
      type: template.type,
      enabled: true,
      priority: 5,
      conditions: template.conditions,
      constraints: template.constraints,
    })
    setActiveTab("custom")
  }

  const handleDelete = () => {
    if (rule && window.confirm("Are you sure you want to delete this rule?")) {
      onDelete(rule.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Rule" : "Create New Rule"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template" disabled={!!rule}>
              From Template
            </TabsTrigger>
            <TabsTrigger value="custom">Custom Rule</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ruleTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 capitalize">Type: {template.type}</span>
                      <Button size="sm" onClick={() => handleTemplateSelect(template)}>
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Rule Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Rule["type"]) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shift">Shift Rules</SelectItem>
                      <SelectItem value="rest">Rest Period</SelectItem>
                      <SelectItem value="skill">Skill Matching</SelectItem>
                      <SelectItem value="coverage">Coverage Rules</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (1-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enabled">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                    />
                    <span className="text-sm">{formData.enabled ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              {/* Rule-specific conditions based on type */}
              {formData.type === "rest" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rest Period Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Minimum Rest Hours</Label>
                      <Input
                        type="number"
                        value={formData.conditions.minRestHours || 12}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            conditions: { ...formData.conditions, minRestHours: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.conditions.applyToAllShifts || true}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            conditions: { ...formData.conditions, applyToAllShifts: checked },
                          })
                        }
                      />
                      <Label>Apply to all shifts</Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.type === "shift" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Shift Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Maximum Consecutive Days</Label>
                      <Input
                        type="number"
                        value={formData.conditions.maxConsecutiveDays || 6}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            conditions: { ...formData.conditions, maxConsecutiveDays: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.conditions.includeWeekends || true}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            conditions: { ...formData.conditions, includeWeekends: checked },
                          })
                        }
                      />
                      <Label>Include weekends in count</Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.type === "skill" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skill Matching Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Minimum Skill Level</Label>
                      <Select
                        value={formData.conditions.minimumSkillLevel || "intermediate"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            conditions: { ...formData.conditions, minimumSkillLevel: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.conditions.requireExactMatch || false}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            conditions: { ...formData.conditions, requireExactMatch: checked },
                          })
                        }
                      />
                      <Label>Require exact skill match</Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Constraints */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rule Constraints</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Violation Action</Label>
                    <Select
                      value={formData.constraints.violationAction}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          constraints: { ...formData.constraints, violationAction: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block Assignment</SelectItem>
                        <SelectItem value="warn">Show Warning</SelectItem>
                        <SelectItem value="ignore">Ignore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.constraints.allowOverride}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          constraints: { ...formData.constraints, allowOverride: checked },
                        })
                      }
                    />
                    <Label>Allow manual override</Label>
                  </div>
                </CardContent>
              </Card>

              <DialogFooter>
                <div className="flex justify-between w-full">
                  <div>
                    {rule && (
                      <Button type="button" variant="destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Rule
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit">{rule ? "Update" : "Create"} Rule</Button>
                  </div>
                </div>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
