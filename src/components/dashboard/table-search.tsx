"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface UserSearchParams {
  searchTerm?: string
  role?: string
  status?: string
}

interface UserTableSearchProps {
  onSearch: (params: UserSearchParams) => void
  initialParams?: UserSearchParams
}

export function UserTableSearch({ onSearch, initialParams = {} }: UserTableSearchProps) {
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    searchTerm: initialParams.searchTerm || "",
    role: initialParams.role || "",
    status: initialParams.status || "",
  })

  // Apply search when params change
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchParams)
    }, 300) // Debounce search

    return () => clearTimeout(handler)
  }, [searchParams, onSearch])

  const handleReset = () => {
    setSearchParams({
      searchTerm: "",
      role: "",
      status: "",
    })
  }

  const hasFilters = searchParams.searchTerm || searchParams.role || searchParams.status

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchParams.searchTerm || ""}
            onChange={(e) => setSearchParams({ ...searchParams, searchTerm: e.target.value })}
          />
        </div>
        <div className="flex flex-1 gap-4">
          <div className="w-full md:w-1/2">
            <Select
              value={searchParams.role || ""}
              onValueChange={(value) => setSearchParams({ ...searchParams, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/2">
            <Select
              value={searchParams.status || ""}
              onValueChange={(value) => setSearchParams({ ...searchParams, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasFilters && (
          <Button variant="outline" size="icon" onClick={handleReset} aria-label="Reset filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {hasFilters && (
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="text-muted-foreground">Active filters:</div>
          {searchParams.searchTerm && (
            <div className="rounded bg-muted px-2 py-1">Search: {searchParams.searchTerm}</div>
          )}
          {searchParams.role && <div className="rounded bg-muted px-2 py-1">Role: {searchParams.role}</div>}
          {searchParams.status && <div className="rounded bg-muted px-2 py-1">Status: {searchParams.status}</div>}
        </div>
      )}
    </div>
  )
}
