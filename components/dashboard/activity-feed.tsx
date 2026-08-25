"use client"

import { CheckCircle2, FileText, ShieldCheck, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useActivity } from "@/hooks/use-dashboard"
import { formatRelative } from "@/lib/format"
import type { ActivityItem } from "@/types"

const ICON_MAP: Record<ActivityItem["kind"], typeof CheckCircle2> = {
  analysis_completed: CheckCircle2,
  evidence_validated: ShieldCheck,
  report_generated: FileText,
  review_requested: Eye,
}

export function ActivityFeed() {
  const { data, isLoading } = useActivity()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Atividade recente</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 py-2">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full max-w-xs" />
                </div>
              </div>
            ))
          : data.map((item) => {
              const Icon = ICON_MAP[item.kind]
              return (
                <div key={item.id} className="flex gap-3 border-b py-3 last:border-b-0">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelative(item.at)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              )
            })}
      </CardContent>
    </Card>
  )
}
