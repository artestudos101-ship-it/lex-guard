import { cn } from "@/lib/utils"
import type { RiskScore } from "@/types"

const BAND_LABEL: Record<RiskScore["band"], string> = {
  low: "Risco baixo",
  medium: "Risco médio",
  high: "Risco alto",
}

const BAND_COLOR: Record<RiskScore["band"], string> = {
  low: "text-success",
  medium: "text-warning-foreground",
  high: "text-critical",
}

const BAND_STROKE: Record<RiskScore["band"], string> = {
  low: "stroke-success",
  medium: "stroke-warning",
  high: "stroke-critical",
}

export function RiskGauge({ score, size = 180 }: { score: RiskScore; size?: number }) {
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = Math.PI * radius // semicircle
  const clamped = Math.max(0, Math.min(100, score.value))
  const offset = circumference * (1 - clamped / 100)
  const height = size / 2 + stroke

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height }}>
        <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`} role="img" aria-label={`Score de risco ${clamped} de 100`}>
          <path
            d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            className="stroke-muted"
          />
          <path
            d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-[stroke-dashoffset] duration-700 ease-out", BAND_STROKE[score.band])}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className={cn("font-mono text-4xl font-semibold tabular-nums leading-none", BAND_COLOR[score.band])}>
            {clamped}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">de 100</span>
        </div>
      </div>
      <span className={cn("mt-1 text-sm font-medium", BAND_COLOR[score.band])}>{BAND_LABEL[score.band]}</span>
    </div>
  )
}
