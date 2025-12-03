import { AppoitmentService } from '@/services/appoitmentService'
import type { Appoitment } from '@/types/appoitment'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'
import { ref } from 'vue'

export function useAppoitmentStore() {
  const loading = useLoading()
  const appoitments = ref<Appoitment[]>([])

  // Récupérer tous les rendez-vous
  const getAppoitments = async () => {
    loading.startLoading('Chargement des rendez-vous en cours...')
    try {
      const response = await AppoitmentService.getAppoitments()
      appoitments.value = response.data
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  // Créer un rendez-vous
  const createAppoitment = async (appoitmentData: Appoitment) => {
    loading.startLoading('Création du rendez-vous en cours...')
    try {
      const response = await AppoitmentService.createAppoitment(appoitmentData)
      toastSuccess(response.message || 'Rendez-vous créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création')
    } finally {
      loading.stopLoading()
    }
  }

  // Afficher un rendez-vous spécifique
  const showAppoitment = async (id: string) => {
    loading.startLoading('Chargement du rendez-vous en cours...')
    try {
      return await AppoitmentService.showAppoitment(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  // Afficher les rendez-vous d’un agent
  const showAppoitmentByAgent = async (id: string) => {
    loading.startLoading("Chargement des rendez-vous de l'agent en cours...")
    try {
      return await AppoitmentService.showAppoitmentByAgent(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  // Afficher les rendez-vous d’un client
  const showAppoitmentByCustom = async (id: string) => {
    loading.startLoading('Chargement des rendez-vous du client en cours...')
    try {
      return await AppoitmentService.showAppoitmentByCustom(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  // Afficher les rendez-vous liés à une demande de visa
  const showAppoitmentByVisaRequest = async (id: string) => {
    loading.startLoading('Chargement des rendez-vous pour la demande...')
    try {
      return await AppoitmentService.showAppoitmentByVisaRequest(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }
  const showAppoitmentByUser = async (id: string) => {
    loading.startLoading('Chargement des rendez-vous pour la demande...')
    try {
      return await AppoitmentService.showAppoitmentByUser(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  // Modifier un rendez-vous
  const editAppoitment = async (id: string, appoitmentData: Appoitment) => {
    loading.startLoading('Mise à jour du rendez-vous en cours...')
    try {
      const response = await AppoitmentService.editAppoitment(id, appoitmentData)
      toastSuccess(response.message || 'Rendez-vous mis à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  // Modifier un rendez-vous par l’utilisateur
  const editAppoitmentByUser = async (id: string, appoitmentData: Appoitment) => {
    loading.startLoading('Mise à jour du rendez-vous par utilisateur...')
    try {
      const response = await AppoitmentService.editAppoitmentByUser(id, appoitmentData)
      toastSuccess(response.message || 'Rendez-vous mis a jour par utilisateur avec success')
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  // Supprimer un rendez-vous
  const deleteAppoitment = async (id: string) => {
    loading.startLoading('Suppression du rendez-vous en cours...')
    try {
      const response = await AppoitmentService.deleteAppoitment(id)
      toastSuccess(response.message || 'Rendez-vous supprimé avec succès')
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    getAppoitments,
    createAppoitment,
    showAppoitment,
    showAppoitmentByAgent,
    showAppoitmentByCustom,
    showAppoitmentByVisaRequest,
    showAppoitmentByUser,
    editAppoitment,
    editAppoitmentByUser,
    deleteAppoitment,
  }
}
