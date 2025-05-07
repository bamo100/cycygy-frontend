"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, LogOut, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "./sidebar-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { gql, useMutation } from "@apollo/client"
import { toast } from "@/hooks/use-toast"

const LOGOUT_MUTATION = gql`
  mutation logoutUser {
    logoutUser
  }
`

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, toggle, close } = useSidebar();
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
      // const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_URL}`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     query: `
      //       mutation {
      //         logout {
      //           success
      //         }
      //       }
      //     `,
      //   }),
      // })
      logout();

      // Redirect to login page regardless of response
      //router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      // Still redirect to login page
      router.push("/login")
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={close} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out md:relative md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className={cn("font-semibold", !isOpen && "md:hidden")}>Dashboard</h2>
          <Button variant="ghost" size="icon" onClick={toggle} className="md:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <div className="py-4">
            <nav className="space-y-1 px-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <link.icon className="mr-2 h-5 w-5" />
                  <span className={cn("transition-opacity", !isOpen && "md:hidden")}>{link.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-4 left-0 right-0 px-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span className={cn("transition-opacity", !isOpen && "md:hidden")}>Logout</span>
            </Button>
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}
