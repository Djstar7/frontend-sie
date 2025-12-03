<template>
  <div class="min-h-screen w-full bg-gray-50 flex flex-col p-6">
    <h2
      class="text-4xl font-bold justify-center mb-6 text-orange-500 border-b-4 border-orange-200 pb-2 flex items-center gap-3"
    >
      <i class="fas fa-passport"></i> Gestion des Demandes de Visa
    </h2>

    <div class="flex flex-wrap gap-4 w-full mb-6 items-center bg-white p-4 rounded-lg shadow-sm">
      <input
        type="text"
        v-model="filter"
        placeholder="Rechercher (Nom, Email, Type de visa...)"
        class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-150"
      />
      <select
        v-model="filterStatus"
        class="min-w-[150px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 capitalize transition duration-150"
      >
        <option value="">Tous les statuts</option>
        <option value="created">Créée (en attente doc)</option>
        <option value="pending">En attente de paiement</option>
        <option value="processing">En traitement</option>
        <option value="approved">Approuvée</option>
        <option value="rejected">Rejetée</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-12 text-orange-500 font-medium text-lg">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement des demandes de visa...
    </div>

    <div v-else class="flex-1 overflow-auto bg-white rounded-lg shadow-xl border border-gray-200">
      <table class="w-full border-collapse min-w-full">
        <thead class="sticky top-0 bg-orange-100 z-10 border-b-2 border-orange-300">
          <tr>
            <th
              class="px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase w-[10%]"
            >
              Date
            </th>
            <th
              class="px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase w-[20%]"
            >
              Utilisateur
            </th>
            <th
              class="px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase w-[15%]"
            >
              Type de Visa
            </th>
            <th
              class="px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase w-[15%]"
            >
              Destination
            </th>
            <th
              class="px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase w-[15%]"
            >
              Statut
            </th>
            <th
              class="px-6 py-3 text-orange-500 font-bold text-sm tracking-wider uppercase w-[15%]"
            >
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
              {{ formatDateDayMonthYear(req.created_at!) }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="font-medium text-gray-900">{{ req.user?.name || 'N/A' }}</div>
              <div class="text-gray-500">{{ req.user?.email || 'N/A' }}</div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
              <i class="fas fa-plane-departure mr-2 text-blue-500"></i
              >{{ req.visa_type_name || 'N/A' }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ req.country_dest_name || 'N/A' }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
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

            <td class="px-6 py-4 whitespace-nowrap font-medium">
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
              <i class="fas fa-info-circle mr-2"></i> Aucune demande de visa trouvée correspondant
              aux critères.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="flex justify-between items-center mt-6 px-4 py-3 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 border rounded-full text-orange-600 border-orange-300 disabled:opacity-50 hover:bg-orange-50 transition font-medium flex items-center gap-2"
      >
        <i class="fas fa-arrow-left"></i> Précédent
      </button>
      <span class="text-gray-500 font-semibold">
        Page {{ currentPage }} / {{ totalPages }}
        <span class="text-sm text-gray-500 ml-2">({{ filteredRequests.length }} résultats)</span>
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border rounded-full text-orange-600 border-orange-300 disabled:opacity-50 hover:bg-orange-50 transition font-medium flex items-center gap-2"
      >
        Suivant <i class="fas fa-arrow-right"></i>
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
