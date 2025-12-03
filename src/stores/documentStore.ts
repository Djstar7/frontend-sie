// composables/useDocument.ts
import { documentService } from '@/services/documentService'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export function useDocumentStore() {
  const loading = useLoading()

  const getDocuments = async () => {
    loading.startLoading('Chargement des documents en cours...')
    try {
      const response = await documentService.getDocuments()
      return response
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const createDocument = async (documentData: FormData) => {
    loading.startLoading('Création du document en cours...')
    try {
      const response = await documentService.createDocument(documentData)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec lors de la création')
    } finally {
      loading.stopLoading()
    }
  }

  const showDocument = async (id: string) => {
    loading.startLoading('Chargement du document en cours...')
    try {
      return await documentService.showDocument(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const showDocumentByCustom = async (id: string) => {
    loading.startLoading('Chargement des documents du client...')
    try {
      return await documentService.showDocumentByCustom(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const showDocumentByVisaRequest = async (id: string) => {
    loading.startLoading('Chargement des documents pour la demande de visa...')
    try {
      return await documentService.showDocumentByVisaRequest(id)
    } catch (err) {
      loading.handleError(err, 'Échec du chargement')
    } finally {
      loading.stopLoading()
    }
  }

  const editDocument = async (id: string, documentData: FormData) => {
    loading.startLoading('Mise à jour du document en cours...')
    try {
      const response = await documentService.editDocument(id, documentData)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const editDocumentStatus = async (id: string, is_validated: boolean) => {
    loading.startLoading('Mise à jour du statut du document...')
    try {
      const response = await documentService.editDocumentStatus(id, is_validated)
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la mise à jour')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteDocument = async (id: string) => {
    loading.startLoading('Suppression du document en cours...')
    try {
      const response = await documentService.deleteDocument(id)
      toastSuccess(response.message || 'Document supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la suppression')
    } finally {
      loading.stopLoading()
    }
  }

  return {
    getDocuments,
    createDocument,
    showDocument,
    showDocumentByCustom,
    showDocumentByVisaRequest,
    editDocument,
    editDocumentStatus,
    deleteDocument,
  }
}
