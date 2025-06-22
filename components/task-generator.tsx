"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Save, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GeneratedTask {
  id: string
  title: string
  description: string
}

export function TaskGenerator() {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const generateTasks = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate tasks.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate tasks")
      }

      const data = await response.json()
      setGeneratedTasks(data.tasks)

      toast({
        title: "Tasks Generated!",
        description: `Generated ${data.tasks.length} tasks for "${topic}"`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const saveTasks = async () => {
    if (generatedTasks.length === 0) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: generatedTasks.map((task) => ({
            title: task.title,
            description: task.description,
            category: topic,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save tasks")
      }

      toast({
        title: "Tasks Saved!",
        description: `Saved ${generatedTasks.length} tasks to your list.`,
      })

      setGeneratedTasks([])
      setTopic("")

      // Trigger a refresh of the task list
      window.dispatchEvent(new CustomEvent("tasksUpdated"))
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span>AI Task Generator</span>
        </CardTitle>
        <CardDescription>Enter a topic and let AI generate actionable tasks for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="e.g., Learn Python, Start a blog, Get fit..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && generateTasks()}
            disabled={isGenerating}
          />
          <Button
            onClick={generateTasks}
            disabled={isGenerating || !topic.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Generate
          </Button>
        </div>

        {generatedTasks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Tasks</h3>
              <Badge variant="secondary">{generatedTasks.length} tasks</Badge>
            </div>

            <div className="space-y-2">
              {generatedTasks.map((task, index) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={saveTasks} disabled={isSaving} className="w-full bg-green-600 hover:bg-green-700">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save All Tasks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
