<template>
  <div class="min-h-screen w-full bg-gray-50 flex flex-col p-3 sm:p-4 md:p-6">
    <h2
      class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold justify-center mb-4 sm:mb-6 text-orange-500 border-b-2 sm:border-b-4 border-orange-200 pb-2 flex items-center gap-2 sm:gap-3"
    >
      <i class="fas fa-passport"></i> Gestion des Demandes de Visa
    </h2>

    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-4 sm:mb-6 items-stretch sm:items-center bg-white p-3 sm:p-4 rounded-lg shadow-sm">
      <input
        type="text"
        v-model="filter"
        placeholder="Rechercher (Nom, Email, Type de visa...)"
        class="flex-1 w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-150"
      />
      <select
        v-model="filterStatus"
        class="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 capitalize transition duration-150"
      >
        <option value="">Tous les statuts</option>
        <option value="created">Créée (en attente doc)</option>
        <option value="pending">En attente de paiement</option>
        <option value="processing">En traitement</option>
        <option value="approved">Approuvée</option>
        <option value="rejected">Rejetée</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-8 sm:py-12 text-orange-500 font-medium text-base sm:text-lg">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement des demandes de visa...
    </div>

    <div v-else class="flex-1 bg-white rounded-lg shadow-xl border border-gray-200">
      <!-- Mobile cards view -->
      <div class="block lg:hidden p-3 space-y-3">
        <div
          v-for="req in paginatedRequests"
          :key="req.id"
          @click="viewDetails(req.id!, req.user.id!)"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="font-semibold text-gray-900 text-sm">{{ req.user?.name || 'N/A' }}</p>
              <p class="text-gray-500 text-xs">{{ req.user?.email || 'N/A' }}</p>
            </div>
            <span
              :class="[
                visaRequestStatusColors.get(req.status),
                'font-semibold',
                'px-2 py-1 rounded-full text-xs',
              ]"
            >
              {{ visaRequestStatusMap.get(req.status) }}
            </span>
          </div>
          <div class="space-y-1 text-sm text-gray-600 mb-3">
            <p><i class="fas fa-plane-departure mr-2 text-blue-500"></i>{{ req.visa_type_name || 'N/A' }}</p>
            <p><span class="font-medium">Destination:</span> {{ req.country_dest_name || 'N/A' }}</p>
            <p class="text-xs text-gray-400">{{ formatDateDayMonthYear(req.created_at!) }}</p>
          </div>
          <div class="flex justify-end pt-2 border-t border-gray-200">
            <button
              @click.stop="confirmDelete(req.id!)"
              class="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition text-sm font-medium"
            >
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
        <div v-if="paginatedRequests.length === 0" class="text-center py-6 text-gray-400 font-medium">
          <i class="fas fa-info-circle mr-2"></i> Aucune demande trouvée.
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="hidden lg:block overflow-auto">
        <table class="w-full border-collapse min-w-full">
          <thead class="sticky top-0 bg-orange-100 z-10 border-b-2 border-orange-300">
            <tr>
              <th class="px-4 xl:px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase">
                Date
              </th>
              <th class="px-4 xl:px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase">
                Utilisateur
              </th>
              <th class="px-4 xl:px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase">
                Type de Visa
              </th>
              <th class="px-4 xl:px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase">
                Destination
              </th>
              <th class="px-4 xl:px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase">
                Statut
              </th>
              <th class="px-4 xl:px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="req in paginatedRequests"
              :key="req.id"
              class="hover:bg-orange-50 transition duration-100 cursor-pointer"
              @click="viewDetails(req.id!, req.user.id!)"
            >
              <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                {{ formatDateDayMonthYear(req.created_at!) }}
              </td>

              <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-medium text-gray-900">{{ req.user?.name || 'N/A' }}</div>
                <div class="text-gray-500">{{ req.user?.email || 'N/A' }}</div>
              </td>

              <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                <i class="fas fa-plane-departure mr-2 text-blue-500"></i>{{ req.visa_type_name || 'N/A' }}
              </td>

              <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ req.country_dest_name || 'N/A' }}
              </td>

              <td class="px-4 xl:px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    visaRequestStatusColors.get(req.status),
                    'font-semibold',
                    'px-3 py-1 rounded-full text-xs',
                  ]"
                >
                  {{ visaRequestStatusMap.get(req.status) }}
                </span>
              </td>

              <td class="px-4 xl:px-6 py-4 whitespace-nowrap font-medium">
                <div class="flex items-center text-xl">
                  <button
                    @click.stop="confirmDelete(req.id!)"
                    class="text-red-600 hover:text-red-800 transition"
                    title="Supprimer la demande"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedRequests.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-400 font-medium text-lg">
                <i class="fas fa-info-circle mr-2"></i> Aucune demande de visa trouvée correspondant aux critères.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 sm:mt-6 px-3 sm:px-4 py-3 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-full text-orange-600 border-orange-300 disabled:opacity-50 hover:bg-orange-50 transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <i class="fas fa-arrow-left"></i> <span class="hidden sm:inline">Précédent</span>
      </button>
      <span class="text-gray-500 font-semibold text-sm sm:text-base text-center">
        Page {{ currentPage }} / {{ totalPages }}
        <span class="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">({{ filteredRequests.length }} résultats)</span>
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-full text-orange-600 border-orange-300 disabled:opacity-50 hover:bg-orange-50 transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <span class="hidden sm:inline">Suivant</span> <i class="fas fa-arrow-right"></i>
      </button>
    </div>

    <DeleteModalCustom
      v-if="isOpenDelete"
      :message="'cette demande de visa'"
      :confirm-text="'demande de visa'"
      @close="isOpenDelete = false"
      @confirm="deleteRequest(selectedId)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import type { VisaRequest } from '@/types/visa'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import { visaRequestStatusColors, visaRequestStatusMap } from '@/utils/dataMap'
import DeleteModalCustom from '@/components/DeleteModalCustom.vue'

// Router et Stores
const router = useRouter()
const route = useRoute()
const visaRequestStore = useVisaRequestStore()

// --- Fonctions utilitaires ---

/** Retourne le mois courant au format YYYY-MM (ex: '2025-11'). */
const getCurrentMonthFormat = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  // getMonth() est basé sur 0, on ajoute 1. padStart assure '01' à '09'.
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

// --- États des données et filtres ---
const visaRequests = ref<VisaRequest[]>([])
const loading = ref(true)

const currentPage = ref(ref(1))
const itemsPerPage = 20

const filter = ref<string>('')
const initialStatus = (route.query.status as string)?.toLowerCase()
const initialPeriod = (route.query.period as string)?.toLowerCase()

const filterStatus = ref<string>(initialStatus && initialStatus !== 'all' ? initialStatus : '')
const filterPeriod = ref<string>(initialPeriod || '')

// Suppression
const isOpenDelete = ref(false)
const selectedId = ref<string>('')

const confirmDelete = (id: string) => {
  selectedId.value = id
  isOpenDelete.value = true
}

const deleteRequest = async (id: string) => {
  try {
    await visaRequestStore.deleteVisaRequest(id)
    visaRequests.value = visaRequests.value.filter((p) => p.id !== id)
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande:', error)
  } finally {
    isOpenDelete.value = false
    selectedId.value = ''
  }
}

const viewDetails = (id: string, userId: string) => {
  router.push({ name: 'admin.visarequest.show', params: { visaRequestId: id, userId: userId } })
}

currentPage.value = 1
const filteredRequests = computed(() => {

  const currentMonth = filterPeriod.value === 'this_month' ? getCurrentMonthFormat() : null

  return visaRequests.value.filter((req) => {
    const user = req.user
    const searchString = filter.value.toLowerCase()

    const searchMatch =
      !filter.value ||
      user?.name?.toLowerCase().includes(searchString) ||
      user?.email?.toLowerCase().includes(searchString) ||
      req.visa_type_name?.toLowerCase().includes(searchString) ||
      req.country_dest_name?.toLowerCase().includes(searchString)

    const statusMatch = filterStatus.value ? req.status === filterStatus.value : true

    const periodMatch = currentMonth
      ? req.created_at && req.created_at.startsWith(currentMonth)
      : true

    return searchMatch && statusMatch && periodMatch
  })
})

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / itemsPerPage))

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRequests.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// --- Chargement des données ---
onMounted(async () => {
  loading.value = true
  try {
    const res = await visaRequestStore.getVisaRequests()
    visaRequests.value = res?.data || []
  } catch (error) {
    console.error('Erreur de chargement des demandes de visa:', error)
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
table th,
table td {
  text-align: left;
  vertical-align: middle;
}
</style>
