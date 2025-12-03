<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppoitmentStore } from '@/stores/appoitmentStore'
import type { Appoitment } from '@/types/appoitment'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import { apptStatusColors, apptStatusMap } from '@/utils/dataMap'


const appoitmentStore = useAppoitmentStore()
const router = useRouter()


const appointments = ref<Appoitment[]>([])
const isLoading = ref(true)


const filterStatus = ref('')
const filterDate = ref('')


const currentPage = ref(1)
const itemsPerPage = ref(12)



/**
 * Charge les rendez-vous de l'utilisateur.
 */
const fetchAppointments = async () => {
  isLoading.value = true
  try {
    const res = await appoitmentStore.getAppoitments()

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
  <div class="p-4 md:p-8 w-full bg-gray-50 min-h-screen">

    <header class="mb-8 border-b border-purple-200 pb-4 flex items-center">
      <i class="fas fa-calendar-alt text-4xl text-purple-600 mr-4"></i>
      <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">Mes Rendez-vous</h1>
    </header>

    <div class="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <i class="fas fa-filter text-purple-500 mr-2"></i> Options de Filtrage
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="relative">
                <select
                    v-model="filterStatus"
                    class="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 text-gray-700"
                >
                    <option value="">Afficher tous les statuts</option>
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
                    class="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 text-gray-700"
                />
            </div>
        </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center gap-4 text-purple-600 py-16 bg-white rounded-xl shadow-lg">
      <i class="fas fa-spinner animate-spin text-5xl"></i>
      <p class="text-lg font-medium">Chargement des rendez-vous...</p>
    </div>

    <div v-else>
      <div v-if="filteredAppointments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="appt in paginatedAppointments"
          :key="appt.id"
          @click="goToShowVisaRequest(appt.visa_request_id, appt.user_id!)"
          class="bg-white border-l-4 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          :class="{
              'border-green-500': appt.status === 'completed',
              'border-yellow-500': appt.status === 'pending' || appt.status === 'rescheduled',
              'border-red-500': appt.status === 'canceled',
          }"
        >
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-bold text-gray-800 flex items-center">
                    <i class="fas fa-clock text-purple-500 mr-2"></i>
                    Rendez-vous
                </h3>
                <span
                    class="px-3 py-1 text-xs rounded-full font-semibold capitalize whitespace-nowrap shadow-sm"
                    :class="apptStatusColors.get(appt.status)!"
                >
                    {{ apptStatusMap.get(appt.status)! }}
                </span>
            </div>

            <div class="space-y-2 mb-4">
                <p class="text-sm text-gray-600 flex items-center">
                    <i class="fas fa-calendar-check text-purple-400 w-5 mr-2"></i>
                    <span class="font-medium text-gray-800">{{ formatDateDayMonthYear(appt.scheduled_at) }}</span>
                </p>
                <p class="text-sm text-gray-600 flex items-center">
                    <i class="fas fa-passport text-purple-400 w-5 mr-2"></i>
                    Demande #<span class="font-medium text-gray-800 ml-1">{{ appt.visa_request_id.substring(0, 8) }}...</span>
                </p>
            </div>

            <button class="text-sm font-semibold text-purple-600 hover:text-purple-700 transition duration-150 self-end mt-2 flex items-center">
                Voir la demande <i class="fas fa-arrow-right ml-2 text-xs"></i>
            </button>
        </div>
      </div>

      <p v-else class="text-center text-gray-500 py-16 bg-white rounded-xl shadow-lg border border-gray-100">
        <i class="fas fa-exclamation-triangle text-3xl text-yellow-500 mb-3"></i>
        <br>
        Aucun rendez-vous ne correspond à vos critères de recherche.
      </p>

      <div v-if="filteredAppointments.length > 0" class="flex justify-center items-center mt-8">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-l-lg border border-r-0 bg-white text-purple-600 font-semibold hover:bg-purple-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <i class="fas fa-chevron-left mr-1"></i> Précédent
        </button>

        <p class="px-5 py-2 border-y bg-white text-gray-700 font-medium">Page {{ currentPage }} / {{ totalPages }}</p>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-r-lg border bg-white text-purple-600 font-semibold hover:bg-purple-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Suivant <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>
