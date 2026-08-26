import { redirect } from "next/navigation"

export default async function AnalysisRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect("/analyses")
}
