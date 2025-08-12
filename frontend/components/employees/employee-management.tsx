"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { EmployeeTable } from "./employee-table"
import { EmployeeModal } from "./employee-modal"
import { useAuth } from "@/contexts/auth-context"

export interface Employee {
  id: string
  name: string
  empId: string
  email: string
  phone: string
  department: string
  skills: string[]
  weekOffs: string[]
  fixedShift: string
  status: "active" | "inactive"
}

// Mock data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    empId: "EMP001",
    email: "john.smith@company.com",
    phone: "+1-555-0101",
    department: "Engineering",
    skills: ["React", "Node.js", "TypeScript"],
    weekOffs: ["Saturday", "Sunday"],
    fixedShift: "S1",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    empId: "EMP002",
    email: "sarah.johnson@company.com",
    phone: "+1-555-0102",
    department: "Design",
    skills: ["UI/UX", "Figma", "Prototyping"],
    weekOffs: ["Sunday", "Monday"],
    fixedShift: "S2",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Davis",
    empId: "EMP003",
    email: "mike.davis@company.com",
    phone: "+1-555-0103",
    department: "Engineering",
    skills: ["Python", "Django", "PostgreSQL"],
    weekOffs: ["Saturday", "Sunday"],
    fixedShift: "S1",
    status: "active",
  },
  {
    id: "4",
    name: "Emily Chen",
    empId: "EMP004",
    email: "emily.chen@company.com",
    phone: "+1-555-0104",
    department: "Marketing",
    skills: ["Content Strategy", "SEO", "Analytics"],
    weekOffs: ["Friday", "Saturday"],
    fixedShift: "S3",
    status: "inactive",
  },
]

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const { user } = useAuth()

  // Filter employees based on search and filters
  const filterEmployees = () => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((emp) => emp.department === departmentFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((emp) => emp.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }

  // Apply filters whenever search term or filters change
  useState(() => {
    filterEmployees()
  })

  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleSaveEmployee = (employeeData: Omit<Employee, "id">) => {
    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployee.id ? { ...employeeData, id: editingEmployee.id } : emp,
      )
      setEmployees(updatedEmployees)
    } else {
      // Add new employee
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString(),
      }
      setEmployees([...employees, newEmployee])
    }
    setIsModalOpen(false)
    filterEmployees()
  }

  const handleDeleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id)
    setEmployees(updatedEmployees)
    filterEmployees()
  }

  const departments = Array.from(new Set(employees.map((emp) => emp.department)))

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employees.filter((emp) => emp.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {employees.filter((emp) => emp.status === "inactive").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, employee ID, or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    filterEmployees()
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={departmentFilter}
              onValueChange={(value) => {
                setDepartmentFilter(value)
                filterEmployees()
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                filterEmployees()
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <EmployeeTable employees={filteredEmployees} onEdit={handleEditEmployee} onDelete={handleDeleteEmployee} />

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />
    </div>
  )
}
