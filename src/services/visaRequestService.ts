import type { VisaRequestPayload, VisaRequest } from '@/types/visa'
import { api } from './api.ts'

export const visaRequestService = {
  async getVisaRequests(): Promise<{ data: VisaRequest[] }> {
    const response = await api.get<{ data: VisaRequest[] }>('/visarequest')
    return response.data
  },

  async createVisaRequest(
    visaRequestData: VisaRequestPayload,
  ): Promise<{ message: string; data: VisaRequest }> {
    const response = await api.post<{ message: string; data: VisaRequest }>(
      '/visarequest/store',
      visaRequestData,
    )
    return response.data
  },

  async showVisaRequest(id: string): Promise<{ data: VisaRequest }> {
    const response = await api.get<{ data: VisaRequest }>(`/visarequest/show/${id}`)
    return response.data
  },

  async showIdVisaRequest(id: string): Promise<{ data: VisaRequest }> {
    const response = await api.get<{ data: VisaRequest }>(`/visarequest/showid/${id}`)
    return response.data
  },

  async showVisaRequestByUser(id: string): Promise<{ data: VisaRequest[] }> {
    const response = await api.get<{ data: VisaRequest[] }>(`/visarequest/showbyuser/${id}`)
    return response.data
  },

  async editVisaRequest(
    id: string,
    visaRequestData: { status: string },
  ): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(
      `/visarequest/update/${id}`,
      visaRequestData,
    )
    return response.data
  },

  async deleteVisaRequest(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/visarequest/delete/${id}`)
    return response.data
  },
}
