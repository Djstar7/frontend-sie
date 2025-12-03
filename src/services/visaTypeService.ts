import type { VisaType } from '@/types/visa'
import { api } from './api.ts'

export const visaTypeService = {
  async getVisaTypes(): Promise<{ data: VisaType[] }> {
    const response = await api.get<{ data: VisaType[] }>('/visatype')
    return response.data
  },

  async createVisaType(visaTypeData: VisaType): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/visatype/store', visaTypeData)
    return response.data
  },

  async showVisaType(id: string): Promise<{ data: VisaType }> {
    const response = await api.get<{ data: VisaType }>(`/visatype/show/${id}`)
    return response.data
  },

  async editVisaType(id: string, visaTypeData: VisaType): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/visatype/update/${id}`, visaTypeData)
    return response.data
  },

  async deleteVisaType(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/visatype/delete/${id}`)
    return response.data
  },
}
