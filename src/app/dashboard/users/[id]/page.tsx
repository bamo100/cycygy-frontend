"use client"

import { useEffect } from "react"
import { useQuery, gql } from "@apollo/client"
import { PageHeader } from "@/components/dashboard/page-header"
import { useToast } from "@/hooks/use-toast"
import { use } from 'react';
import { UpdateUserForm } from "@/components/dashboard/update-use-form"

const GET_USER = gql`
  query getUser($id: String!) {
    getUser (id: $id) {
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
interface Params {
  id: string;
}

export default function EditUserPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const { toast } = useToast()
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching user",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [error, toast, data])

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading user data...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit User" description="Update user information" />
      <UpdateUserForm user={data.getUser} />
    </div>
  )
}
