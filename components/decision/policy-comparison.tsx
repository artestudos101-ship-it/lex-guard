import { Check, TriangleAlert, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ConflictStatus, PolicyConflict } from "@/types"

const STATUS_MAP: Record<
  ConflictStatus,
  { icon: typeof Check; label: string; row: string; chip: string }
 = {
  ok: {
    icon: Check,
    label: "Conforme",
    row: "",
    chip: "bg-success-soft text-success border-success/25",
  },
  warning: {
    icon: TriangleAlert,
    label: "Atenção",
    row: "bg-warning-soft/40",
    chip: "bg-warning-soft text-warning-foreground border-warning/40",
  },
  violation: {
    icon: X,
    label: "Violação",
    row: "bg-critical-soft/40",
    chip: "bg-critical-soft text-critical border-critical/25",
  },
}

export function PolicyComparison({
  rows,
  policyName,
}: {
  rows: PolicyConflict[]
  policyName: string
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Critério</th>
            <th className="px-4 py-2.5 font-medium">Política · {policyName}</th>
            <th className="px-4 py-2.5 font-medium">Edital</th>
            <th className="px-4 py-2.5 text-right font-medium">Situação</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const meta = STATUS_MAP[row.status]
            const Icon = meta.icon
            return (
              <tr key={row.criterion} className={cn("border-b last:border-b-0", meta.row)}>
                <td className="px-4 py-3 font-medium text-foreground">{row.criterion}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.policyValue}</td>
                <td className="px-4 py-3 font-mono text-xs text-foreground">{row.editalValue}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "ml-auto flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                      meta.chip,
                    )}
                  >
                    <Icon className="size-3" aria-hidden />
                    {meta.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
