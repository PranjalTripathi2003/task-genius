"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Edit, Trash2, Filter, Search, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  category: string
  createdAt: string
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const { toast } = useToast()

  const fetchTasks = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true)
    }
    try {
      const response = await fetch("/api/tasks")
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchTasks(true)
    const handleTasksUpdated = () => fetchTasks(false)
    window.addEventListener("tasksUpdated", handleTasksUpdated)
    return () => window.removeEventListener("tasksUpdated", handleTasksUpdated)
  }, [])

  useEffect(() => {
    let filtered = tasks
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => (filterStatus === "completed" ? task.completed : !task.completed))
    }
    setFilteredTasks(filtered)
  }, [tasks, searchTerm, filterStatus])

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const { category } = task
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  const dispatchTasksUpdate = () => {
    window.dispatchEvent(new CustomEvent("tasksUpdated"))
  }

  const handleOpenChange = (category: string, isOpen: boolean) => {
    setOpenCategories((prev) =>
      isOpen ? [...prev, category] : prev.filter((c) => c !== category),
    )
  }

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      })
      if (response.ok) {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed } : task)))
        toast({
          title: completed ? "Task Completed!" : "Task Reopened",
        })
        dispatchTasksUpdate()
      }
    } catch (error) {
      toast({ title: "Update Failed", variant: "destructive" })
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId))
        toast({ title: "Task Deleted" })
        dispatchTasksUpdate()
      }
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" })
    }
  }

  const updateTask = async () => {
    if (!editingTask) return
    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
      if (response.ok) {
        setTasks(
          tasks.map((task) => (task.id === editingTask.id ? { ...task, title: editTitle, description: editDescription } : task)),
        )
        setEditingTask(null)
        toast({ title: "Task Updated" })
        dispatchTasksUpdate()
      }
    } catch (error) {
      toast({ title: "Update Failed", variant: "destructive" })
    }
  }

  const startEditing = (task: Task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">Loading tasks...</CardContent>
      </Card>
    )
  }

  return (
    <Dialog>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Tasks</span>
            <Badge variant="secondary">{tasks.filter((t) => t.completed).length}/{tasks.length} completed</Badge>
          </CardTitle>
          <CardDescription>Manage and track your AI-generated tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            {Object.keys(groupedTasks).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {tasks.length === 0 ? "No tasks yet. Generate some tasks to get started!" : "No tasks match your current filters."}
              </div>
            ) : (
              Object.entries(groupedTasks).map(([category, tasksInCategory]) => (
                <Collapsible
                  key={category}
                  className="space-y-2"
                  open={openCategories.includes(category)}
                  onOpenChange={(isOpen) => handleOpenChange(category, isOpen)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 group">
                      <div className="flex items-center space-x-2">
                        <ChevronRight className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">{category}</h3>
                      </div>
                      <Badge variant="outline">{tasksInCategory.length} tasks</Badge>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pl-6">
                    {tasksInCategory.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 border rounded-lg transition-all ${
                          task.completed ? "bg-green-50 border-green-200" : "bg-white"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(checked) => toggleTaskCompletion(task.id, !!checked)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                              {task.title}
                            </p>
                            <p className={`text-sm ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                              {task.description}
                            </p>
                            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                              <Badge variant="outline" className="capitalize">{task.category}</Badge>
                              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => startEditing(task)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Make changes to your task here.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
        </div>
        <DialogFooter>
          <Button onClick={updateTask}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
