import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    // Simple database connectivity check
    await db.execute(sql`SELECT 1`)
    return NextResponse.json({ status: "healthy", message: "Database connection successful" })
  } catch (error) {
    console.error("Database health check failed:", error)
    return NextResponse.json({ status: "unhealthy", message: "Database connection failed" }, { status: 500 })
  }
}
