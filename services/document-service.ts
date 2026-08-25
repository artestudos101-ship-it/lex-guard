import type { DocumentPage, EditalDocument } from "@/types"
import { MOCK_DOCUMENTS } from "@/mock/documents"
import { delay } from "./util"

export async function getDocument(id: string): Promise<EditalDocument | null> {
  const rec = MOCK_DOCUMENTS[id]
  if (!rec) return delay(null, 200)
  const { content, ...meta } = rec
  return delay(meta, 250)
}

/** Returns only the requested page window — never the whole document at once. */
export async function getDocumentPages(
  id: string,
  from: number,
  to: number,
): Promise<{ pages: DocumentPage[]; total: number }> {
  const rec = MOCK_DOCUMENTS[id]
  if (!rec) return delay({ pages: [], total: 0 }, 200)
  const slice = rec.content.filter((p) => p.page >= from && p.page <= to)
  return delay({ pages: slice, total: rec.content.length }, 300)
}

export async function getPage(id: string, page: number): Promise<DocumentPage | null> {
  const rec = MOCK_DOCUMENTS[id]
  if (!rec) return delay(null, 150)
  return delay(rec.content.find((p) => p.page === page) ?? null, 200)
}
