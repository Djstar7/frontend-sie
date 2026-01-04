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

// Type pour les documents requis de la base de donnees
interface ListDocumentRequired {
  id: string
  name: string
  guide: string | null
  category: string
  is_required: boolean
  file_types: string[]
  max_size_mb: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// Type pour la creation/edition d'un document requis
interface ListDocumentRequiredForm {
  name: string
  guide?: string
  category: string
  is_required?: boolean
  file_types: string[]
  max_size_mb: number
  is_active?: boolean
}

// Type pour les documents groupes par categorie
type ListDocumentRequiredGrouped = Record<string, ListDocumentRequired[]>

export type { Document, DocumentItem, ListDocumentRequired, ListDocumentRequiredForm, ListDocumentRequiredGrouped }
