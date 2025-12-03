import type { Appoitment } from '@/types/appoitment'
import { api } from './api'

export const AppoitmentService = {
  async getAppoitments(): Promise<{ data: Appoitment[] }> {
    const response = await api.get<{ data: Appoitment[] }>('/appoitment')
    return response.data
  },

  async createAppoitment(
    AppoitmentData: Appoitment,
  ): Promise<{ message: string; data: Appoitment }> {
    const response = await api.post<{ message: string; data: Appoitment }>(
      '/appoitment/store',
      AppoitmentData,
    )
    return response.data
  },
  async showAppoitment(id: string): Promise<{ data: Appoitment }> {
    const response = await api.get<{ data: Appoitment }>(`/appoitment/show/${id}`)
    return response.data
  },
  async showAppoitmentByAgent(id: string): Promise<{ data: Appoitment[] }> {
    const response = await api.get<{ data: Appoitment[] }>(`/appoitment/showbyagent/${id}`)
    return response.data
  },
  async showAppoitmentByCustom(id: string): Promise<{ data: Appoitment[] }> {
    const response = await api.get<{ data: Appoitment[] }>(`/appoitment/showbycustom/${id}`)
    return response.data
  },
  async showAppoitmentByVisaRequest(id: string): Promise<{ data: Appoitment[] }> {
    const response = await api.get<{ data: Appoitment[] }>(`/appoitment/showbyvisarequest/${id}`)
    return response.data
  },
  async showAppoitmentByUser(id: string): Promise<{ data: Appoitment[] }> {
    const response = await api.get<{ data: Appoitment[] }>(`/appoitment/user/${id}`)
    return response.data
  },
  async editAppoitment(id: string, AppoitmentData: Appoitment): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/appoitment/update/${id}`, AppoitmentData)
    return response.data
  },
  async editAppoitmentByUser(id: string, AppoitmentData: Appoitment): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(
      `/appoitment/updatebyuser/${id}`,
      AppoitmentData,
    )
    return response.data
  },
  async deleteAppoitment(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/appoitment/delete/${id}`)
    return response.data
  },
}
