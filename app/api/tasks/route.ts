import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tasks } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(tasks.createdAt)

    return NextResponse.json({ tasks: userTasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tasks: taskList } = body

    if (!Array.isArray(taskList) || taskList.length === 0) {
      return NextResponse.json({ error: "Tasks array is required" }, { status: 400 })
    }

    const newTasks = await db
      .insert(tasks)
      .values(
        taskList.map((task) => ({
          userId,
          title: task.title,
          description: task.description || "",
          category: task.category || "General",
          completed: false,
        })),
      )
      .returning()

    return NextResponse.json({ tasks: newTasks })
  } catch (error) {
    console.error("Error creating tasks:", error)
    return NextResponse.json({ error: "Failed to create tasks" }, { status: 500 })
  }
}
