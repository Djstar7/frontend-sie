import type { FaqChat } from '@/types/faqchat'
import { api } from './api.ts'

export const faqChatService = {
  async getFaqChats(): Promise<{ data: FaqChat[] }> {
    const response = await api.get<{ data: FaqChat[] }>('/faqchat')
    return response.data
  },

  async createFaqChat(faqChatData: FaqChat): Promise<{ message: string; data: FaqChat }> {
    const response = await api.post<{ message: string; data: FaqChat }>(
      '/faqchat/store',
      faqChatData,
    )
    return response.data
  },

  async showFaqChat(id: string): Promise<{ data: FaqChat }> {
    const response = await api.get<{ data: FaqChat }>(`/faqchat/show/${id}`)
    return response.data
  },

  async editFaqChat(id: string, faqChatData: FaqChat): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/faqchat/update/${id}`, faqChatData)
    return response.data
  },

  async deleteFaqChat(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/faqchat/delete/${id}`)
    return response.data
  },
}
