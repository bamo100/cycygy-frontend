"use client"

import Link from "next/link"
import { Menu, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "./sidebar-provider"
import { useRouter } from "next/navigation"
import { gql, useMutation } from "@apollo/client"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

const LOGOUT_MUTATION = gql`
  mutation logoutUser {
    logoutUser
  }
`

export function DashboardHeader() {
  const { toggle } = useSidebar()
  const router = useRouter()
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      toast({
        title: "Logout successful",
        description: "You have been loggedOut successfully",
      })

      // Redirect to dashboard
      router.push("/login")
    }
  })

  const handleLogout = async () => {
    try {
      // Call your logout mutation which should clear the cookie on the server
      logout();

    } catch (error) {
      console.error("Logout failed:", error)
      // Still redirect to login page
      router.push("/login")
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 lg:h-[60px] items-center border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={toggle} className="mr-2">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="flex-1">
        <Link href="/dashboard" className="font-semibold">
          Admin Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
              <Image src="https://i.pravatar.cc/150?img=1" width={32} height={32} alt="Avatar" className="h-8 w-8 rounded-full" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
