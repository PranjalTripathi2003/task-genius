import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tasks } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get overall stats
    const overallStats = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`sum(case when ${tasks.completed} then 1 else 0 end)`,
      })
      .from(tasks)
      .where(eq(tasks.userId, userId))

    // Get category stats
    const categoryStats = await db
      .select({
        category: tasks.category,
        total: sql<number>`count(*)`,
        completed: sql<number>`sum(case when ${tasks.completed} then 1 else 0 end)`,
      })
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .groupBy(tasks.category)

    const stats = overallStats[0] || { total: 0, completed: 0 }
    const categories: { [key: string]: { total: number; completed: number } } = {}

    categoryStats.forEach((cat) => {
      categories[cat.category] = {
        total: cat.total,
        completed: cat.completed,
      }
    })

    return NextResponse.json({
      total: stats.total,
      completed: stats.completed,
      pending: stats.total - stats.completed,
      categories,
    })
  } catch (error) {
    console.error("Error fetching task stats:", error)
    return NextResponse.json({ error: "Failed to fetch task statistics" }, { status: 500 })
  }
}
