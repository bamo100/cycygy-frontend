"use client"

import { useQuery, gql } from "@apollo/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, UserMinus, Activity } from "lucide-react"

const GET_DASHBOARD_STATS = gql`
  query getDashboardStats {
    getDashboardStats {
      totalUsers
      newUsers
      inactiveUsers
      activeNow
      totalUsersGrowth
      newUsersGrowth
      inactiveUsersGrowth
      activeNowGrowth
    }
  }
`

export function DashboardOverview() {
  const { loading, data } = useQuery(GET_DASHBOARD_STATS)

  // Default values in case of loading or error
  const stats = data?.getDashboardStats || {
    totalUsers: 0,
    newUsers: 0,
    inactiveUsers: 0,
    activeNow: 0,
    totalUsersGrowth: 0,
    newUsersGrowth: 0,
    inactiveUsersGrowth: 0,
    activeNowGrowth: 0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalUsersGrowth > 0 ? "+" : ""}
            {stats.totalUsersGrowth}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Users</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.newUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.newUsersGrowth > 0 ? "+" : ""}
            {stats.newUsersGrowth}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
          <UserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.inactiveUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.inactiveUsersGrowth > 0 ? "+" : ""}
            {stats.inactiveUsersGrowth}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "..." : stats.activeNow.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeNowGrowth > 0 ? "+" : ""}
            {stats.activeNowGrowth}% from last hour
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
