import { backupService } from '@/services/backupService'
import type { Backup } from '@/types/backup'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export function useBackupStore() {
  const loading = useLoading()

  const getBackups = async () => {
    loading.startLoading('Chargement des backups en cours...')
    try {
      const response = await backupService.getBackups()
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const createBackup = async (backupData: Backup) => {
    loading.startLoading('Création du backup en cours...')
    try {
      const response = await backupService.createBackup(backupData)
      toastSuccess(response.message || 'Backup créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création')
    } finally {
      loading.stopLoading()
    }
  }

  const showBackup = async (id: string) => {
    loading.startLoading('Chargement du backup en cours...')
    try {
      const response = await backupService.showBackup(id)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteBackup = async (id: string) => {
    loading.startLoading('Suppression du backup en cours...')
    try {
      const response = await backupService.deleteBackup(id)
      toastSuccess(response.message || 'Backup supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    getBackups,
    createBackup,
    showBackup,
    deleteBackup,
  }
}
