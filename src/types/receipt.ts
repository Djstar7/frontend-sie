export interface Receipt {
  id: string
  file_path: string
  payment: {
    id: string
    amount: number
    transaction_id: string
    method: string
    currency: string
    status: string
  }
  visa_request: {
    visa_type_name: string | null
    country_origin_name: string | null
    country_dest_name: string | null
  }
  user: {
    name: string | null
    email: string | null
  }
  profil: {
    first_name: string | null
    last_name: string | null
    phone: string | null
  }
  created_at: string
  updated_at: string
}
