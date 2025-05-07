"use client"

import { useState, useEffect } from "react"
import { useMutation, gql, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { PaginationControls } from "./pagination"
import { TableInstance } from "./table"

const GET_USERS = gql`
  query getAllUsers($page: Int!, $limit: Int!) {
    getAllUsers(page: $page, limit: $limit) {
      users {
        id
        lastName
        firstName
        email
        role
        avatar
        status
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

const DELETE_USER = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`

interface User {
  id: string
  lastName: string;
  firstName: string;
  email: string
  role: string
  status: string
  avatar?: string | null
}

interface Pagination {
  total: number
  pages: number
  page: number
  limit: number
}

interface UsersData {
  users: User[]
  pagination: Pagination
}

interface UserTableProps {
  loading?: boolean
  initialData?: UsersData
}

export function UserTable({ initialData }: UserTableProps) {
  const { toast } = useToast()
  const [page, setPage] = useState(initialData?.pagination?.page || 1)
  const [userList, setUserList] = useState<User[]>(initialData?.users || [])
  const [pagination, setPagination] = useState<Pagination>(
    initialData?.pagination || {
      total: 0,
      pages: 0,
      page: 1,
      limit: 10,
    },
  )

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: (data) => {
      if (data.deleteUser) {
        toast({
          title: "User deleted",
          description: "The user has been deleted successfully",
        })

        // Remove user from the list
        setUserList(userList.filter((user) => user.id !== data.deleteUser.id))

        // If the page is now empty and it's not the first page, go to the previous page
        if (userList.length === 1 && page > 1) {
          setPage(page - 1)
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Update state when props change
  useEffect(() => {
    if (initialData) {
      setUserList(initialData.users || [])
      setPagination(
        initialData.pagination || {
          total: 0,
          pages: 0,
          page: 1,
          limit: 10,
        },
      )
    }
  }, [initialData])

  const handleDelete = (id: string) => {
    deleteUser({
      variables: { id },
    })
  }

  const { data, loading: queryLoading, refetch } = useQuery(GET_USERS, {
    variables: { page, limit: pagination.limit },
    fetchPolicy: 'network-only',
  });

  const handlePageChange = (newPage: number) => {
    setUserList(data?.getAllUsers.users || []);
    setPage(newPage);
    refetch({ page: newPage, limit: pagination.limit });
  };

  // Update userList when data changes
  useEffect(() => {
    if (data?.getAllUsers) {
      setUserList(data.getAllUsers.users || []);
      setPagination(data.getAllUsers.pagination);
    }
  }, [data]);


  return (
    <div className="space-y-4">
      <TableInstance userList={userList} queryLoading={queryLoading} handleDelete={handleDelete} />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <PaginationControls
          page={page}
          pages={pagination.pages}
          loading={queryLoading}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
