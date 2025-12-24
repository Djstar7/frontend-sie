<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppoitmentStore } from '@/stores/appoitmentStore'
import type { Appoitment } from '@/types/appoitment'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import { apptStatusColors, apptStatusMap } from '@/utils/dataMap'
import { useUserStore } from '@/stores/userStore'


const appoitmentStore = useAppoitmentStore()
const userStore = useUserStore()
const router = useRouter()


const appointments = ref<Appoitment[]>([])
const isLoading = ref(true)


const filterStatus = ref('')
const filterDate = ref('')


const currentPage = ref(1)
const itemsPerPage = ref(10)



/**
 * Charge les rendez-vous de l'utilisateur.
 */
const fetchAppointments = async () => {
  isLoading.value = true
  try {
    const res = await appoitmentStore.showAppoitmentByUser(userStore.user?.id as string)

    appointments.value = (res?.data ?? []).sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
  } catch (e) {
    console.error('Erreur chargement appointments:', e)
  } finally {
    isLoading.value = false
  }
}

/**
 * Navigue vers les détails de la demande de visa associée.
 */
const goToShowVisaRequest = (visaRequestId: string, userId: string) => {
  router.push({
    name: 'custom.visarequest.show.get',
    params: { visaRequestId: visaRequestId, userId: userId },
  })
}

onMounted(fetchAppointments)



/**
 * Liste des rendez-vous filtrés selon le statut et la date.
 */
const filteredAppointments = computed(() => {
  return appointments.value.filter((appt: Appoitment) => {
    const matchStatus = filterStatus.value ? appt.status === filterStatus.value : true
    const matchDate = filterDate.value ? appt.scheduled_at.startsWith(filterDate.value) : true
    return matchStatus && matchDate
  })
})

/**
 * Liste des rendez-vous paginés.
 */
const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredAppointments.value.slice(start, start + itemsPerPage.value)
})

/**
 * Nombre total de pages.
 */
const totalPages = computed(() => {
  return Math.ceil(filteredAppointments.value.length / itemsPerPage.value)
})




watch([filterStatus, filterDate], () => {
  currentPage.value = 1
})


const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 lg:p-8 w-full bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="mb-4 sm:mb-6 md:mb-8 border-b border-blue-200 pb-3 sm:pb-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
      <i class="fas fa-calendar-alt text-2xl sm:text-3xl md:text-4xl text-blue-600"></i>
      <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight text-center">
        <span class="hidden sm:inline">Mes Rendez-vous</span>
        <span class="sm:hidden">Rendez-vous</span>
      </h1>
    </header>

    <!-- Filters -->
    <div class="bg-white shadow-lg rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-gray-100">
      <h2 class="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center">
        <i class="fas fa-filter text-blue-500 mr-2"></i> Filtres
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div class="relative">
          <select
            v-model="filterStatus"
            class="appearance-none block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-700"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="completed">Terminé</option>
            <option value="rescheduled">Replanifié</option>
            <option value="canceled">Annulé</option>
          </select>
          <i class="fas fa-caret-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>

        <div class="relative">
          <input
            v-model="filterDate"
            type="date"
            class="block w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-700"
          />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center gap-3 sm:gap-4 text-blue-600 py-10 sm:py-12 md:py-16 bg-white rounded-xl shadow-lg">
      <i class="fas fa-spinner animate-spin text-3xl sm:text-4xl md:text-5xl"></i>
      <p class="text-base sm:text-lg font-medium">Chargement...</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Cards grid -->
      <div v-if="filteredAppointments.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div
          v-for="appt in paginatedAppointments"
          :key="appt.id"
          @click="goToShowVisaRequest(appt.visa_request_id, appt.user_id!)"
          class="bg-white border-l-4 p-4 sm:p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
          :class="{
            'border-green-500': appt.status === 'completed',
            'border-yellow-500': appt.status === 'pending' || appt.status === 'rescheduled',
            'border-red-500': appt.status === 'canceled',
          }"
        >
          <div class="flex justify-between items-start mb-2 sm:mb-3 gap-2">
            <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center">
              <i class="fas fa-clock text-blue-500 mr-2"></i>
              <span class="hidden sm:inline">Rendez-vous</span>
              <span class="sm:hidden">RDV</span>
            </h3>
            <span
              class="px-2 sm:px-3 py-1 text-xs rounded-full font-semibold capitalize whitespace-nowrap shadow-sm"
              :class="apptStatusColors.get(appt.status)!"
            >
              {{ apptStatusMap.get(appt.status)! }}
            </span>
          </div>

          <div class="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
            <p class="text-xs sm:text-sm text-gray-600 flex items-center">
              <i class="fas fa-calendar-check text-blue-400 w-4 sm:w-5 mr-2 flex-shrink-0"></i>
              <span class="font-medium text-gray-800">{{ formatDateDayMonthYear(appt.scheduled_at) }}</span>
            </p>
            <p class="text-xs sm:text-sm text-gray-600 flex items-center">
              <i class="fas fa-passport text-blue-400 w-4 sm:w-5 mr-2 flex-shrink-0"></i>
              <span class="truncate">Demande #<span class="font-medium text-gray-800">{{ appt.visa_request_id.substring(0, 8) }}...</span></span>
            </p>
          </div>

          <button class="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition duration-150 self-end mt-2 flex items-center">
            <span class="hidden sm:inline">Voir la demande</span>
            <span class="sm:hidden">Voir</span>
            <i class="fas fa-arrow-right ml-1 sm:ml-2 text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center text-gray-500 py-10 sm:py-12 md:py-16 bg-white rounded-xl shadow-lg border border-gray-100 px-4">
        <i class="fas fa-exclamation-triangle text-2xl sm:text-3xl text-yellow-500 mb-3"></i>
        <p class="text-sm sm:text-base">Aucun rendez-vous trouvé.</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredAppointments.length > 0" class="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0 mt-6 sm:mt-8">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg sm:rounded-l-lg sm:rounded-r-none border sm:border-r-0 bg-white text-blue-600 font-semibold hover:bg-blue-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
        >
          <i class="fas fa-chevron-left mr-1"></i> <span class="hidden sm:inline">Précédent</span>
        </button>

        <p class="px-4 sm:px-5 py-2 sm:border-y border sm:border-x-0 rounded-lg sm:rounded-none bg-white text-gray-700 font-medium text-sm w-full sm:w-auto text-center">
          Page {{ currentPage }} / {{ totalPages }}
        </p>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none border bg-white text-blue-600 font-semibold hover:bg-blue-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
        >
          <span class="hidden sm:inline">Suivant</span> <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>
