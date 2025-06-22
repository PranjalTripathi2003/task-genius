"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, CheckCircle, Clock } from "lucide-react"

interface TaskStats {
  total: number
  completed: number
  pending: number
  categories: { [key: string]: { total: number; completed: number } }
}

export function ProgressOverview() {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    categories: {},
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/tasks/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    // Listen for task updates
    const handleTasksUpdated = () => {
      fetchStats()
    }

    window.addEventListener("tasksUpdated", handleTasksUpdated)
    return () => window.removeEventListener("tasksUpdated", handleTasksUpdated)
  }, [])

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Progress Overview</span>
          </CardTitle>
          <CardDescription>Your task completion statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
              </div>
              <p className="text-xs text-green-700">Completed</p>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-2xl font-bold text-orange-600">{stats.pending}</span>
              </div>
              <p className="text-xs text-orange-700">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {Object.keys(stats.categories).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Categories</span>
            </CardTitle>
            <CardDescription>Progress by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.categories).map(([category, data]) => {
              const categoryProgress = data.total > 0 ? (data.completed / data.total) * 100 : 0

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <Progress value={categoryProgress} className="h-1" />
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Tasks</span>
            <Badge variant="secondary">{stats.total}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Categories</span>
            <Badge variant="secondary">{Object.keys(stats.categories).length}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <Badge
              variant={completionRate >= 70 ? "default" : completionRate >= 40 ? "secondary" : "outline"}
              className={
                completionRate >= 70
                  ? "bg-green-600 text-white"
                  : completionRate >= 40
                    ? "bg-yellow-600 text-white"
                    : "bg-red-600 text-white"
              }
            >
              {Math.round(completionRate)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
