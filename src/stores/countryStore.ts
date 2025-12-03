import { countryService } from '@/services/countryService'
import type { Country } from '@/types/country'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export function useCountryStore() {
  const loading = useLoading()

  const getCountrys = async () => {
    loading.startLoading('Chargement des pays en cours...')
    try {
      const response = await countryService.getCountrys()
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const createCountry = async (countryData: Country) => {
    loading.startLoading('Création du pays en cours...')
    try {
      const response = await countryService.createCountry(countryData)
      toastSuccess(response.message || 'Pays créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création')
    } finally {
      loading.stopLoading()
    }
  }

  const editCountry = async (id: string, countryData: Country) => {
    loading.startLoading('Mise à jour du pays en cours...')
    try {
      const response = await countryService.editCountry(id, countryData)
      toastSuccess(response.message || 'Pays mis à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteCountry = async (id: string) => {
    loading.startLoading('Suppression du pays en cours...')
    try {
      const response = await countryService.deleteCountry(id)
      toastSuccess(response.message || 'Pays supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    getCountrys,
    createCountry,
    editCountry,
    deleteCountry,
  }
}
