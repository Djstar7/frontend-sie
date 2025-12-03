<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import { visaRequestStatusColors, visaRequestStatusMap } from '@/utils/dataMap'
import type { VisaRequest } from '@/types/visa'


const route = useRoute()
const router = useRouter()
const visaRequestStore = useVisaRequestStore()


const visaRequests = ref<VisaRequest[]>([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 9

const totalPages = computed(() => Math.ceil(visaRequests.value.length / itemsPerPage))
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return visaRequests.value.slice(start, start + itemsPerPage)
})


const fetchVisaRequests = async () => {
  loading.value = true
  try {
    if (!route.params.userId) {
      throw new Error('User ID is missing from route parameters')
    }
    const response = await visaRequestStore.showVisaRequestByUser(String(route.params.userId))
    if (!response?.data || response.data.length === 0) {


    }
    visaRequests.value = response?.data || []
    } catch (error) {
    console.error('Erreur fetchVisaRequests', error)


  } finally {
    loading.value = false
  }
}


const openView = (id: string) =>
  router.push({ name: 'agent.users.show.visarequest.show', params: { visaRequestId: id } })


const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}


onMounted(fetchVisaRequests)
</script>

<template>
  <div class="min-h-screen">

      <div v-if="loading" class="text-center text-purple-500 animate-spin-slow py-20 text-xl font-medium">
        <i class="fas fa-spinner fa-spin mr-2"></i> Chargement des demandes en cours...
      </div>


      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="request in paginatedRequests"
          :key="request.id"
          class="bg-white rounded-xl shadow-lg hover:shadow-xl p-5 border border-gray-200 transition-all duration-300 flex flex-col justify-between"
        >
          <div class="flex flex-col mb-4 border-b pb-3 border-gray-100">
            <h2 class="text-xl font-bold text-gray-800 truncate mb-1">
              Visa {{ request.visa_type_name }}
            </h2>
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-500">
                    <i class="fas fa-map-marker-alt text-gray-400 mr-1"></i> {{ request.country_dest_name || 'N/A' }}
                </span>
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider"
                  :class="visaRequestStatusColors.get(request.status)"
                >
                  {{ visaRequestStatusMap.get(request.status) }}
                </span>
            </div>
          </div>

          <ul class="text-gray-600 text-sm space-y-3 mb-5">
            <li class="flex items-center gap-2">
              <i class="fas fa-user-circle text-blue-500 w-4"></i>
              <span><b>Pays d'origine :</b> {{ request.country_origin_name || 'N/A' }}</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fas fa-user-circle text-purple-500 w-4"></i>
              <span><b>Type de visa :</b> {{ request.visa_type_name || 'N/A' }}</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fas fa-calendar-check text-green-500 w-4"></i>
              <span><b>Soumis le :</b> {{ formatDateDayMonthYear(request.created_at!) }}</span>
            </li>
            <li class="flex items-center gap-2">
                <i class="fas fa-file-alt text-orange-500 w-4"></i>
                <span><b>Réf. Dossier :</b> <code class="text-xs bg-gray-100 px-1 py-0.5 rounded">{{ request.id?.substring(0, 8) }}...</code></span>
            </li>
          </ul>

          <div class="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100">

            <button
              @click="openView(request.id)"
              class="flex-1 min-w-[100px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <i class="fas fa-eye"></i> Voir
            </button>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center items-center gap-3 mt-10">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
        >
          <i class="fas fa-chevron-left"></i> Précédent
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'w-10 h-10 rounded-full font-semibold transition',
            currentPage === page ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
        >
          Suivant <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
</template>
