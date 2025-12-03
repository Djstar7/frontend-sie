// composables/useVisaRequest.ts
import { ref, computed } from 'vue'
import { visaRequestService } from '@/services/visaRequestService'
import type { VisaRequest, VisaRequestPayload } from '@/types/visa'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'
import { safeParse } from '@/utils/convert'

export function useVisaRequestStore() {
  const loading = useLoading()
  const error = ref<string | null>(null)
  const visaRequests = ref<VisaRequest[]>([])
  const visaRequestId = safeParse(localStorage.getItem('visaRequestId'))
  const user_id = safeParse(localStorage.getItem('user_id'))

  const recentActivities = computed(() =>
    visaRequests.value
      .map((request, index) => ({
        id: index + 1,
        user: `Utilisateur ${request.user.name || 'inconnu'}`,
        type: 'demande',
        description: `Nouvelle demande de visa ${
          request.visa_type_name ? `type ${request.visa_type_name}` : ''
        }`,
        date: new Date().toISOString(),
      }))
      .slice(0, 5),
  )

  const getVisaRequests = async () => {
    loading.startLoading('Chargement des demandes en cours...')
    try {
      const response = await visaRequestService.getVisaRequests()
      visaRequests.value = Array.isArray(response) ? response : []
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement des demandes')
    } finally {
      loading.stopLoading()
    }
  }

  const createVisaRequest = async (visaData: VisaRequestPayload) => {
    loading.startLoading('Création de la demande en cours...')
    try {
      const response = await visaRequestService.createVisaRequest(visaData)
      localStorage.setItem('visaRequestId', JSON.stringify(response.data.id))
      localStorage.setItem('user_id', JSON.stringify(response.data.user.id))
      toastSuccess(response.message || 'Demande créée avec succès')
      return response
    } catch (err) {
      localStorage.removeItem('visaRequestId')
      loading.handleError(err, 'Échec lors de la création de la demande')
    } finally {
      loading.stopLoading()
    }
  }

  const showVisaRequest = async (id: string) => {
    loading.startLoading('Chargement de la demande en cours...')
    try {
      return await visaRequestService.showVisaRequest(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement de la demande')
    } finally {
      loading.stopLoading()
    }
  }

  const showIdVisaRequest = async (id: string) => {
    loading.startLoading('Chargement de la demande spécifique...')
    try {
      return await visaRequestService.showIdVisaRequest(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const showVisaRequestByUser = async (id: string) => {
    loading.startLoading('Chargement des demandes de l’utilisateur...')
    try {
      const response = await visaRequestService.showVisaRequestByUser(id)
      localStorage.removeItem('visa')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const editVisaRequest = async (id: string, visaData: { status: string }) => {
    loading.startLoading('Mise à jour de la demande en cours...')
    try {
      const response = await visaRequestService.editVisaRequest(id, visaData)
      // const index = visaRequests.value.findIndex(v => v.id === id)
      // if (index !== -1) visaRequests.value[index] = response
      toastSuccess(response.message || 'Demande mise à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteVisaRequest = async (id: string) => {
    loading.startLoading('Suppression de la demande en cours...')
    try {
      const response = await visaRequestService.deleteVisaRequest(id)
      toastSuccess(response.message || 'Demande supprimée avec succès')
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    loading,
    error,
    visaRequests,
    visaRequestId,
    user_id,
    recentActivities,
    getVisaRequests,
    createVisaRequest,
    showVisaRequest,
    showIdVisaRequest,
    showVisaRequestByUser,
    editVisaRequest,
    deleteVisaRequest,
  }
}
