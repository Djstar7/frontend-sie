import { api } from './api'
import type {
  ListDocumentRequired,
  ListDocumentRequiredForm,
  ListDocumentRequiredGrouped,
} from '@/types/document'

export const listDocumentRequiredService = {
  // Recuperer tous les documents requis
  async getAll(activeOnly = false): Promise<{ data: ListDocumentRequired[] }> {
    const params = activeOnly ? { active_only: true } : {}
    const response = await api.get<{ data: ListDocumentRequired[] }>('/list-document-required', {
      params,
    })
    return response.data
  },

  // Recuperer les documents groupes par categorie
  async getGrouped(activeOnly = true): Promise<{ data: ListDocumentRequiredGrouped }> {
    const params = activeOnly ? { active_only: true } : {}
    const response = await api.get<{ data: ListDocumentRequiredGrouped }>(
      '/list-document-required/grouped',
      { params },
    )
    return response.data
  },

  // Recuperer les categories disponibles
  async getCategories(): Promise<{ data: string[] }> {
    const response = await api.get<{ data: string[] }>('/list-document-required/categories')
    return response.data
  },

  // Recuperer un document par ID
  async getById(id: string): Promise<{ data: ListDocumentRequired }> {
    const response = await api.get<{ data: ListDocumentRequired }>(
      `/list-document-required/show/${id}`,
    )
    return response.data
  },

  // Creer un nouveau document requis
  async create(
    data: ListDocumentRequiredForm,
  ): Promise<{ message: string; data: ListDocumentRequired }> {
    const response = await api.post<{ message: string; data: ListDocumentRequired }>(
      '/list-document-required/store',
      data,
    )
    return response.data
  },

  // Mettre a jour un document requis
  async update(
    id: string,
    data: Partial<ListDocumentRequiredForm>,
  ): Promise<{ message: string; data: ListDocumentRequired }> {
    const response = await api.put<{ message: string; data: ListDocumentRequired }>(
      `/list-document-required/update/${id}`,
      data,
    )
    return response.data
  },

  // Supprimer un document requis
  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/list-document-required/delete/${id}`)
    return response.data
  },

  // Basculer le statut actif/inactif
  async toggleActive(id: string): Promise<{ message: string; data: ListDocumentRequired }> {
    const response = await api.put<{ message: string; data: ListDocumentRequired }>(
      `/list-document-required/toggle-active/${id}`,
    )
    return response.data
  },
}
