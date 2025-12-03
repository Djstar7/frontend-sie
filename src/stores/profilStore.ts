// composables/useProfil.ts
import { ref } from 'vue'
import profilService from '@/services/profilServie'
import type { Profil } from '@/types/user'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export function useProfilStore() {
  const loading = useLoading()
  const profil = ref<Profil | null>(null)
  const profils = ref<Profil[]>([])

  const createProfil = async (data: Profil) => {
    loading.startLoading('Création du profil en cours...')
    try {
      const response = await profilService.createProfil(data)
      toastSuccess(response.message || 'Profil créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la création du profil')
    } finally {
      loading.stopLoading()
    }
  }

  const showProfil = async (id: string) => {
    loading.startLoading('Chargement du profil en cours...')
    try {
      const response = await profilService.showProfil(id)
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la récupération du profil')
    } finally {
      loading.stopLoading()
    }
  }
  const showProfilUser = async (id: string) => {
    loading.startLoading('Chargement du profil en cours...')
    try {
      const response = await profilService.showProfilUser(id)
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la récupération du profil')
    } finally {
      loading.stopLoading()
    }
  }

  const getProfils = async () => {
    loading.startLoading('Chargement des profils en cours...')
    try {
      const response = await profilService.getProfils()
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la récupération des profils')
    } finally {
      loading.stopLoading()
    }
  }

  const editProfil = async (id: string, data: Profil) => {
    loading.startLoading('Mise à jour du profil en cours...')
    try {
      const response = await profilService.editProfil(id, data)

      // const index = profils.findIndex(p => p.id === id)
      // if (index !== -1) profils[index] = response.profil

      toastSuccess(response.message || 'Profil mis à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la mise à jour du profil')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteProfil = async (id: string) => {
    loading.startLoading('Suppression du profil en cours...')
    try {
      const response = await profilService.deleteProfil(id)
      // profils.splice(profils.findIndex(p => p.id === id), 1)
      // if (profil.value?.id === id) profil.value = null
      toastSuccess(response.message || 'Profil supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la suppression du profil')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    profil,
    profils,
    createProfil,
    showProfil,
    showProfilUser,
    getProfils,
    editProfil,
    deleteProfil,
  }
}
