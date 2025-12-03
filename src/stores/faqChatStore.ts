import { faqChatService } from '@/services/faqChatService'
import type { FaqChat } from '@/types/faqchat'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export function useFaqChatStore() {
  const loading = useLoading()

  const getFaqChats = async () => {
    loading.startLoading('Chargement des quizzes en cours...')
    try {
      return await faqChatService.getFaqChats()
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const createFaqChat = async (faqChatData: FaqChat) => {
    loading.startLoading('Création du quiz en cours...')
    try {
      const response = await faqChatService.createFaqChat(faqChatData)
      toastSuccess(response.message || 'Quiz créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création')
    } finally {
      loading.stopLoading()
    }
  }

  const showFaqChat = async (id: string) => {
    loading.startLoading('Chargement du quiz en cours...')
    try {
      return await faqChatService.showFaqChat(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const editFaqChat = async (id: string, faqChatData: FaqChat) => {
    loading.startLoading('Mise à jour du quiz en cours...')
    try {
      const response = await faqChatService.editFaqChat(id, faqChatData)
      toastSuccess(response.message || 'Quiz mis à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteFaqChat = async (id: string) => {
    loading.startLoading('Suppression du quiz en cours...')
    try {
      const response = await faqChatService.deleteFaqChat(id)
      toastSuccess(response.message || 'Quiz supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    getFaqChats,
    createFaqChat,
    showFaqChat,
    editFaqChat,
    deleteFaqChat,
  }
}
