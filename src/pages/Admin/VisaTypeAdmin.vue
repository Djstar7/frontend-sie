<template>
  <div class="p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header + recherche + bouton ajouter -->
    <div class="flex flex-col gap-6 mb-6">
      <h1 class="text-4xl font-bold text-orange-600 text-center"><i class="fas fa-plane text-orange-600"></i> Gestion des types de visa</h1>
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Recherche -->
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un type de visa..."
          class="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring focus:ring-orange-400"
        />
        <!-- Bouton ajouter -->
        <button
          @click="openCreateModal"
          class="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          <i class="fas fa-plus"></i>
          Ajouter un type de visa
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-orange-400">
      <i class="fas fa-spinner animate-spin text-4xl mr-3"></i>
      <p class="text-xl">Chargement des types de visa...</p>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <!-- Tableau -->
    <div v-else class="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nom du type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="visaType in filteredVisaTypes" :key="visaType.id">
            <td class="px-6 py-4 text-sm text-gray-900">{{ visaType.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ visaType.description || 'N/A' }}</td>
            <td class="px-6 py-4 flex gap-2">
              <button
                @click="openEditModal(visaType)"
                class="text-yellow-500 hover:text-yellow-700 text-2xl cursor-pointer"
                title="Modifier"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="confirmDelete(visaType.id!)"
                class="text-red-500 hover:text-red-700 text-2xl cursor-pointer"
                title="Supprimer"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredVisaTypes.length === 0">
            <td colspan="3" class="text-center text-gray-500 py-8">Aucun type de visa trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CREATE -->
    <div
      v-if="isOpenModalCreateVisaType"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          @click="isOpenModalCreateVisaType = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>
        <CreateVisaType @created="handleVisaTypeCreated" />
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div
      v-if="isOpenModalEditVisaType"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          @click="isOpenModalEditVisaType = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>
        <EditVisaType @updated="handleVisaTypeUpdated" :visa="visa!" />
      </div>
    </div>

    <!-- MODAL DELETE -->
    <DeleteModal
      v-if="isOpenDelete"
      :val="'ce type de visa'"
      @close="isOpenDelete = false"
      @confirm="deleteVisaType(selectedId)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { VisaType } from '@/types/visa'
import { useVisaTypeStore } from '@/stores/visaTypeStore'
import CreateVisaType from '@/components/CreateVisaType.vue'
import EditVisaType from '@/components/EditVisaType.vue'
import DeleteModal from '@/components/DeleteModal.vue'

const visaTypes = ref<VisaType[]>([])
const search = ref('')
const isLoading = ref(true)
const error = ref<string | null>(null)
const visaTypeStore = useVisaTypeStore()

// Modals
const isOpenModalCreateVisaType = ref(false)
const isOpenModalEditVisaType = ref(false)
const visa = ref<VisaType | null>(null)
const isOpenDelete = ref(false)
const selectedId = ref<string>('')

// Fetch
const fetchVisaTypes = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await visaTypeStore.getVisaTypes()
    visaTypes.value = res?.data ?? []
  } catch (err) {
    console.error('Erreur lors du chargement des types de visa:', err)
    error.value = 'Impossible de charger les types de visa.'
  } finally {
    isLoading.value = false
  }
}

// Filtrage
const filteredVisaTypes = computed(() => {
  if (!search.value) return visaTypes.value
  const term = search.value.toLowerCase()
  return visaTypes.value.filter(
    (v) =>
      v.name.toLowerCase().includes(term) ||
      (v.description && v.description.toLowerCase().includes(term)),
  )
})

// Modales
const openCreateModal = () => (isOpenModalCreateVisaType.value = true)
const openEditModal = (v: VisaType) => {
  visa.value = v
  isOpenModalEditVisaType.value = true
}
const handleVisaTypeCreated = () => {
  isOpenModalCreateVisaType.value = false
  fetchVisaTypes()
}
const handleVisaTypeUpdated = () => {
  isOpenModalEditVisaType.value = false
  fetchVisaTypes()
}

// Suppression
const confirmDelete = (id: string) => {
  selectedId.value = id
  isOpenDelete.value = true
}
const deleteVisaType = async (id: string) => {
  try {
    await visaTypeStore.deleteVisaType(id)
    visaTypes.value = visaTypes.value.filter((v) => v.id !== id)
    isOpenDelete.value = false
  } catch (err) {
    console.error('Erreur lors de la suppression du type de visa:', err)
  }
}

onMounted(fetchVisaTypes)
</script>
