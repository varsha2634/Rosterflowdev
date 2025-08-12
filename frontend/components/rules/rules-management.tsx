"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Clock, Users } from "lucide-react"
import { RuleModal } from "./rule-modal"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export interface Rule {
  id: string
  name: string
  description: string
  type: "shift" | "rest" | "skill" | "coverage" | "custom"
  enabled: boolean
  priority: number
  conditions: {
    [key: string]: any
  }
  constraints: {
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

// Mock rules data
const mockRules: Rule[] = [
  {
    id: "1",
    name: "Minimum Rest Period",
    description: "Employees must have at least 12 hours rest between shifts",
    type: "rest",
    enabled: true,
    priority: 1,
    conditions: {
      minRestHours: 12,
      applyToAllShifts: true,
    },
    constraints: {
      violationAction: "block",
      allowOverride: false,
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Maximum Consecutive Days",
    description: "No employee should work more than 6 consecutive days",
    type: "shift",
    enabled: true,
    priority: 2,
    conditions: {
      maxConsecutiveDays: 6,
      includeWeekends: true,
    },
    constraints: {
      violationAction: "warn",
      allowOverride: true,
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Skill-Based Assignment",
    description: "Only assign employees to shifts matching their skills",
    type: "skill",
    enabled: true,
    priority: 3,
    conditions: {
      requireExactMatch: false,
      minimumSkillLevel: "intermediate",
    },
    constraints: {
      violationAction: "block",
      allowOverride: true,
    },
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
  {
    id: "4",
    name: "Minimum Coverage",
    description: "Ensure minimum number of employees per shift",
    type: "coverage",
    enabled: true,
    priority: 4,
    conditions: {
      minEmployeesPerShift: {
        S1: 3,
        S2: 2,
        S3: 4,
        S4: 2,
        S5: 1,
      },
    },
    constraints: {
      violationAction: "warn",
      allowOverride: true,
    },
    createdAt: "2024-01-17",
    updatedAt: "2024-01-17",
  },
  {
    id: "5",
    name: "Weekend Rotation",
    description: "Fairly distribute weekend shifts among all employees",
    type: "shift",
    enabled: false,
    priority: 5,
    conditions: {
      rotationPeriod: "monthly",
      weekendDays: ["Saturday", "Sunday"],
    },
    constraints: {
      violationAction: "warn",
      allowOverride: true,
    },
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
]

const ruleTypeIcons = {
  shift: Clock,
  rest: Clock,
  skill: Users,
  coverage: Users,
  custom: Settings,
}

const ruleTypeColors = {
  shift: "bg-blue-100 text-blue-800",
  rest: "bg-green-100 text-green-800",
  skill: "bg-purple-100 text-purple-800",
  coverage: "bg-orange-100 text-orange-800",
  custom: "bg-gray-100 text-gray-800",
}

export function RulesManagement() {
  const [rules, setRules] = useState<Rule[]>(mockRules)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const handleToggleRule = (ruleId: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              enabled: !rule.enabled,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : rule,
      ),
    )
  }

  const handleAddRule = () => {
    setEditingRule(null)
    setIsModalOpen(true)
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    setIsModalOpen(true)
  }

  const handleSaveRule = (ruleData: Omit<Rule, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString().split("T")[0]

    if (editingRule) {
      // Update existing rule
      setRules(
        rules.map((rule) =>
          rule.id === editingRule.id
            ? {
                ...ruleData,
                id: editingRule.id,
                createdAt: editingRule.createdAt,
                updatedAt: now,
              }
            : rule,
        ),
      )
    } else {
      // Add new rule
      const newRule: Rule = {
        ...ruleData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      }
      setRules([...rules, newRule])
    }
    setIsModalOpen(false)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
  }

  const enabledRules = rules.filter((rule) => rule.enabled)
  const disabledRules = rules.filter((rule) => !rule.enabled)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rules Management</h1>
              <p className="text-gray-600">Configure scheduling rules and constraints</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button onClick={handleAddRule}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rules.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{enabledRules.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Inactive Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{disabledRules.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {rules.filter((rule) => rule.priority <= 2).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Rules */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Active Rules ({enabledRules.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enabledRules.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active rules configured.</p>
            ) : (
              enabledRules
                .sort((a, b) => a.priority - b.priority)
                .map((rule) => {
                  const IconComponent = ruleTypeIcons[rule.type]
                  return (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                          <Badge className={ruleTypeColors[rule.type]}>{rule.type}</Badge>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{rule.name}</h3>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Priority: {rule.priority}</span>
                            <span className="text-xs text-gray-500">Updated: {rule.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule)}>
                          Edit
                        </Button>
                        <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(rule.id)} />
                      </div>
                    </div>
                  )
                })
            )}
          </CardContent>
        </Card>

        {/* Inactive Rules */}
        {disabledRules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                Inactive Rules ({disabledRules.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {disabledRules
                .sort((a, b) => a.priority - b.priority)
                .map((rule) => {
                  const IconComponent = ruleTypeIcons[rule.type]
                  return (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 opacity-75"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-5 w-5 text-gray-400" />
                          <Badge variant="secondary">{rule.type}</Badge>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">{rule.name}</h3>
                          <p className="text-sm text-gray-500">{rule.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-400">Priority: {rule.priority}</span>
                            <span className="text-xs text-gray-400">Updated: {rule.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule)}>
                          Edit
                        </Button>
                        <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(rule.id)} />
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        )}

        {/* Rule Modal */}
        <RuleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRule}
          onDelete={handleDeleteRule}
          rule={editingRule}
        />
      </main>
    </div>
  )
}
