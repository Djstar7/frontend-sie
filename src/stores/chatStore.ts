import { ChatService } from '@/services/chatService'
import type { Chat } from '@/types/chat'
import { useLoading } from '@/utils/startLoading'
export function useChatStore() {
  const loading = useLoading()

  const getChats = async () => {
    loading.startLoading('Chargement des messages en cours...')
    try {
      const response = await ChatService.getChats()
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const createChat = async (ChatData: Chat) => {
    loading.startLoading('Création du message en cours...')
    try {
      const response = await ChatService.createChat(ChatData)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création')
    } finally {
      loading.stopLoading()
    }
  }

  const showChat = async (id: string) => {
    loading.startLoading('Chargement du message en cours...')
    try {
      return await ChatService.showChat(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const showChatByAgent = async (id: string) => {
    loading.startLoading("Chargement des messages pour l'agent en cours...")
    try {
      return await ChatService.showChatByAgent(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const showChatByCustom = async (id: string) => {
    loading.startLoading('Chargement des messages pour le client en cours...')
    try {
      return await ChatService.showChatByCustom(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const editChat = async (id: string, ChatData: Chat) => {
    loading.startLoading('Mise à jour du message en cours...')
    try {
      const response = await ChatService.editChat(id, ChatData)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteChat = async (id: string) => {
    loading.startLoading('Suppression du message en cours...')
    try {
      const response = await ChatService.deleteChat(id)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    getChats,
    createChat,
    showChat,
    showChatByAgent,
    showChatByCustom,
    editChat,
    deleteChat,
  }
}
