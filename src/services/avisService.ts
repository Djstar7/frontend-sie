import type { Avis } from '@/types/avis'
import { api } from './api.ts'

export const avisService = {
  async getAvis(): Promise<{ data: Avis[] }> {
    const response = await api.get<{ data: Avis[] }>('/avis')
    return response.data
  },
  async createAvis(userData: Avis): Promise<{ message: string; data: Avis }> {
    const response = await api.post<{ message: string; data: Avis }>('/avis/store', userData)
    return response.data
  },
  async editAvis(id: string, userData: Avis): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/avis/update/${id}`, userData)
    return response.data
  },
  async deleteAvis(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/avis/delete/${id}`)
    return response.data
  },
}
