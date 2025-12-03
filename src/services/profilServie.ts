import { api } from '@/services/api'
import type { Profil } from '@/types/user'

const profilService = {
  async getProfils(): Promise<{ data: Profil[] }> {
    const response = await api.get<{ data: Profil[] }>('/profil')
    return response.data
  },

  async showProfil(id: string): Promise<{ data: Profil }> {
    const response = await api.get<{ data: Profil }>(`/profil/${id}`)
    return response.data
  },
  async showProfilUser(id: string): Promise<{ data: Profil }> {
    const response = await api.get<{ data: Profil }>(`/profil/user/${id}`)
    return response.data
  },

  async createProfil(data: Profil): Promise<{ message: string; data: Profil }> {
    const response = await api.post<{ message: string; data: Profil }>('/profil/store', data)
    return response.data
  },

  async editProfil(id: string, data: Profil): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/profil/update/${id}`, data)
    return response.data
  },

  async deleteProfil(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/profil/delete/${id}`)
    return response.data
  },
}

export default profilService
