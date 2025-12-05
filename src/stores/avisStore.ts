import { avisService } from '@/services/avisService'
import type { Avis } from '@/types/avis'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export function useAvisStore() {
  const loading = useLoading()

  const getAvis = async () => {
    loading.startLoading('Chargement des avis en cours...')
    try {
      const response = await avisService.getAvis()
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const createAvis = async (avisData: Avis) => {
    loading.startLoading('Création du avis en cours...')
    try {
      const response = await avisService.createAvis(avisData)
      toastSuccess(response.message || 'avis créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création')
    } finally {
      loading.stopLoading()
    }
  }

  const editAvis = async (id: string, avisData: Avis) => {
    loading.startLoading('Mise à jour du avis en cours...')
    try {
      const response = await avisService.editAvis(id, avisData)
      toastSuccess(response.message || 'avis mis à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteAvis = async (id: string) => {
    loading.startLoading('Suppression du avis en cours...')
    try {
      const response = await avisService.deleteAvis(id)
      toastSuccess(response.message || 'avis supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    getAvis,
    createAvis,
    editAvis,
    deleteAvis,
  }
}
