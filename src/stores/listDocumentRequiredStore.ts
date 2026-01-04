import { ref } from 'vue'
import { listDocumentRequiredService } from '@/services/listDocumentRequiredService'
import type {
  ListDocumentRequired,
  ListDocumentRequiredForm,
  ListDocumentRequiredGrouped,
  DocumentItem,
} from '@/types/document'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export function useListDocumentRequiredStore() {
  const loading = useLoading()
  const documents = ref<ListDocumentRequired[]>([])
  const documentsGrouped = ref<ListDocumentRequiredGrouped>({})
  const categories = ref<string[]>([])

  // Recuperer tous les documents
  const getAll = async (activeOnly = false) => {
    loading.startLoading('Chargement des documents...')
    try {
      const response = await listDocumentRequiredService.getAll(activeOnly)
      documents.value = response.data
      return response
    } catch (err) {
      loading.handleError(err, 'Echec du chargement des documents')
    } finally {
      loading.stopLoading()
    }
  }

  // Recuperer les documents groupes par categorie
  const getGrouped = async (activeOnly = true) => {
    loading.startLoading('Chargement des documents...')
    try {
      const response = await listDocumentRequiredService.getGrouped(activeOnly)
      documentsGrouped.value = response.data
      return response
    } catch (err) {
      loading.handleError(err, 'Echec du chargement des documents')
    } finally {
      loading.stopLoading()
    }
  }

  // Recuperer les categories
  const getCategories = async () => {
    try {
      const response = await listDocumentRequiredService.getCategories()
      categories.value = response.data
      return response
    } catch (err) {
      loading.handleError(err, 'Echec du chargement des categories')
    }
  }

  // Creer un document
  const create = async (data: ListDocumentRequiredForm) => {
    loading.startLoading('Creation du document...')
    try {
      const response = await listDocumentRequiredService.create(data)
      toastSuccess(response.message || 'Document cree avec succes')
      return response
    } catch (err) {
      loading.handleError(err, 'Echec de la creation')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  // Mettre a jour un document
  const update = async (id: string, data: Partial<ListDocumentRequiredForm>) => {
    loading.startLoading('Mise a jour du document...')
    try {
      const response = await listDocumentRequiredService.update(id, data)
      toastSuccess(response.message || 'Document mis a jour avec succes')
      return response
    } catch (err) {
      loading.handleError(err, 'Echec de la mise a jour')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  // Supprimer un document
  const deleteDocument = async (id: string) => {
    loading.startLoading('Suppression du document...')
    try {
      const response = await listDocumentRequiredService.delete(id)
      toastSuccess(response.message || 'Document supprime avec succes')
      return response
    } catch (err) {
      loading.handleError(err, 'Echec de la suppression')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  // Basculer le statut actif
  const toggleActive = async (id: string) => {
    loading.startLoading('Mise a jour du statut...')
    try {
      const response = await listDocumentRequiredService.toggleActive(id)
      toastSuccess(response.message)
      return response
    } catch (err) {
      loading.handleError(err, 'Echec du basculement')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  // Convertir en format compatible avec DocumentItem (pour UploadDocument.vue)
  const toDocumentItemFormat = (docs: ListDocumentRequired[]): DocumentItem[] => {
    return docs.map((doc) => ({
      name: doc.name,
      guide: doc.guide || '',
      validation: {
        required: doc.is_required,
        fileTypes: doc.file_types,
        maxSizeMB: doc.max_size_mb,
      },
    }))
  }

  // Convertir le format groupe en Record<string, DocumentItem[]>
  const toDocumentItemGroupedFormat = (
    grouped: ListDocumentRequiredGrouped,
  ): Record<string, DocumentItem[]> => {
    const result: Record<string, DocumentItem[]> = {}
    for (const category in grouped) {
      result[category] = toDocumentItemFormat(grouped[category])
    }
    return result
  }

  // Convertir en format simplifie Record<string, string[]> (pour AddVisaAdmin.vue)
  const toSimpleGroupedFormat = (grouped: ListDocumentRequiredGrouped): Record<string, string[]> => {
    const result: Record<string, string[]> = {}
    for (const category in grouped) {
      result[category] = grouped[category].map((doc) => doc.name)
    }
    return result
  }

  return {
    documents,
    documentsGrouped,
    categories,
    getAll,
    getGrouped,
    getCategories,
    create,
    update,
    deleteDocument,
    toggleActive,
    toDocumentItemFormat,
    toDocumentItemGroupedFormat,
    toSimpleGroupedFormat,
  }
}
