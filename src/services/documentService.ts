import type { Document } from '@/types/document'
import { api, uploadFile, uploadEditFile } from './api.ts'

export const documentService = {
  async getDocuments(): Promise<{ data: Document[] }> {
    const response = await api.get<{ data: Document[] }>('/document')
    return response.data
  },

  async createDocument(documentData: FormData): Promise<{ message: string; data: Document }> {
    const response = await uploadFile('/document/store', documentData)
    return response.data
  },

  async showDocument(id: string): Promise<{ data: Document }> {
    const response = await api.get<{ data: Document }>(`/document/show/${id}`)
    return response.data
  },

  async showDocumentByCustom(id: string): Promise<{ data: Document[] }> {
    const response = await api.get<{ data: Document[] }>(`/document/showbyuser/${id}`)
    return response.data
  },

  async showDocumentByVisaRequest(id: string): Promise<{ data: Document[] }> {
    const response = await api.get<{ data: Document[] }>(`/document/showbyvisarequest/${id}`)
    return response.data
  },

  async editDocument(id: string, documentData: FormData): Promise<{ message: string }> {
    const response = await uploadEditFile(`/document/update/${id}`, documentData)
    return response.data
  },

  async editDocumentStatus(id: string, is_validated: boolean): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/document/updatestatus/${id}`, {
      is_validated,
    })
    return response.data
  },

  async deleteDocument(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/document/delete/${id}`)
    return response.data
  },
}
