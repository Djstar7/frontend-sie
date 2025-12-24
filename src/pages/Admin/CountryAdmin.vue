<template>
  <div class="p-3 sm:p-4 md:p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header + bouton ajouter -->
    <div class="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 text-center">
        Gestion des pays
      </h1>
      <div class="flex flex-col gap-3 sm:gap-4">
        <!-- Recherche -->
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher un pays..."
          class="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring focus:ring-blue-400"
        />

        <!-- Bouton ajouter -->
        <button
          @click="openCreateModal"
          class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg cursor-pointer w-full sm:w-auto sm:self-end"
        >
          <i class="fa fa-plus"></i>
          <span class="hidden sm:inline">Ajouter un pays</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-8 sm:py-10 text-blue-500">
      <i class="fa fa-spinner animate-spin text-2xl sm:text-4xl mr-2 sm:mr-3"></i>
      <p class="text-base sm:text-xl">Chargement des pays...</p>
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
          v-for="country in filteredCountrys"
          :key="country.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <h3 class="font-semibold text-gray-900 text-sm mb-2">{{ country.name }}</h3>
          <div class="space-y-1 text-sm text-gray-500 mb-3">
            <p><span class="font-medium">Code ISO:</span> {{ country.iso_code }}</p>
            <p><span class="font-medium">Indicatif:</span> {{ country.phone_code }}</p>
          </div>
          <div class="flex gap-3 pt-2 border-t border-gray-200">
            <button
              @click="openEditModal(country)"
              class="flex-1 flex items-center justify-center gap-2 text-orange-500 hover:bg-orange-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fa fa-edit"></i> Modifier
            </button>
            <button
              @click="confirmDelete(country.id!)"
              class="flex-1 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fa fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
        <div v-if="filteredCountrys.length === 0" class="text-center text-gray-500 py-6">
          Aucun pays trouvé.
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom du pays
              </th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code ISO
              </th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Indicatif téléphonique
              </th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="country in filteredCountrys" :key="country.id" class="hover:bg-gray-50">
              <td class="px-4 lg:px-6 py-4 text-sm text-gray-900">{{ country.name }}</td>
              <td class="px-4 lg:px-6 py-4 text-sm text-gray-500">{{ country.iso_code }}</td>
              <td class="px-4 lg:px-6 py-4 text-sm text-gray-500">{{ country.phone_code }}</td>
              <td class="px-4 lg:px-6 py-4 flex gap-3">
                <button
                  @click="openEditModal(country)"
                  class="text-orange-400 hover:text-orange-600 text-xl lg:text-2xl cursor-pointer"
                  title="Modifier"
                >
                  <i class="fa fa-edit"></i>
                </button>
                <button
                  @click="confirmDelete(country.id!)"
                  class="text-red-500 hover:text-red-700 text-xl lg:text-2xl cursor-pointer"
                  title="Supprimer"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredCountrys.length === 0">
              <td colspan="4" class="text-center text-gray-500 py-8">Aucun pays trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL CREATE -->
    <div
      v-if="isOpenModalCreateCountry"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3 sm:p-4"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          @click="isOpenModalCreateCountry = false"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-500 hover:text-red-600 cursor-pointer text-lg sm:text-xl"
        >
          ✕
        </button>
        <CreateCountry @create="handleCountryCreated" />
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div
      v-if="isOpenModalEditCountry"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3 sm:p-4"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          @click="isOpenModalEditCountry = false"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-500 hover:text-red-600 cursor-pointer text-lg sm:text-xl"
        >
          ✕
        </button>
        <EditCountry @update="handleCountryUpdated" :country="countryData!" />
      </div>
    </div>

    <!-- MODAL DELETE -->
    <DeleteModal
      v-if="isOpenDelete"
      :val="'ce pays'"
      @close="isOpenDelete = false"
      @confirm="deleteCountry(selectedId)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Country } from '@/types/country'
import { useCountryStore } from '@/stores/countryStore'
import CreateCountry from '@/components/CreateCountry.vue'
import EditCountry from '@/components/EditCountry.vue'
import DeleteModal from '@/components/DeleteModal.vue'

const countrys = ref<Country[]>([])
const countryData = ref<Country>()
const isLoading = ref(true)
const error = ref<string | null>(null)
const isOpenModalCreateCountry = ref(false)
const isOpenModalEditCountry = ref(false)
const search = ref('')

// Suppression
const isOpenDelete = ref(false)
const selectedId = ref<string>('')

const countryStore = useCountryStore()

// Charger la liste des pays
const fetchCountrys = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await countryStore.getCountrys()
    countrys.value = res?.data ?? []
  } catch (err) {
    console.error('Erreur lors du chargement des pays:', err)
    error.value = 'Impossible de charger les pays.'
  } finally {
    isLoading.value = false
  }
}

// Filtrage dynamique
const filteredCountrys = computed(() => {
  if (!search.value) return countrys.value
  const term = search.value.toLowerCase()
  return countrys.value.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      c.iso_code.toLowerCase().includes(term) ||
      c.phone_code.toLowerCase().includes(term),
  )
})

// Modales
const openCreateModal = () => (isOpenModalCreateCountry.value = true)
const handleCountryCreated = () => {
  fetchCountrys()
  isOpenModalCreateCountry.value = false
}

const openEditModal = (country: Country) => {
  countryData.value = country
  isOpenModalEditCountry.value = true
}
const handleCountryUpdated = () => {
  fetchCountrys()
  isOpenModalEditCountry.value = false
}

// Suppression
const confirmDelete = (id: string) => {
  selectedId.value = id
  isOpenDelete.value = true
}
const deleteCountry = async (id: string) => {
  try {
    await countryStore.deleteCountry(id)
    countrys.value = countrys.value.filter((c) => c.id !== id)
    isOpenDelete.value = false
  } catch (err) {
    console.error('Erreur lors de la suppression du pays:', err)
  }
}

onMounted(fetchCountrys)
</script>
