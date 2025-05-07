export interface User {
    id: string
    name: string
    email: string
    role: string
    status: string
    avatar: string | null
  }
  
  export const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "manager",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "user",
      status: "inactive",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "user",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Michael Wilson",
      email: "michael@example.com",
      role: "user",
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "6",
      name: "Sarah Brown",
      email: "sarah@example.com",
      role: "manager",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "7",
      name: "David Miller",
      email: "david@example.com",
      role: "user",
      status: "suspended",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "8",
      name: "Lisa Taylor",
      email: "lisa@example.com",
      role: "user",
      status: "active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]
  