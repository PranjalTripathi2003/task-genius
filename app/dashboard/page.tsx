import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { TaskGenerator } from "@/components/task-generator"
import { TaskList } from "@/components/task-list"
import { ProgressOverview } from "@/components/progress-overview"
import { UserButton } from "@clerk/nextjs"
import { Target } from "lucide-react"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">TaskGenius</h1>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Generate and manage your AI-powered tasks</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Task Generation */}
          <div className="lg:col-span-2 space-y-8">
            <TaskGenerator />
            <TaskList />
          </div>

          {/* Right Column - Progress Overview */}
          <div>
            <ProgressOverview />
          </div>
        </div>
      </main>
    </div>
  )
}
