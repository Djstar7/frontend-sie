import { api } from './api'
import type { UserRegister, UserLogin, UserData } from '@/types/user'

export const userService = {
  async register(data: UserRegister) {
    const response = await api.post<{ message: string; user: UserRegister; access_token: string }>(
      '/auth/register',
      data,
    )
    return response.data
  },

  async login(data: UserLogin) {
    const response = await api.post<{ message: string; user: UserRegister; access_token: string }>(
      '/auth/login',
      data,
    )
    return response.data
  },

  async logout() {
    const response = await api.post<{ message: string }>('/auth/logout')
    return response.data
  },

  // Les autres méthodes users restent inchangées
  async getUsers() {
    const response = await api.get<{ data: UserRegister[] }>('/user')
    return response.data
  },
  async getCustoms() {
    const response = await api.get<{ data: UserRegister[] }>('/usercustom')
    return response.data
  },

  async showUser(id: string) {
    const response = await api.get<{ data: UserRegister }>(`/user/show/${id}`)
    return response.data
  },
  async showUserByAgent(id: string) {
    const response = await api.get<{ data: UserData }>(`/user/showbyagent/${id}`)
    return response.data
  },

  async createUser(data: UserRegister) {
    const response = await api.post<{ message: string; data: UserRegister }>('/user/store', data)
    return response.data
  },

  async editUser(id: string, data: UserRegister) {
    const response = await api.put<{ message: string }>(`/user/update/${id}`, data)
    return response.data
  },

  async deleteUser(id: string) {
    const response = await api.delete<{ message: string }>(`/user/delete/${id}`)
    return response.data
  },
}
