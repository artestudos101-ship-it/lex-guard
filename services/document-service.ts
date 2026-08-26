import type { DocumentPage, EditalDocument } from "@/types"
import { backendAdapter } from "@/lib/backend-adapter"

export async function getDocument(id: string): Promise<EditalDocument | null> { return backendAdapter.getDocument(id) }
export async function getDocumentPages(id: string, from: number, to: number): Promise<{ pages: DocumentPage[]; total: number }> { return backendAdapter.getDocumentPages(id, from, to) }
export async function getPage(id: string, page: number): Promise<DocumentPage | null> { const result = await backendAdapter.getDocumentPages(id, page, page); return result.pages[0] ?? null }
