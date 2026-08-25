"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useEvaluationMetrics } from "@/hooks/use-dashboard"

const chartConfig = {
  precision: { label: "Precisão", color: "var(--chart-1)" },
} satisfies ChartConfig

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" | "critical" }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={
          tone === "success"
            ? "font-mono text-lg font-semibold tabular-nums text-success"
            : tone === "critical"
              ? "font-mono text-lg font-semibold tabular-nums text-critical"
              : "font-mono text-lg font-semibold tabular-nums text-foreground"
        }
      >
        {value}
      </span>
    </div>
  )
}

export function EvaluationPanel() {
  const { data, isLoading } = useEvaluationMetrics()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Qualidade das avaliações</CardTitle>
        <CardDescription>
          Precisão dos riscos medida contra validações humanas — o feedback fecha o ciclo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {isLoading || !data ? (
          <Skeleton className="h-[180px] w-full" />
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <AreaChart data={data.precisionSeries} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis domain={[70, 100]} tickLine={false} axisLine={false} tickMargin={8} width={36} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="precision"
                  type="monotone"
                  stroke="var(--color-precision)"
                  fill="var(--color-precision)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-4">
              <Stat label="Confirmadas" value={`${data.confirmedFindingsPct}%`} tone="success" />
              <Stat label="Rejeitadas" value={`${data.rejectedFindingsPct}%`} tone="critical" />
              <Stat label="Pendentes" value={`${data.pendingReviewPct}%`} />
              <Stat label="Falsos positivos" value={String(data.falsePositives)} />
              <Stat label="Falsos negativos" value={String(data.falseNegatives)} />
              <Stat label="Decisões revertidas" value={String(data.decisionsChanged)} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
