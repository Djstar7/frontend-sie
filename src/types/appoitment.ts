type StatusAppt = 'pending' | 'completed' | 'rescheduled' | 'canceled'
interface Appoitment {
  id?: string
  user_id?: string
  visa_request_id: string
  scheduled_at: string
  status: StatusAppt
}

export type { Appoitment, StatusAppt }
