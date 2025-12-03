// composables/useVisaType.ts
import { ref } from 'vue'
import { visaTypeService } from '@/services/visaTypeService'
import type { VisaType } from '@/types/visa'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export const useVisaTypeStore = () => {
  const loading = useLoading()
  const error = ref<string | null>(null)
  const visaTypes = ref<VisaType[]>([])

  const getVisaTypes = async () => {
    loading.startLoading('Chargement des types de visa...')
    try {
      const response = await visaTypeService.getVisaTypes()
      visaTypes.value = Array.isArray(response) ? response : []
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement des types de visa')
    } finally {
      loading.stopLoading()
    }
  }

  const createVisaType = async (visaTypeData: VisaType) => {
    loading.startLoading('Création du type de visa...')
    try {
      const response = await visaTypeService.createVisaType(visaTypeData)
      visaTypes.value.push(visaTypeData)
      toastSuccess(response.message || 'Type de visa créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création du type de visa')
    } finally {
      loading.stopLoading()
    }
  }

  const showVisaType = async (id: string) => {
    loading.startLoading('Chargement du type de visa...')
    try {
      return await visaTypeService.showVisaType(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement du type de visa')
    } finally {
      loading.stopLoading()
    }
  }

  const editVisaType = async (id: string, visaTypeData: VisaType) => {
    loading.startLoading('Mise à jour du type de visa...')
    try {
      const response = await visaTypeService.editVisaType(id, visaTypeData)
      // const index = visaTypes.value.findIndex((v) => v.id === id)
      // if (index !== -1) visaTypes.value[index] = response
      toastSuccess(response.message || 'Type de visa mis à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour du type de visa')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteVisaType = async (id: string) => {
    loading.startLoading('Suppression du type de visa...')
    try {
      const response = await visaTypeService.deleteVisaType(id)
      visaTypes.value = visaTypes.value.filter((v) => v.id !== id)
      toastSuccess(response.message || 'Type de visa supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression du type de visa')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    loading,
    error,
    visaTypes,
    getVisaTypes,
    createVisaType,
    showVisaType,
    editVisaType,
    deleteVisaType,
  }
}
