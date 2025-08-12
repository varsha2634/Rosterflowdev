"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Users, Calendar, Settings, FileSpreadsheet, AlertTriangle, Clock, CheckCircle, Activity } from "lucide-react"

interface RecentActivity {
  id: string
  type: "roster_generated" | "employee_added" | "rule_updated" | "leave_approved"
  description: string
  timestamp: string
  user: string
}

interface PendingTask {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  dueDate: string
}

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "roster_generated",
    description: "December 2024 roster generated",
    timestamp: "2 hours ago",
    user: "Admin User",
  },
  {
    id: "2",
    type: "leave_approved",
    description: "Leave request approved for John Smith",
    timestamp: "4 hours ago",
    user: "Manager User",
  },
  {
    id: "3",
    type: "employee_added",
    description: "New employee added: Sarah Wilson",
    timestamp: "1 day ago",
    user: "HR User",
  },
  {
    id: "4",
    type: "rule_updated",
    description: "Minimum rest period rule updated",
    timestamp: "2 days ago",
    user: "Admin User",
  },
]

const mockPendingTasks: PendingTask[] = [
  {
    id: "1",
    title: "Review January 2025 Roster",
    description: "Generated roster needs approval before publishing",
    priority: "high",
    dueDate: "2024-12-20",
  },
  {
    id: "2",
    title: "Process Leave Requests",
    description: "3 pending leave requests require approval",
    priority: "medium",
    dueDate: "2024-12-18",
  },
  {
    id: "3",
    title: "Update Holiday Calendar",
    description: "Add company holidays for next quarter",
    priority: "low",
    dueDate: "2024-12-25",
  },
]

const activityIcons = {
  roster_generated: FileSpreadsheet,
  employee_added: Users,
  rule_updated: Settings,
  leave_approved: CheckCircle,
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export function EnhancedDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const quickActions = [
    {
      title: "Generate New Roster",
      description: "Create schedule for next month",
      icon: FileSpreadsheet,
      href: "/roster/generate",
      color: "bg-blue-500",
    },
    {
      title: "View Pending Leaves",
      description: "3 requests need approval",
      icon: Calendar,
      href: "/holidays",
      color: "bg-orange-500",
    },
    {
      title: "Add New Employee",
      description: "Onboard team member",
      icon: Users,
      href: "/employees",
      color: "bg-green-500",
    },
    {
      title: "Review Rules",
      description: "Update scheduling policies",
      icon: Settings,
      href: "/rules",
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">
          Here's what's happening with your team today. You have 3 pending tasks and 2 new notifications.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> from last month
            </p>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rosters</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">1</span> in draft
            </p>
            <Progress value={90} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">3</span> leave requests
            </p>
            <Progress value={35} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rule Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-5</span> from last week
            </p>
            <Progress value={15} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <div
                    key={action.title}
                    className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={`p-3 rounded-lg ${action.color} text-white mr-4`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => {
                  const IconComponent = activityIcons[activity.type]
                  return (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          by {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPendingTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Employee Sync</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rule Engine</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Status</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-xs text-yellow-600">Pending</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
