"use client"

import { useState } from "react"
import type { Finding } from "@/types"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SeverityBadge,
  EvidenceQualityBadge,
  ConfirmationBadge,
} from "@/components/decision/decision-badges"
import { cn } from "@/lib/utils"
import {
  QuoteIcon,
  MapPinIcon,
  AlertTriangleIcon,
  TargetIcon,
  ChevronDownIcon,
  ScaleIcon,
} from "lucide-react"

const severityAccent: Record<Finding["severity"], string> = {
  critical: "border-l-[var(--sev-critical)]",
  medium: "border-l-[var(--sev-medium)]",
  low: "border-l-[var(--sev-low)]",
  info: "border-l-[var(--sev-info)]",
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-3.5" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div className="text-sm leading-relaxed text-foreground">{children}</div>
      </div>
    </div>
  )
}

export function FindingCard({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(finding.severity === "critical")

  return (
    <Card
      className={cn(
        "border-l-4 transition-colors",
        severityAccent[finding.severity],
      )}
    >
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h3 className="text-pretty text-base font-semibold leading-tight text-foreground">
              {finding.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={finding.severity} />
              <EvidenceQualityBadge quality={finding.quality} />
              <ConfirmationBadge confirmed={finding.confirmed} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Recolher detalhes" : "Expandir detalhes"}
          >
            Detalhes
            <ChevronDownIcon
              data-icon="inline-end"
              className={cn("transition-transform", open && "rotate-180")}
            />
          </Button>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{finding.what}</p>
      </CardHeader>

      {open ? (
        <CardContent className="flex flex-col gap-5">
          <Separator />

          <figure className="flex flex-col gap-2 rounded-md bg-muted/60 p-4">
            <figcaption className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <QuoteIcon className="size-3.5" />
              Trecho do edital
            </figcaption>
            <blockquote className="border-l-2 border-border pl-3 font-serif text-sm italic leading-relaxed text-foreground">
              {finding.quote}
            </blockquote>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPinIcon className="size-3" />
              Página {finding.where.page} · {finding.where.clause}
            </span>
          </figure>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field icon={AlertTriangleIcon} label="Por quê">
              {finding.why}
            </Field>
            <Field icon={ScaleIcon} label="Impacto">
              {finding.impact}
            </Field>
          </div>

          <Field icon={TargetIcon} label="Ação recomendada">
            {finding.recommendedAction}
          </Field>

          {finding.policyConflict ? (
            <div className="flex flex-col gap-2 rounded-md border border-border p-4">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Conflito com política
              </span>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Critério</span>
                  <span className="text-foreground">{finding.policyConflict.criterion}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Sua política</span>
                  <span className="text-foreground">{finding.policyConflict.policyValue}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Edital</span>
                  <span className="text-foreground">{finding.policyConflict.editalValue}</span>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  )
}
