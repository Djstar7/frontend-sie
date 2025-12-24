interface Document {
  id?: string
  visa_request_id: number
  name: string
  file_path: string
  is_validated?: boolean
  created_at?: string
  updated_at?: string
}
interface Validation {
  required: boolean
  fileTypes: string[]
  maxSizeMB: number
}
interface DocumentItem {
  name: string
  guide: string
  validation: Validation
}

export type { Document, DocumentItem }
