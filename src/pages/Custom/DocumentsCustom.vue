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
  <div class="p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col gap-6 mb-6">
      <h1 class="text-4xl font-bold text-purple-600 text-center">Mes documents envoyés</h1>
      <div class="flex justify-start">
        <button
          @click="openUploadModal"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <font-awesome-icon icon="plus-circle" />
          Ajouter un document
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-blue-500">
      <font-awesome-icon icon="spinner" class="animate-spin text-4xl mr-3" />
      <p class="text-xl">Chargement des documents...</p>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <!-- Tableau des documents -->
    <div v-else class="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <div v-if="documents.length === 0" class="text-center text-gray-500 py-8">
        <font-awesome-icon icon="folder-open" class="text-4xl mb-2" />
        <p>Aucun document n'a été téléversé pour le moment.</p>
        <p class="mt-2">Cliquez sur "Ajouter un document" pour commencer.</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nom du document
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date d'envoi
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Statut
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="document in documents" :key="document.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <font-awesome-icon
                  :icon="getDocumentIcon(document.file_path)"
                  class="mr-2 text-lg text-gray-600"
                />
                <span class="font-medium text-gray-900">{{ document.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
              {{ formatDate(document.created_at!) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  { 'bg-orange-100 text-orange-800': document.is_validated === true },
                  { 'bg-purple-100 text-purple-800': document.is_validated === false },
                ]"
              >
                {{ document.is_validated === false ? 'En attente de validation' : 'Validé' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
              <a href="#" class="text-blue-500 hover:text-blue-600">
                <font-awesome-icon icon="eye" />
              </a>
              <button
                @click.prevent="deleteDocument(document.id!)"
                class="text-red-500 hover:text-red-600"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL UPLOAD -->
    <div
      v-if="isOpenModalUpload"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <!-- Bouton fermer -->
        <button
          @click="isOpenModalUpload = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>

        <!-- Ici ton composant upload -->
        <p class="text-center text-gray-500">Upload form à intégrer ici</p>
        <!-- Exemple : <UploadDocument @uploaded="handleDocumentUploaded" /> -->
      </div>
    </div>
  </div>
</template>
