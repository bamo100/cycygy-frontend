"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Form schema for validation - we'll make password conditional based on role
export const userFormSchema = z
  .object({
    firstName: z.string().min(2, { message: "FirstName must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "LastName must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    role: z.string().min(1, { message: "Please select a role" }),
    status: z.string().min(1, { message: "Please select a status" }),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only require password if role is admin
      if (data.role === "admin" && (!data.password || data.password.length < 6)) {
        return false
      }
      return true
    },
    {
      message: "Password must be at least 6 characters for admin users",
      path: ["password"],
    },
  )

    export type UserFormValues = z.infer<typeof userFormSchema>

    export interface User {
        id: string
        firstName: string
        lastName: string
        email: string
        role: string
        status?: string
        avatar?: string | null
    }

    interface UserFormBaseProps {
        defaultValues: UserFormValues
        onSubmit: (values: UserFormValues) => Promise<void>
        submitButtonText: string
        loadingText: string
        initialAvatar?: string | null
        isEditMode?: boolean
    }

export function UserFormBase({
  defaultValues,
  onSubmit,
  submitButtonText,
  loadingText,
  initialAvatar = null,
  isEditMode = false,
}: UserFormBaseProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(initialAvatar)
  const [selectedRole, setSelectedRole] = useState<string>(defaultValues.role || "")

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    mode: "onChange", // Validate on change for better UX
  })

  // Watch for role changes to update the selectedRole state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "role" && value.role) {
        setSelectedRole(value.role as string)
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  async function handleSubmit(values: UserFormValues) {
    setIsLoading(true)

    try {
      await onSubmit(values)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL
      URL.createObjectURL(file)
      setAvatar(initialAvatar)
    }
  }

  // Check if we should show the password field
  const showPasswordField = selectedRole === "admin"

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border bg-muted">
                  {avatar ? (
                    <img src={avatar || "/placeholder.svg"} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">No image</div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload avatar</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <div className="w-full space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedRole(value)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {selectedRole === "admin"
                        ? "Admin users have full access and require a password"
                        : "Regular users have limited access"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Current account status</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Only show password field if role is admin */}
            {showPasswordField && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isEditMode ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormDescription>
                      {isEditMode
                        ? "Only fill this if you want to change the password"
                        : "Minimum 6 characters required for admin users"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/users")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
