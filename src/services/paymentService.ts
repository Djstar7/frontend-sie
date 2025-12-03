import type { Payment, PaymentSend, StatusPayment } from '@/types/payment'
import { api } from './api.ts'

export const paymentService = {
  async getPayments(): Promise<{ data: Payment[] }> {
    const response = await api.get<{ data: Payment[] }>('/payment')
    return response.data
  },

  async createPayment(paymentData: PaymentSend): Promise<{ message: string; data: Payment }> {
    const response = await api.post<{ message: string; data: Payment }>(
      '/payment/store',
      paymentData,
    )
    return response.data
  },

  async showPayment(id: string): Promise<{ data: Payment }> {
    const response = await api.get<{ data: Payment }>(`/payment/show/${id}`)
    return response.data
  },

  async showPaymentByUser(id: string): Promise<{ data: Payment[] }> {
    const response = await api.get<{ data: Payment[] }>(`/payment/user/${id}`)
    return response.data
  },

  async showPaymentByVisaRequest(id: string): Promise<{ data: Payment[] }> {
    const response = await api.get<{ data: Payment[] }>(`/payment/showbyvisarequest/${id}`)
    return response.data
  },

  async editPayment(id: string, status: StatusPayment): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/payment/update/${id}`, { status })
    return response.data
  },

  async editPaymentByUser(id: string, paymentData: PaymentSend): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/payment/updatebyuser/${id}`, paymentData)
    return response.data
  },

  async deletePayment(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/payment/delete/${id}`)
    return response.data
  },
}
