import type { Backup } from '../types/backup.ts'
import { api } from './api.ts'

export const backupService = {
  async getBackups(): Promise<{ data: Backup[] }> {
    const response = await api.get<{ data: Backup[] }>('/backup')
    return response.data
  },

  async createBackup(backupData: Backup): Promise<{ message: string; data: Backup }> {
    const formData = new FormData()
    formData.append('visa_request_id', backupData.visa_request_id)
    formData.append('backup_file', backupData.backup_file)

    const response = await api.post<{ message: string; data: Backup }>('/backup/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async showBackup(id: string): Promise<{ data: Backup }> {
    const response = await api.get<{ data: Backup }>(`/backup/show/${id}`)
    return response.data
  },

  async deleteBackup(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/backup/delete/${id}`)
    return response.data
  },
}
