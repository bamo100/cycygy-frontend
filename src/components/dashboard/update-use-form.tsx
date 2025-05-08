"use client"

import { useEffect, useState } from "react"
import { useMutation, gql } from "@apollo/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { UserFormBase, type UserFormValues, type User } from "./use-form-base"

// Define the update user mutation response type
interface UpdateUserResponse {
  updateUser: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    status: string
    avatar?: string | null
  }
}

// Define the update user input type
interface UpdateUserInput {
  id: string
  input: {
    firstName: string
    lastName: string
    email: string
    role: string
    status?: string
    avatar?: string | null
    password?: string
  }
}

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      role
      status
      avatar
    }
  }
`

interface UpdateUserFormProps {
  user: User
}

export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isReady, setIsReady] = useState(false)
  const [defaultValues, setDefaultValues] = useState<UserFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "",
    password: "",
  })

  useEffect(() => {
    if (user) {
      setDefaultValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "",
        status: user.status || "",
        password: "",
      })
      setIsReady(true)
    }
  }, [user])

  const [updateUser] = useMutation<UpdateUserResponse, UpdateUserInput>(UPDATE_USER, {
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
    },
  })

  const handleSubmit = async (values: UserFormValues) => {
    // Only validate password for admin users if it's provided
    if (values.role === "admin" && values.password && values.password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters for admin users",
        variant: "destructive",
      })
      return
    }

    const input = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      role: values.role,
      status: values.status,
      avatar: user.avatar,
      ...(values.password && { password: values.password }),
    }

    await updateUser({
      variables: {
        id: user.id,
        input,
      },
    })
  }

  if (!isReady) {
    return <div>Loading user data...</div>
  }

  return (
    <UserFormBase
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitButtonText="Update User"
      loadingText="Updating..."
      initialAvatar={user.avatar || null}
      isEditMode={true}
    />
  )
}
