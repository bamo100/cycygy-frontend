"use client"

import { useState, useEffect } from "react"
import { useMutation, gql, useLazyQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { PaginationControls } from "./pagination"
import { TableInstance } from "./table"
import { UserSearchParams, UserTableSearch } from "./table-search"

const GET_USERS = gql`
  query getAllUsers($page: Int!, $limit: Int!, $searchTerm: String, $role: String, $status: String) {
    getAllUsers(page: $page, limit: $limit, searchTerm: $searchTerm, role: $role, status: $status) {
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

const DELETE_USER = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`

interface User {
  id: string
  lastName: string
  firstName: string
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
  data: User[]
  pagination: Pagination
}

interface UserTableProps {
  loading?: boolean
  initialData?: UsersData
}

export function UserTable({ initialData }: UserTableProps) {
  const { toast } = useToast()
  const defaultLimit = 10

  const [page, setPage] = useState(initialData?.pagination.page || 1)
  const [userList, setUserList] = useState<User[]>(initialData?.data || [])
  const [searchParams, setSearchParams] = useState<UserSearchParams>({})
  const [pagination, setPagination] = useState<Pagination>(
    initialData?.pagination || {
      total: 0,
      pages: 0,
      page: 1,
      limit: defaultLimit,
    }
  )

  const [getUsers, { loading, data }] = useLazyQuery(GET_USERS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.getAllUsers) {
        setUserList(data.getAllUsers.data || [])
        setPagination(data.getAllUsers.pagination)
      }
    },
    onError: (error) => {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: (data) => {
      if (data.deleteUser) {
        toast({
          title: "User deleted",
          description: "The user has been deleted successfully",
        })

        setUserList((prev) => prev.filter((user) => user.id !== data.deleteUser.id))

        const shouldGoToPreviousPage = userList.length === 1 && page > 1
        setPage(shouldGoToPreviousPage ? page - 1 : page)
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

  const fetchUsers = (currentPage: number, filters: UserSearchParams) => {
    getUsers({
      variables: {
        page: currentPage,
        limit: defaultLimit,
        ...filters,
      },
    })
  }

  useEffect(() => {
    fetchUsers(page, searchParams)
  }, [page, searchParams])

  const handleDelete = (id: string) => {
    deleteUser({ variables: { id } })
  }

  const handleSearch = (params: UserSearchParams) => {
    //setPage(1)
    setSearchParams(params)
  }

  const handlePageChange = (newPage: number) => {
   //setUserList(data?.getAllUsers.data || []);
    setPage(newPage);
    //refetch({ page: newPage, limit: pagination.limit });
  }

  //Update userList when data changes
  useEffect(() => {
    if (data?.getAllUsers) {
      setUserList(data.getAllUsers.data || []);
      setPagination(data.getAllUsers.pagination);
    }
  }, [data]);

  const isLoading = loading || (!initialData && userList.length === 0)

  return (
    <div className="space-y-4">
      <UserTableSearch onSearch={handleSearch} />

      <TableInstance userList={userList} isLoading={isLoading} handleDelete={handleDelete} />

      {pagination.pages > 1 && (
        <PaginationControls
          page={page}
          pages={pagination.pages}
          loading={loading}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
