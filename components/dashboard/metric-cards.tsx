"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardMetrics } from "@/hooks/use-dashboard"

export function MetricCards() {
  const { data, isLoading } = useDashboardMetrics()

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((metric) => (
        <Card key={metric.key}>
          <CardHeader className="gap-1.5 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </CardTitle>
            <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
              {metric.value}
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{metric.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
