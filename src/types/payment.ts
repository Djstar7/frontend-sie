type PaymentMethod = 'mtn' | 'orange' | 'visa' | 'paypal'
type Currency =
  | 'XAF'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'NGN'
  | 'AUD'
  | 'JPY'
  | 'CHF'
  | 'CNY'
  | 'GHS'
  | 'ZAR'
  | 'KES'
  | 'UGX'
  | 'TZS'
  | 'EGP'
  | 'SAR'
  | 'AED'
type StatusPayment = 'completed' | 'pending' | 'failed' | 'processing' | 'canceled' | 'expired'

interface Payment {
  id?: string
  visa_request_id: string
  amount: number | string
  transaction_id: string
  method: PaymentMethod
  currency: Currency
  status: StatusPayment
  userName: string
  userEmail: string
  created_at?: string
}

interface PaymentSend {
  amount: number
  email: string
  visa_request_id: string
  method: string
  currency: string
}

export type { Payment, PaymentMethod, Currency, StatusPayment, PaymentSend }
