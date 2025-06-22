import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { topic } = await request.json()

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const prompt = `Generate a list of 5 concise, actionable tasks to learn about "${topic}".
    Return the response as a JSON array where each task has a "title" and "description" field.
    The title should be a brief action item (max 60 characters).
    The description should provide more context (max 150 characters).

    Example format:
    [
      {
        "title": "Set up development environment",
        "description": "Install Python, VS Code, and create your first Hello World program"
      }
    ]

    Only return the JSON array, no additional text or formatting.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      // Clean the response to extract JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
      const tasks = JSON.parse(cleanedText)

      // Validate the response structure
      if (!Array.isArray(tasks) || tasks.length === 0) {
        throw new Error("Invalid response format")
      }

      // Add unique IDs to tasks
      const tasksWithIds = tasks.map((task, index) => ({
        id: `generated-${Date.now()}-${index}`,
        title: task.title || `Task ${index + 1}`,
        description: task.description || "",
      }))

      return NextResponse.json({ tasks: tasksWithIds })
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)

      // Fallback: create generic tasks
      const fallbackTasks = [
        {
          id: `fallback-${Date.now()}-1`,
          title: `Research ${topic} fundamentals`,
          description: `Learn the basic concepts and principles of ${topic}`,
        },
        {
          id: `fallback-${Date.now()}-2`,
          title: `Find learning resources`,
          description: `Gather books, tutorials, and online courses about ${topic}`,
        },
        {
          id: `fallback-${Date.now()}-3`,
          title: `Create a study plan`,
          description: `Organize your learning schedule and set milestones for ${topic}`,
        },
        {
          id: `fallback-${Date.now()}-4`,
          title: `Practice with examples`,
          description: `Work through practical examples and exercises related to ${topic}`,
        },
        {
          id: `fallback-${Date.now()}-5`,
          title: `Join a community`,
          description: `Connect with others learning ${topic} for support and discussion`,
        },
      ]

      return NextResponse.json({ tasks: fallbackTasks })
    }
  } catch (error) {
    console.error("Error generating tasks:", error)
    return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 })
  }
}
