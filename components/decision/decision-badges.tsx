import { ArrowUpRight, CircleAlert, MinusCircle, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EvidenceQuality, Recommendation, RiskSeverity } from "@/types"

const RECOMMENDATION_MAP: Record<
  Recommendation,
  { label: string; icon: typeof ArrowUpRight; className: string }
> = {
  ADVANCE: {
    label: "Avançar",
    icon: ArrowUpRight,
    className: "bg-success-soft text-success border-success/25",
  },
  REVIEW: {
    label: "Revisar",
    icon: TriangleAlert,
    className: "bg-warning-soft text-warning-foreground border-warning/40",
  },
  NOT_PRIORITY: {
    label: "Não prioritário",
    icon: MinusCircle,
    className: "bg-critical-soft text-critical border-critical/25",
  },
}

export function RecommendationBadge({
  recommendation,
  size = "default",
}: {
  recommendation: Recommendation
  size?: "default" | "lg"
}) {
  const { label, icon: Icon, className } = RECOMMENDATION_MAP[recommendation]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "lg" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs",
        className,
      )}
    >
      <Icon className={size === "lg" ? "size-4" : "size-3.5"} aria-hidden />
      {label}
    </span>
  )
}

const SEVERITY_MAP: Record<RiskSeverity, { label: string; icon: typeof ShieldAlert; className: string }> = {
  critical: { label: "Crítico", icon: ShieldAlert, className: "bg-critical-soft text-critical border-critical/25" },
  medium: { label: "Médio", icon: TriangleAlert, className: "bg-warning-soft text-warning-foreground border-warning/40" },
  low: { label: "Baixo", icon: CircleAlert, className: "bg-info-soft text-info border-info/25" },
  info: { label: "Informativo", icon: ShieldCheck, className: "bg-neutral-soft text-muted-foreground border-border" },
}

export function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  const { label, icon: Icon, className } = SEVERITY_MAP[severity]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {label}
    </span>
  )
}

const QUALITY_MAP: Record<EvidenceQuality, { label: string; description: string; className: string }> = {
  E1: { label: "E1", description: "Evidência confirmada", className: "bg-success-soft text-success border-success/25" },
  E2: { label: "E2", description: "Evidência parcial", className: "bg-warning-soft text-warning-foreground border-warning/40" },
  E3: { label: "E3", description: "Requer validação humana", className: "bg-critical-soft text-critical border-critical/25" },
}

export function EvidenceQualityBadge({ quality, showLabel = false }: { quality: EvidenceQuality; showLabel?: boolean }) {
  const { label, description, className } = QUALITY_MAP[quality]
  return (
    <span
      title={description}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-xs font-medium",
        className,
      )}
    >
      {label}
      {showLabel ? <span className="font-sans font-normal">· {description}</span> : null}
    </span>
  )
}

export function evidenceQualityDescription(quality: EvidenceQuality): string {
  return QUALITY_MAP[quality].description
}
