export type DocumentStatus = "waiting" | "validating" | "ready" | "error"

export interface DocumentPage {
  page: number
  title?: string
  paragraphs: string[]
}

export interface EditalDocument {
  id: string
  name: string
  sizeBytes: number
  pages: number | null
  status: DocumentStatus
  errorReason?: string
  orgao?: string
  /** Structured page content used by the document viewer (mock substitute for PDF.js). */
  content?: DocumentPage[]
}
