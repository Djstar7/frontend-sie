<template>
  <div class="p-3 sm:p-4 md:p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header + recherche + bouton ajouter -->
    <div class="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600 text-center">
        <i class="fas fa-plane text-orange-600 mr-2"></i> Gestion des types de visa
      </h1>
      <div class="flex flex-col gap-3 sm:gap-4">
        <!-- Recherche -->
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un type de visa..."
          class="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring focus:ring-orange-400"
        />
        <!-- Bouton ajouter -->
        <button
          @click="openCreateModal"
          class="flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 text-sm sm:text-base rounded-lg cursor-pointer w-full sm:w-auto sm:self-end"
        >
          <i class="fas fa-plus"></i>
          <span class="hidden sm:inline">Ajouter un type de visa</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-10 text-orange-400">
      <i class="fas fa-spinner animate-spin text-2xl sm:text-4xl mr-2 sm:mr-3"></i>
      <p class="text-base sm:text-xl">Chargement des types de visa...</p>
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
      <!-- Mobile cards view -->
      <div class="block md:hidden space-y-3">
        <div
          v-for="visaType in filteredVisaTypes"
          :key="visaType.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <h3 class="font-semibold text-gray-900 text-sm mb-2">{{ visaType.name }}</h3>
          <p class="text-sm text-gray-500 mb-3">{{ visaType.description || 'Aucune description' }}</p>
          <div class="flex gap-3 pt-2 border-t border-gray-200">
            <button
              @click="openEditModal(visaType)"
              class="flex-1 flex items-center justify-center gap-2 text-orange-500 hover:bg-orange-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button
              @click="confirmDelete(visaType.id!)"
              class="flex-1 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
        <div v-if="filteredVisaTypes.length === 0" class="text-center text-gray-500 py-6">
          Aucun type de visa trouvé.
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom du type
              </th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="visaType in filteredVisaTypes" :key="visaType.id" class="hover:bg-gray-50">
              <td class="px-4 lg:px-6 py-4 text-sm text-gray-900">{{ visaType.name }}</td>
              <td class="px-4 lg:px-6 py-4 text-sm text-gray-500">{{ visaType.description || 'N/A' }}</td>
              <td class="px-4 lg:px-6 py-4 flex gap-2">
                <button
                  @click="openEditModal(visaType)"
                  class="text-yellow-500 hover:text-yellow-700 text-xl lg:text-2xl cursor-pointer"
                  title="Modifier"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="confirmDelete(visaType.id!)"
                  class="text-red-500 hover:text-red-700 text-xl lg:text-2xl cursor-pointer"
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
    </div>

    <!-- MODAL CREATE -->
    <div
      v-if="isOpenModalCreateVisaType"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3 sm:p-4"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          @click="isOpenModalCreateVisaType = false"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-500 hover:text-red-600 cursor-pointer text-lg sm:text-xl"
        >
          ✕
        </button>
        <CreateVisaType @created="handleVisaTypeCreated" />
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div
      v-if="isOpenModalEditVisaType"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3 sm:p-4"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          @click="isOpenModalEditVisaType = false"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-500 hover:text-red-600 cursor-pointer text-lg sm:text-xl"
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
