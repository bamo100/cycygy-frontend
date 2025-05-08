"use client"

import { useMutation, gql } from "@apollo/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { UserFormBase, type UserFormValues } from "./use-form-base"

// Define the create user mutation response type
interface CreateUserResponse {
  createUser: {
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

// Define the create user input type
interface CreateUserInput {
  input: {
    firstName: string
    lastName: string
    email: string
    role: string
    status?: string
    password?: string
  }
}

const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      firstName
      lastName
      email
      role
    }
  }
`

export function CreateUserForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [createUser] = useMutation<CreateUserResponse, CreateUserInput>(CREATE_USER, {
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
    },
  })

  const defaultValues: UserFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "",
    password: "",
  }

  const handleSubmit = async (values: UserFormValues) => {
    // Only validate password for admin users
    if (values.role === "admin" && (!values.password || values.password.length < 6)) {
      toast({
        title: "Password required",
        description: "Password is required and must be at least 6 characters for admin users",
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
      ...(values.password && { password: values.password }),
    }

    await createUser({
      variables: { input },
    })
  }

  return (
    <UserFormBase
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitButtonText="Create User"
      loadingText="Creating..."
      isEditMode={false}
    />
  )
}
