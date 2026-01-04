<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toastError } from '@/utils/toastConfig'
import type { DocumentItem, ListDocumentRequiredGrouped } from '@/types/document'
import { useDocumentStore } from '@/stores/documentStore'
import { useListDocumentRequiredStore } from '@/stores/listDocumentRequiredStore'

// Props
const { documentSend, id } = defineProps<{ documentSend: string[]; id: string }>()
const emit = defineEmits<{ (e: 'created'): void }>()

// Stores & Router
const route = useRoute()
const router = useRouter()
const documentStore = useDocumentStore()
const listDocumentStore = useListDocumentRequiredStore()

// Local state
const uploadedFile = ref<File | null>(null)
const docError = ref<string | null>(null)
const uploading = ref(false)
const isLoading = ref(true)

// Cible du document
const docName = documentSend[0]
const targetDoc = ref<DocumentItem | null>(null)

// Charger les documents depuis l'API et trouver le document cible
onMounted(async () => {
  try {
    const response = await listDocumentStore.getGrouped(true)
    if (response?.data) {
      const allDocumentsMap = listDocumentStore.toDocumentItemGroupedFormat(
        response.data as ListDocumentRequiredGrouped,
      )

      // Chercher le document dans toutes les categories
      for (const category in allDocumentsMap) {
        const found = allDocumentsMap[category].find((doc) => doc.name === docName)
        if (found) {
          targetDoc.value = found
          break
        }
      }
    }
  } catch (e) {
    console.error('Erreur lors du chargement des documents:', e)
    toastError('Erreur lors du chargement des documents')
  } finally {
    isLoading.value = false
  }
})

// Gestion changement fichier
function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    uploadedFile.value = input.files[0]
  } else {
    uploadedFile.value = null
  }
  docError.value = null
}

// Validation fichier
function validateFile(file: File, doc: DocumentItem): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!doc.validation.fileTypes.includes(ext)) {
    return `Format invalide (${ext}), attendu: ${doc.validation.fileTypes.join(', ')}`
  }
  if (file.size / 1024 / 1024 > doc.validation.maxSizeMB) {
    return `Taille trop grande (> ${doc.validation.maxSizeMB} MB)`
  }
  return null
}

// Soumission fichier
async function submitFile() {
  if (!route.params.visaRequestId) {
    toastError('ID de la demande de visa manquant.')
    return router.push({ name: 'custom.visarequest.create' })
  }
  if (!targetDoc.value) {
    toastError('Aucun document cible defini.')
    return
  }
  if (!uploadedFile.value) {
    docError.value = `${targetDoc.value.name} est requis`
    return
  }

  const error = validateFile(uploadedFile.value, targetDoc.value)
  if (error) {
    docError.value = error
    toastError(error)
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('visa_request_id', String(route.params.visaRequestId))
    formData.append('name', targetDoc.value.name)
    formData.append('document_file', uploadedFile.value)

    await documentStore.editDocument(id, formData)
    emit('created')
    uploadedFile.value = null
  } catch (err) {
    console.error('Erreur upload document:', err)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-10 text-purple-600 text-center">
      <i class="fa-solid fa-file mr-2"></i>
      Upload du document requis
    </h1>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-10">
      <i class="fas fa-spinner fa-spin text-3xl text-purple-600"></i>
      <span class="ml-3 text-gray-600">Chargement...</span>
    </div>

    <div v-else-if="targetDoc" class="bg-white rounded-2xl shadow-md p-6 space-y-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ targetDoc.name }}</h3>
      <p class="text-gray-500 text-sm italic">
        {{ targetDoc.guide }} (max {{ targetDoc.validation.maxSizeMB }} Mo, Types:
        {{ targetDoc.validation.fileTypes.join(', ') }})
      </p>

      <input
        type="file"
        @change="onFileChange"
        :accept="targetDoc ? targetDoc.validation.fileTypes.map((ext) => '.' + ext).join(',') : ''"
        class="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 cursor-pointer hover:bg-gray-50"
      />

      <p v-if="uploadedFile" class="text-gray-700 text-sm">
        Fichier selectionne: <span class="font-medium">{{ uploadedFile.name }}</span>
      </p>
      <p v-if="docError" class="text-red-500 text-sm">{{ docError }}</p>

      <button
        @click="submitFile"
        :disabled="uploading"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl shadow-md font-bold transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <i v-if="uploading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fa-solid fa-sign-in"></i>
        <span>{{ uploading ? 'Envoi...' : 'Soumettre le document' }}</span>
      </button>
    </div>

    <div v-else class="text-center py-10 text-gray-500">
      <i class="fas fa-exclamation-circle text-3xl text-orange-500 mb-3"></i>
      <p>Document non trouve</p>
    </div>
  </div>
</template>
