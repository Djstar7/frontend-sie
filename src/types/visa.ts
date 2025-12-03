import type { Profil, StatusMat, UserRegister } from './user'

type StatusVisa = 'pending' | 'processing' | 'approved' | 'rejected' | 'created'

interface VisaRequestPayload {
  user_id: string
  country_dest_name: string
  visa_type_name: string
  nationality: string
  status?: string
}
interface VisaType {
  id?: string
  name: string
  description?: string
}
interface Visa {
  id?: string
  user_id: string
  country_dest_name: string
  visa_type_name: string
}
interface VisaFetch {
  user_id?: string
  country_name: string
  visa_type_name: string
  price_base: number | null
  price_per_child: number | null
  processing_duration_min: number | null
  processing_duration_max: number | null
  status_mat: StatusMat
  max_age: number
  min_age: number
  documents: string[]
}

interface VisaRequest {
  id: string
  user: UserRegister
  profil: Profil
  visa_type_name?: string | null
  visa_type_id?: string | null
  visa_type_desc?: string | null
  country_origin_name?: string | null
  country_dest_name?: string | null
  status: StatusVisa
  created_at?: string | null
  updated_at?: string | null
}

interface VisaResourceType {
  id: string
  user_id: string
  country: string | null
  nationality: string | null
  visa_type: string | null
  status_mat: StatusMat
  price_base: number
  price_per_child?: number
  processing_duration_min: number
  processing_duration_max: number
  documents: string[]
}

export type {
  VisaRequest,
  VisaType,
  Visa,
  VisaFetch,
  VisaResourceType,
  VisaRequestPayload,
  StatusVisa,
}
