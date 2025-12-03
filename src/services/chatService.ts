import type { Chat } from '@/types/chat'
import { api } from './api.ts'

export const ChatService = {
  async getChats(): Promise<{ data: Chat[] }> {
    const response = await api.get<{ data: Chat[] }>('/message')
    return response.data
  },

  async createChat(ChatData: Chat): Promise<{ message: string; data: Chat }> {
    const response = await api.post<{ message: string; data: Chat }>('/message/store', ChatData)
    return response.data
  },
  async showChat(id: string): Promise<{ data: Chat }> {
    const response = await api.get<{ data: Chat }>(`/message/show/${id}`)
    return response.data
  },
  async showChatByAgent(id: string): Promise<{ data: Chat[] }> {
    const response = await api.get<{ data: Chat[] }>(`/message/showbyagent/${id}`)
    return response.data
  },
  async showChatByCustom(id: string): Promise<{ data: Chat[] }> {
    const response = await api.get<{ data: Chat[] }>(`/message/showbycustom/${id}`)
    return response.data
  },
  async showChatByVisaRequest(
    id: string,
  ): Promise<{ agentMessages: Chat[]; customMessages: Chat[] }> {
    const response = await api.get<{ agentMessages: Chat[]; customMessages: Chat[] }>(
      `/message/showbyvisarequest/${id}`,
    )
    return response.data
  },
  async editChat(id: string, ChatData: Chat): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/message/update/${id}`, ChatData)
    return response.data
  },
  async deleteChat(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/message/delete/${id}`)
    return response.data
  },
}
