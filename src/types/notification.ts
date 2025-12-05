type StatusNotification = 'sent' | 'delivered' | 'failed'

interface Notification {
  id?: string
  status: string | null
  type: string // Type of notification (e.g., 'appoitment', 'connexion', 'register', etc.)
  message: string
  link: string
  author: string
  created_at?: string
  updated_at?: string
}

export type { Notification, StatusNotification }
