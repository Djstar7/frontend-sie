<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDocumentStore } from '@/stores/documentStore'
import { useUserStore } from '@/stores/userStore'
import type { Document } from '@/types/document'
import UploadDocumentModal from './UploadDocumentModal.vue'
import { baseUR } from '@/services/api'

// Stores & route
const route = useRoute()
const documentStore = useDocumentStore()
const userStore = useUserStore()

// State
const documents = ref<Document[]>([])
const selectedDoc = ref<Document | null>(null)
const loading = ref(true)
const actionLoading = ref(false)
const showModal = ref(false)
const statusVisaRequest = ref()

// Zoom & rotation
const zoomLevel = ref(1)
const rotation = ref(0)
const cursor = ref({ x: 0, y: 0 })

// Fetch documents
const fetchDocuments = async () => {
  loading.value = true
  statusVisaRequest.value = route.query.status
  const id = String(route.params.visaRequestId)
  try {
    const res = await documentStore.showDocumentByVisaRequest(id)
    documents.value = res?.data || []
    selectedDoc.value = documents.value[0] || null
  } catch (e) {
    console.error('Erreur lors du chargement des documents:', e)
  } finally {
    loading.value = false
  }
}

// Select document
const selectDocument = (doc: Document) => {
  selectedDoc.value = doc
  zoomLevel.value = 1
  rotation.value = 0
}

// Zoom & rotation
const handleZoomIn = () => (zoomLevel.value = Math.min(zoomLevel.value + 0.25, 5))
const handleZoomOut = () => (zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5))
const handleRotate = () => (rotation.value = (rotation.value + 90) % 360)

// Mouse tracking
const handleMouseMove = (e: MouseEvent, container: HTMLDivElement) => {
  const rect = container.getBoundingClientRect()
  cursor.value.x = ((e.clientX - rect.left) / rect.width) * 100
  cursor.value.y = ((e.clientY - rect.top) / rect.height) * 100
}

// Validation
const validateDocument = async () => {
  if (!selectedDoc.value) return
  actionLoading.value = true
  try {
    await documentStore.editDocumentStatus(selectedDoc.value.id!, true)
    selectedDoc.value.is_validated = true
  } catch (e) {
    console.error('Erreur validation document:', e)
  } finally {
    actionLoading.value = false
  }
}

const rejectDocument = async () => {
  if (!selectedDoc.value) return
  actionLoading.value = true
  try {
    await documentStore.editDocumentStatus(selectedDoc.value.id!, false)
    selectedDoc.value.is_validated = false
  } catch (e) {
    console.error('Erreur rejet document:', e)
  } finally {
    actionLoading.value = false
  }
}

// CRUD (custom only)
const canManageDocs = computed(() => userStore.user?.role === 'custom')

const documentSend = ref<string[]>([])
const documentId = ref<string>()

const updateDocument = async (doc: string, docId: string) => {
  documentSend.value = []
  showModal.value = true
  documentId.value = docId
  documentSend.value?.push(doc)
}

const modaEdit = () => {
  showModal.value = false
  fetchDocuments()
}

onMounted(fetchDocuments)
</script>

<template>
  <div class="w-full max-w-6xl mx-auto p-4">
    <h2 class="text-3xl text-purple-600 font-bold py-2">Documents associés</h2>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center py-10">
      <i class="fas fa-spinner fa-spin text-purple-600 text-3xl"></i>
    </div>

    <!-- Documents -->
    <div v-else class="bg-white shadow-lg rounded-xl p-4">
      <div class="flex mb-4">
        <h3 class="text-xl font-semibold text-gray-700">Liste des documents</h3>
      </div>

      <!-- Thumbnails -->
      <div class="flex gap-3 overflow-x-auto pb-2">
        <div
          v-for="doc in documents"
          :key="doc.id"
          class="w-24 h-24 flex-shrink-0 rounded-lg border cursor-pointer overflow-hidden transition-all relative"
          :class="
            selectedDoc?.id === doc.id
              ? 'ring-2 ring-orange-500 shadow-lg'
              : 'hover:ring-2 hover:ring-blue-400'
          "
          @click="selectDocument(doc)"
        >
          <img
            v-if="!doc.file_path.endsWith('.pdf')"
            :src="`${baseUR}/storage/${doc.file_path}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`"
            class="w-full h-full object-cover"
            :alt="doc.name"
          />
          <div
            v-else
            class="flex items-center justify-center w-full h-full bg-purple-600 text-white"
          >
            <i class="fas fa-file-pdf text-5xl"></i>
          </div>

          <div
            v-if="canManageDocs && statusVisaRequest !== 'approved' && !doc.is_validated"
            class="absolute top-1 right-1 flex gap-1 bg-white rounded p-1 shadow"
          >
            <button
              @click.stop="updateDocument(doc.name, doc.id!)"
              class="text-blue-500 hover:text-blue-700"
            >
              <i class="fas fa-edit mx-2 cursor-pointer"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Document Viewer -->
      <div
        v-if="selectedDoc"
        class="mt-4 relative h-[480px] flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden"
      >
        <!-- PDF -->
        <iframe
          v-if="selectedDoc.file_path.endsWith('.pdf')"
          :src="`${baseUR}/storage/${selectedDoc.file_path}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`"
          class="w-full h-full rounded-xl border"
        ></iframe>

        <!-- Image -->
        <img
          v-else
          :src="`${baseUR}/storage/${selectedDoc.file_path}`"
          :alt="selectedDoc.name"
          class="max-w-full max-h-full object-contain transition-transform duration-150"
          :style="{
            transformOrigin: cursor.x + '% ' + cursor.y + '%',
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
          }"
          @mousemove="handleMouseMove($event, $event.currentTarget as HTMLDivElement)"
        />

        <!-- Toolbar -->
        <div
          v-if="!selectedDoc.file_path.endsWith('.pdf')"
          class="absolute top-4 right-4 flex gap-2 z-10"
        >
          <button @click="handleZoomOut" class="p-2 rounded bg-gray-100 hover:bg-gray-200 shadow">
            <i class="fas fa-minus"></i>
          </button>
          <button @click="handleZoomIn" class="p-2 rounded bg-gray-100 hover:bg-gray-200 shadow">
            <i class="fas fa-plus"></i>
          </button>
          <button @click="handleRotate" class="p-2 rounded bg-gray-100 hover:bg-gray-200 shadow">
            <i class="fas fa-redo"></i>
          </button>
        </div>

        <!-- Validation -->
        <div
          class="absolute bottom-4 right-4 flex gap-2 z-10"
          v-if="userStore.role !== 'custom' && !selectedDoc.is_validated"
        >
          <button
            @click="validateDocument"
            :disabled="actionLoading"
            class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-2"
          >
            <i v-if="actionLoading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-check"></i> Valider
          </button>
          <button
            @click="rejectDocument"
            :disabled="actionLoading"
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2"
          >
            <i v-if="actionLoading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-times"></i> Rejeter
          </button>
        </div>
      </div>

      <!-- Document Info -->
      <div v-if="selectedDoc" class="mt-4 text-center">
        <h3 class="text-xl text-gray-800">{{ selectedDoc.name }}</h3>
        <p v-if="!selectedDoc.file_path.endsWith('.pdf')" class="text-gray-500">
          Zoom: {{ Math.round(zoomLevel * 100) }}% | Rotation: {{ rotation }}°
        </p>
        <p class="text-xl mt-1">
          Validation:
          <span
            :class="
              selectedDoc.is_validated ? 'text-green-600 font-bold' : 'text-red-500 font-bold'
            "
            >{{ selectedDoc.is_validated ? 'Validé' : 'Non validé' }}</span
          >
        </p>
      </div>

      <!-- Back -->
       <router-link
        :to="{
          name:
            userStore.role === 'agent'
              ? 'agent.users.show.visarequest'
              :  'custom.visarequest.get'
        }"
        class="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition mt-6 pt-4 border-t border-gray-200 w-fit"
      >
        <i class="fas fa-arrow-left text-xl"></i>
        <span class="font-medium">Retour à la liste des demandes</span>
      </router-link>
    </div>

    <!-- MODAL EDIT-->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <!-- Bouton fermer -->
        <button
          @click="showModal = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>

        <!-- Contenu de l’édition -->
        <UploadDocumentModal :documentSend="documentSend!" :id="documentId!" @created="modaEdit" />
      </div>
    </div>
  </div>
</template>
