import type { Metadata } from "next"
import { PageHeader } from "@/components/dashboard/page-header"
import { CreateUserForm } from "@/components/dashboard/create-user-form"

export const metadata: Metadata = {
  title: "Add User",
  description: "Add a new user to the system",
}

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add User" description="Create a new user account" />
      <CreateUserForm />  
    </div>
  )
}
