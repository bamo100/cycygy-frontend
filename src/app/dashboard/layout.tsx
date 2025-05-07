"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/dashboard/sidebar-provider"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { useQuery, gql } from "@apollo/client"

const CHECK_USER = gql`
    query checkAuthUser {
        checkAuthUser {
            id
        }
    }
`

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  // const [user, setUser] = useState(null)

    const { loading, error, data } = useQuery(CHECK_USER, {
      variables: { page: 1, limit: 10 },
      fetchPolicy: "network-only",
    });
      
    useEffect(() => {
      if (!loading && data) {
        if (data.checkAuthUser) {
          // setUser(data.checkAuthUser);
          setIsLoading(false);
        } else {
          if (window.location.pathname !== "/login") {
            router.push("/login");
          }
        }
      }
      if (error) {
        if (window.location.pathname !== "/login") {
          router.push("/login");
        }
      }
    }, [loading, data, error, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
