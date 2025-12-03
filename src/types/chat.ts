type StatusChat = 'received' | 'sent' | 'read' | 'archived' | 'failed' | 'sending'

interface Chat {
  id?: string
  user_id?: string
  visa_request_id?: string
  content: string
  status: StatusChat
  updated_at?: string
  created_at?: string
  user?: {
    id: string
    name: string | null
    email: string | null
  }
}
export type { Chat, StatusChat }
