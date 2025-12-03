import type { Visa, VisaFetch } from '@/types/visa'
import { api } from './api.ts'

export const visaService = {
  async getVisas(): Promise<{ data: Visa[] }> {
    const response = await api.get<{ data: Visa[] }>('/visa')
    return response.data
  },

  async createVisa(visaData: VisaFetch): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/visa/store', visaData)
    return response.data
  },

  async createStoreVisa(
    visaData: Visa,
  ): Promise<{ message: string; data: string[]; orthers: string[] }> {
    const response = await api.post<{ message: string; data: string[]; orthers: string[] }>(
      '/visa/storestore',
      visaData,
    )
    return response.data
  },

  async showVisa(id: string): Promise<{ data: Visa }> {
    const response = await api.get<{ data: Visa }>(`/visa/show/${id}`)
    return response.data
  },

  async editVisa(id: string, visaData: Visa): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/visa/update/${id}`, visaData)
    return response.data
  },

  async deleteVisa(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/visa/delete/${id}`)
    return response.data
  },
}
