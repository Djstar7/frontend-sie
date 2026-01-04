import { notificationService } from '@/services/notificationService'
import { useLoading } from '@/utils/startLoading'
import { toastSuccess } from '@/utils/toastConfig'

export function useNotificationStore() {
  const loading = useLoading()

  const getNotification = async () => {
    loading.startLoading('Chargement des notifications...')
    try {
      return await notificationService.getNotifications()
    } catch {
      // Silently fail - loading will stop in finally
    } finally {
      loading.stopLoading()
    }
  }

  const showNotification = async (id: string) => {
    loading.startLoading('Chargement...')
    try {
      return await notificationService.showNotification(id)
    } catch (err) {
      loading.handleError(err, 'Erreur lors du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const showNotificationByUser = async (id: string) => {
    loading.startLoading('Chargement...')
    try {
      return await notificationService.showNotificationByUser(id)
    } catch (err) {
      loading.handleError(err, 'Erreur lors du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const markRead = async (id: string) => {
    try {
      return await notificationService.markRead(id)
    } catch (err) {
      console.error(err)
    }
  }
  const markAllRead = async () => {
    try {
      return await notificationService.markAllRead()
    } catch (err) {
      console.error(err)
    }
  }
  const markUnread = async (id: string) => {
    try {
      return await notificationService.markUnread(id)
    } catch (err) {
      console.error(err)
    }
  }
  const numberUnRead = async () => {
    try {
      return await notificationService.numberUnRead()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteNotification = async (id: string) => {
    loading.startLoading('Suppression...')
    try {
      const res = await notificationService.deleteNotification(id)
      toastSuccess(res.message)
      return res
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    getNotification,
    showNotification,
    showNotificationByUser,
    markRead,
    markAllRead,
    markUnread,
    deleteNotification,
    numberUnRead,
  }
}
