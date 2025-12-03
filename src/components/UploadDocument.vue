<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import { useVisaStore } from '@/stores/visaStore'
import { useRouter, useRoute } from 'vue-router'
import type { DocumentItem } from '@/types/document'
import { allDocument } from '@/utils/data'
import { toastError, toastSuccess } from '@/utils/toastConfig'

interface DocumentError {
  [key: string]: string | null
}


const visaStore = useVisaStore()
const documentStore = useDocumentStore()
const router = useRouter()
const route = useRoute()


const uploadedFiles = ref<Record<string, File | null>>({})
const docErrors = ref<DocumentError>({})
const documentRecieve = ref<string[] | undefined>([])
const visaRequestId = ref<string>('')
const isSubmitting = ref(false)


onMounted(() => {
  visaRequestId.value = route.params.visaRequestId as string

  if (!visaRequestId.value) {
    toastError('Aucun ID trouvé. Reprenez la procédure.')
    router.push({ name: 'custom.visarequest.create' })
    return
  }


  documentRecieve.value = visaStore.visa.value?.documents || []



  if (documentRecieve.value.length === 0) {
    toastError("Aucun document requis trouvé pour cette demande.")

  }
})


const allDocumentsMap: Record<string, DocumentItem[]> = allDocument


const requiredDocs = computed(() => {
  const result: Record<string, DocumentItem[]> = {}

  for (const category in allDocumentsMap) {
    const filtered = allDocumentsMap[category].filter((doc) =>
      documentRecieve.value?.includes(doc.name),
    )

    if (filtered.length) {

      const cleanCategory = category.replace(/_/g, ' ').toUpperCase()
      result[cleanCategory] = filtered
    }
  }
  return result
})


function onFileChange(event: Event, docName: string) {
  const input = event.target as HTMLInputElement

  if (input.files && input.files[0]) {
    uploadedFiles.value[docName] = input.files[0]

    docErrors.value[docName] = null
  }
}


function validateFile(file: File, doc: DocumentItem): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (!ext || !doc.validation.fileTypes.includes(ext)) {
    return `Format .${ext} invalide. Types acceptés : ${doc.validation.fileTypes.join(', ')}`
  }

  if (file.size / 1024 / 1024 > doc.validation.maxSizeMB) {
    return `Taille max. : ${doc.validation.maxSizeMB} Mo dépassée`
  }

  return null
}


async function submitAll() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  if (!visaRequestId.value) {
    toastError('ID introuvable, veuillez recommencer.')
    isSubmitting.value = false
    return
  }

  let hasErrors = false
  const validFiles: { doc: DocumentItem; file: File }[] = []


  docErrors.value = {}


  for (const category in requiredDocs.value) {
    for (const doc of requiredDocs.value[category]) {
      const file = uploadedFiles.value[doc.name]


      if (!file && doc.validation.required) {
        docErrors.value[doc.name] = `${doc.name} est **OBLIGATOIRE**`
        hasErrors = true
        continue
      }


      if (file) {
        const error = validateFile(file, doc)
        if (error) {
          docErrors.value[doc.name] = error
          hasErrors = true
          continue
        }
        validFiles.push({ doc, file })
      }
    }
  }

  if (hasErrors) {
    isSubmitting.value = false
    return toastError('Veuillez corriger les erreurs de validation avant de soumettre.')
  }


  try {
    for (const { doc, file } of validFiles) {
      const formData = new FormData()
      formData.append('visa_request_id', visaRequestId.value)
      formData.append('name', doc.name)
      formData.append('document_file', file)


      await documentStore.createDocument(formData)
    }

    toastSuccess('Tous les documents ont été soumis avec succès !')
    router.push({
      name: 'custom.visarequest.show.get',
      params: { visaRequestId: visaRequestId.value },
    })
  } catch (e) {
    console.error('Erreur upload documents:', e)
    toastError('Erreur lors de l’envoi des documents. Veuillez réessayer.')
  } finally {
    isSubmitting.value = false
  }
}


const submitLater = () => {
  router.push({
    name: 'custom.visarequest.get'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center">

      <header class="text-center mb-10 p-4 bg-white rounded-xl shadow-lg border border-purple-100">
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center justify-center gap-3">
          <i class="fas fa-cloud-upload-alt text-purple-600"></i>
          Téléversement des Documents
        </h1>
        <p class="text-gray-500 mt-2 text-lg">
          Veuillez uploader chaque document listé ci-dessous.
        </p>
      </header>

      <div class="space-y-10">
        <div v-for="(docs, category) in requiredDocs" :key="category" class="p-6 bg-white rounded-xl shadow-xl border border-gray-100">

          <h2
            class="text-xl font-bold mb-6 text-indigo-700 uppercase tracking-wider border-b-2 border-indigo-100 pb-3 flex items-center gap-2"
          >
            <i class="fas fa-folder-open text-indigo-500"></i>
            {{ category }}
          </h2>

          <div class="grid gap-6 md:grid-cols-2">
            <div
              v-for="doc in docs"
              :key="doc.name"
              class="border-2 rounded-xl p-5 transition-all duration-300 relative"
              :class="{
                'border-red-500 bg-red-50 shadow-lg': docErrors[doc.name],
                'border-gray-200 hover:border-purple-300 bg-white shadow-md': !docErrors[doc.name],
              }"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                  {{ doc.name }}
                  <span
                    v-if="doc.validation.required"
                    class="ml-2 text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full"
                  >
                    Requis
                  </span>
                </h3>
              </div>

              <p class="text-gray-500 mb-4 text-sm">
                {{ doc.guide }}
                <span class="font-medium text-purple-600">
                    (Max: {{ doc.validation.maxSizeMB }} Mo, Formats: {{ doc.validation.fileTypes.map(t => '.' + t).join(', ') }})
                </span>
              </p>

              <label class="block cursor-pointer">
                <span class="sr-only">Choisir un fichier pour {{ doc.name }}</span>
                <input
                  type="file"
                  @change="onFileChange($event, doc.name)"
                  :accept="doc.validation.fileTypes.map((ext) => '.' + ext).join(',')"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </label>

              <div class="mt-3 pt-2 border-t border-gray-100 text-sm">
                <p v-if="docErrors[doc.name]" class="text-red-600 font-medium flex items-center gap-2">
                  <i class="fas fa-times-circle"></i>
                  Erreur: {{ docErrors[doc.name] }}
                </p>
                <p v-else-if="uploadedFiles[doc.name]" class="text-green-600 font-medium flex items-center gap-2">
                  <i class="fas fa-check-circle"></i>
                  Fichier sélectionné: <span class="truncate max-w-[calc(100%-120px)] text-gray-700 italic">{{ uploadedFiles[doc.name]?.name }}</span>
                </p>
                <p v-else class="text-gray-500 flex items-center gap-2">
                  <i class="fas fa-exclamation-triangle"></i>
                  Aucun fichier sélectionné.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-center gap-6 mt-12 pt-6 border-t border-gray-200">

        <button
          @click="submitLater"
          class="flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition duration-200 shadow-md"
        >
          <i class="fas fa-clock"></i>
          Uploader plus tard
        </button>

        <button
          @click="submitAll"
          :disabled="isSubmitting"
          class="flex items-center justify-center gap-2 px-10 py-3 text-white font-bold rounded-xl transition duration-300 shadow-xl"
          :class="{
            'bg-purple-600 hover:bg-purple-700 shadow-purple-300/70 transform hover:scale-[1.01]': !isSubmitting,
            'bg-purple-400 cursor-not-allowed': isSubmitting
          }"
        >
          <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-paper-plane"></i>
          {{ isSubmitting ? 'Envoi en cours...' : 'Soumettre les documents' }}
        </button>
      </div>
    </div>

</template>
