import { ref } from 'vue'
import { visaService } from '@/services/visaService'
import type { Visa, VisaFetch, VisaResourceType } from '@/types/visa'
import { safeParse } from '@/utils/convert'
import { useLoading } from '@/utils/startLoading'
import { toast } from 'vue3-toastify'

export const useVisaStore = () => {
  const loading = useLoading()
  const visa = ref<VisaResourceType | null>(safeParse(localStorage.getItem('visa')))
  const visarequest = ref<VisaFetch | null>(safeParse(localStorage.getItem('visarequest')))

  // === ACTIONS ===
  const getVisa = async () => {
    loading.startLoading('Chargement des demande de visa en cours')
    try {
      const response = await visaService.getVisas()
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement des visas')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  const createVisa = async (visaData: VisaFetch) => {
    loading.startLoading('Creation de la demande en cours...')
    try {
      const response = await visaService.createVisa(visaData)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création du visa')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  const createStoreVisa = async (visaData: Visa) => {
    loading.startLoading('Creation de visa en cours')
    try {
      localStorage.removeItem('visa')
      const response = await visaService.createStoreVisa(visaData)
      toast.success(response.message || 'Visa créé avec succès')
      localStorage.setItem('visa', JSON.stringify({ ...response.data, ...response.orthers }))
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la création du visa')
      localStorage.removeItem('visa')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  const showVisa = async (id: string) => {
    loading.startLoading('Recuperation du visa en cours')
    try {
      const response = await visaService.showVisa(id)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement du visa')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  const editVisa = async (id: string, visaData: Visa) => {
    loading.startLoading('Mise a jour du visa en cours')
    try {
      const response = await visaService.editVisa(id, visaData)
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la mise à jour du visa')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  const deleteVisa = async (id: string) => {
    loading.startLoading('Suppression du visa en cours')
    visarequest.value = null
    visa.value = null
    localStorage.removeItem('visarequest')
    localStorage.removeItem('visa')
    try {
      const response = await visaService.deleteVisa(id)
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la suppression du visa')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  // === RETURN ===
  return {
    visa,
    visarequest,
    // actions
    getVisa,
    createVisa,
    createStoreVisa,
    showVisa,
    editVisa,
    deleteVisa,
  }
}
