import { api } from './api'
import type { UserRegister, UserLogin, UserData, FirebaseLoginData } from '@/types/user'

export const userService = {
  // =============================================
  // Verification email par OTP
  // =============================================

  async sendEmailCode(email: string) {
    const response = await api.post<{ message: string }>('/auth/email/send-code', { email })
    return response.data
  },

  async resendEmailCode(email: string) {
    const response = await api.post<{ message: string }>('/auth/email/resend-code', { email })
    return response.data
  },

  async verifyEmailCode(email: string, code: string) {
    const response = await api.post<{ message: string; verified: boolean }>(
      '/auth/email/verify-code',
      { email, code }
    )
    return response.data
  },

  async checkEmailVerified(email: string) {
    const response = await api.post<{ verified: boolean }>('/auth/email/check-verified', { email })
    return response.data
  },

  // =============================================
  // Authentification
  // =============================================

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

  async loginWithFirebase(data: FirebaseLoginData) {
    const response = await api.post<{ message: string; user: UserRegister; access_token: string }>(
      '/auth/firebase',
      data,
    )
    return response.data
  },

  async logout() {
    const response = await api.post<{ message: string }>('/auth/logout')
    return response.data
  },

  async checkEmailExists(email: string) {
    const response = await api.post<{ exists: boolean; message: string }>('/auth/check-email', { email })
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

  async getMe() {
    const response = await api.get<{ user: UserRegister }>('/auth/me')
    return response.data
  },

  // =============================================
  // Reinitialisation mot de passe
  // =============================================

  async sendPasswordResetLink(email: string) {
    const response = await api.post<{ message: string }>('/auth/password/send-link', { email })
    return response.data
  },

  async verifyPasswordResetToken(email: string, token: string) {
    const response = await api.post<{ valid: boolean; email: string; message: string }>(
      '/auth/password/verify-token',
      { email, token }
    )
    return response.data
  },

  async resetPassword(email: string, token: string, password: string) {
    const response = await api.post<{ message: string }>('/auth/password/reset', {
      email,
      token,
      password,
    })
    return response.data
  },

  // =============================================
  // Suppression de compte (RGPD)
  // =============================================

  async requestAccountDeletion(email: string, reason?: string) {
    const response = await api.post<{ message: string }>('/auth/delete-account', {
      email,
      reason,
    })
    return response.data
  },
}
