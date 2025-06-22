import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function GET() {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ status: "unhealthy", message: "Google AI API key not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    // Simple test to verify API key works
    const result = await model.generateContent("Hello")
    const response = await result.response

    if (response.text()) {
      return NextResponse.json({ status: "healthy", message: "Google AI API connection successful" })
    } else {
      throw new Error("No response from Google AI")
    }
  } catch (error) {
    console.error("Google AI health check failed:", error)
    return NextResponse.json({ status: "unhealthy", message: "Google AI API connection failed" }, { status: 500 })
  }
}
