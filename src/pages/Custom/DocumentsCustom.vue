<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faSpinner,
  faPlusCircle,
  faFolderOpen,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileAlt,
  faEye,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useDocumentStore } from '@/stores/documentStore'
import { toastSuccess } from '@/utils/toastConfig'

// Ajouter icônes
library.add(
  faSpinner,
  faPlusCircle,
  faFolderOpen,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileAlt,
  faEye,
  faTrash,
)

const documents = ref<Document[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const message = ref<string | null>(null)
const isOpenModalUpload = ref<boolean>(false)

const documentStore = useDocumentStore()

// Déterminer l’icône selon le type de fichier
const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'file-pdf'
    case 'image':
      return 'file-image'
    case 'word':
      return 'file-word'
    default:
      return 'file-alt'
  }
}

// Récupérer les documents avec gestion loading/erreur/toast
const fetchDocuments = async () => {
  isLoading.value = true
  error.value = null
  message.value = null
  try {
    const res = await documentStore.getDocuments()
    documents.value = res?.data ?? []
  } catch (err) {
    console.error('Erreur lors du chargement des documents:', err)
  } finally {
    isLoading.value = false
  }
}

// Suppression d’un document
const deleteDocument = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return
  try {
    const res = await documentStore.deleteDocument(id)
    documents.value = documents.value.filter((d) => d.id !== id)
    toastSuccess(res?.message || 'Document supprimé avec succès')
  } catch (err) {
    console.error('Erreur lors de la suppression du document:', err)
  }
}

// Actions interface
const openUploadModal = () => {
  isOpenModalUpload.value = true
}

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Document } from '@/types/document'

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  if (!dateString) return 'Date inconnue'
  return format(new Date(dateString), "dd MMMM yyyy 'à' HH:mm", { locale: fr })
}
onMounted(fetchDocuments)
</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 text-center">
        <span class="hidden sm:inline">Mes documents envoyés</span>
        <span class="sm:hidden">Documents</span>
      </h1>
      <div class="flex justify-center sm:justify-start">
        <button
          @click="openUploadModal"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <font-awesome-icon icon="plus-circle" />
          <span class="hidden sm:inline">Ajouter un document</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-10 text-blue-500">
      <font-awesome-icon icon="spinner" class="animate-spin text-2xl sm:text-4xl mr-2 sm:mr-3" />
      <p class="text-base sm:text-xl">Chargement...</p>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded mb-4 text-sm sm:text-base"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <!-- Content -->
    <div v-else class="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
      <!-- Empty state -->
      <div v-if="documents.length === 0" class="text-center text-gray-500 py-6 sm:py-8">
        <font-awesome-icon icon="folder-open" class="text-3xl sm:text-4xl mb-2" />
        <p class="text-sm sm:text-base">Aucun document téléversé.</p>
        <p class="mt-2 text-xs sm:text-sm">Cliquez sur "Ajouter" pour commencer.</p>
      </div>

      <!-- Mobile cards view -->
      <div v-else class="block md:hidden space-y-3">
        <div
          v-for="document in documents"
          :key="document.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <font-awesome-icon
                :icon="getDocumentIcon(document.file_path)"
                class="text-lg text-gray-600 flex-shrink-0"
              />
              <span class="font-medium text-gray-900 text-sm truncate">{{ document.name }}</span>
            </div>
            <span
              :class="[
                'px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ml-2',
                { 'bg-orange-100 text-orange-800': document.is_validated === true },
                { 'bg-purple-100 text-purple-800': document.is_validated === false },
              ]"
            >
              {{ document.is_validated === false ? 'En attente' : 'Validé' }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mb-3">
            Envoyé le: {{ formatDate(document.created_at!) }}
          </p>
          <div class="flex gap-3 pt-3 border-t border-gray-200">
            <a href="#" class="flex-1 flex items-center justify-center gap-2 text-blue-500 hover:bg-blue-50 py-2 rounded-lg transition text-sm font-medium">
              <font-awesome-icon icon="eye" /> Voir
            </a>
            <button
              @click.prevent="deleteDocument(document.id!)"
              class="flex-1 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <font-awesome-icon icon="trash" /> Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop table view -->
      <div v-if="documents.length > 0" class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom du document
              </th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'envoi
              </th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="document in documents" :key="document.id" class="hover:bg-gray-50">
              <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <font-awesome-icon
                    :icon="getDocumentIcon(document.file_path)"
                    class="mr-2 text-lg text-gray-600"
                  />
                  <span class="font-medium text-gray-900 text-sm">{{ document.name }}</span>
                </div>
              </td>
              <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                {{ formatDate(document.created_at!) }}
              </td>
              <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    { 'bg-orange-100 text-orange-800': document.is_validated === true },
                    { 'bg-purple-100 text-purple-800': document.is_validated === false },
                  ]"
                >
                  {{ document.is_validated === false ? 'En attente' : 'Validé' }}
                </span>
              </td>
              <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                <a href="#" class="text-blue-500 hover:text-blue-600 text-lg">
                  <font-awesome-icon icon="eye" />
                </a>
                <button
                  @click.prevent="deleteDocument(document.id!)"
                  class="text-red-500 hover:text-red-600 text-lg"
                >
                  <font-awesome-icon icon="trash" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL UPLOAD -->
    <div
      v-if="isOpenModalUpload"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3 sm:p-4"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          @click="isOpenModalUpload = false"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-500 hover:text-red-600 cursor-pointer text-lg sm:text-xl"
        >
          ✕
        </button>
        <p class="text-center text-gray-500 text-sm sm:text-base">Upload form à intégrer ici</p>
      </div>
    </div>
  </div>
</template>
