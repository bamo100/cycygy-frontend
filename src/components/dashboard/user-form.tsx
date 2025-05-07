"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload } from "lucide-react"
import { useMutation, gql } from "@apollo/client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      firstName
      lastName
      email
      role
      avatar
      status
    }
  }
`

const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      role
      avatar
      status
    }
  }
`

const formSchema = z.object({
  firstName: z.string().min(2, { message: "FirstName must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "LastName must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().min(1, { message: "Please select a role" }),
  status: z.string().min(1, { message: "Please select a status" }),
})

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status?: string
  avatar?: string | null
}

interface UserFormProps {
  getUser?: User | null
}

export function UserForm({ getUser }: UserFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(getUser?.avatar || null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: getUser?.firstName || "",
      lastName: getUser?.lastName || "",
      email: getUser?.email || "",
      role: getUser?.role || "",
      status: getUser?.status || "",
    },
  })

  // Reset form when getUser changes
  useEffect(() => {
    if (getUser) {
      // console.log("getUser in effect:", getUser || "NO data");
      form.reset({
        firstName: getUser.firstName || "",
        lastName: getUser.lastName || "",
        email: getUser.email || "",
        role: getUser.role || "",
        status: getUser.status || "",
      });
    }
  }, [getUser, form]);

  const [createaUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      toast({
        title: "User created",
        description: "The user has been created successfully",
      })
      router.push("/dashboard/users")
    },
    onError: (error) => {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
    },
  })

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      toast({
        title: "User updated",
        description: "The user has been updated successfully",
      })
      router.push("/dashboard/users")
    },
    onError: (error) => {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
    },
  })

  useEffect(() => {
    console.log("Form errors", form.formState.errors);
  }, [form.formState.errors]);
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const input = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        status: values.status,
        avatar: avatar,
      }

      if (getUser) {
        // Update existing user
        await updateUser({
          variables: {
            id: getUser.id,
            input,
          },
        })
      } else {
        // Create new user
        await createaUser({
          variables: { input },
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //a demo for fileUpload
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL
      URL.createObjectURL(file)
      setAvatar(getUser?.avatar ?? null)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border bg-muted">
                  {avatar ? (
                    <Image width={100} height={100} src={avatar || "/placeholder.svg"} alt="Avatar" className="h-full! w-full! object-cover" />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormDescription>The user role determines their permissions</FormDescription>
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

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/users")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getUser ? "Updating..." : "Creating..."}
                  </>
                ) : getUser ? (
                  "Update User"
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
