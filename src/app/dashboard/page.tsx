import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/overview"
import { PageHeader } from "@/components/dashboard/page-header"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard overview",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your application" />
      <DashboardOverview />
    </div>
  )
}
