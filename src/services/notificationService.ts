import type { Notification } from '@/types/notification'
import { api } from './api'

export const notificationService = {
  async getNotifications(): Promise<{ data: Notification[] }> {
    const response = await api.get('/notification')
    return response.data
  },

  async showNotification(id: string): Promise<{ data: Notification }> {
    const response = await api.get(`/notification/show/${id}`)
    return response.data
  },

  async showNotificationByUser(id: string): Promise<{ data: Notification[] }> {
    const response = await api.get(`/notification/user/${id}`)
    return response.data
  },

  async markRead(id: string): Promise<{ message: string }> {
    const response = await api.put(`/notification/read/${id}`)
    return response.data
  },
  async markAllRead(): Promise<{ message: string }> {
    const response = await api.put(`/notification/read`)
    return response.data
  },
  async numberUnRead(): Promise<{ message: string; data: number }> {
    const response = await api.put(`/notification/numunread`)
    return response.data
  },
  async markUnread(id: string): Promise<{ message: string }> {
    const response = await api.put(`/notification/unread/${id}`)
    return response.data
  },

  async deleteNotification(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/notification/delete/${id}`)
    return response.data
  },
}
