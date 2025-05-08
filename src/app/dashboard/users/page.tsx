"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useQuery, gql } from "@apollo/client"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { UserTable } from "@/components/dashboard/user-table"
import { useToast } from "@/hooks/use-toast"

const GET_USERS = gql`
  query getAllUsers($page: Int!, $limit: Int!) {
    getAllUsers(page: $page, limit: $limit) {
      data {
        id
        firstName
        lastName
        email
        role
        status
        avatar
      }
      pagination {
        total
        pages
        page
        limit
      }
    }
  }
`

export default function UsersPage() {
  const { toast } = useToast()
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: { page: 1, limit: 10 },
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    console.log("Data fetched:", data?.getAllUsers)
    if (error) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [error, toast, data])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Users" description="Manage your users and their permissions" />
        <Button asChild>
          <Link href="/dashboard/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>
      <UserTable loading={loading} initialData={data?.getAllUsers} />
    </div>
  )
}
