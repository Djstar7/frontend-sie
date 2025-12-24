<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVisaStore } from '@/stores/visaStore'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useUserStore } from '@/stores/userStore'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import { visaRequestStatusColors, visaRequestStatusMap } from '@/utils/dataMap'
import type { Visa, VisaRequest } from '@/types/visa'
import DeleteModalCustom from '@/components/DeleteModalCustom.vue'


const router = useRouter()
const userStore = useUserStore()
const visaStore = useVisaStore()
const visaRequestStore = useVisaRequestStore()


const visaRequests = ref<VisaRequest[]>([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 9


const isOpenDelete = ref(false)
const selectedId = ref<string | null>(null)


const totalPages = computed(() => Math.ceil(visaRequests.value.length / itemsPerPage))
const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return visaRequests.value.slice(start, start + itemsPerPage)
})


const fetchVisaRequests = async () => {
  loading.value = true
  try {
    const userId = userStore.user?.id
    if (!userId) return
    const response = await visaRequestStore.showVisaRequestByUser(userId)
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
  router.push({ name: 'custom.visarequest.show.get', params: { visaRequestId: id } })

const openPay = async (request: VisaRequest) => {
  const payload: Visa = {
    user_id: request.user.id!,
    country_dest_name: request.country_dest_name!,
    visa_type_name: request.visa_type_name!,
  }

  await visaStore.createStoreVisa(payload)
  router.push({ name: 'custom.payment.store', params: { visaRequestId: request.id } })
}

const openDocument = async (request: VisaRequest) => {
  const payload: Visa = {
    user_id: request.user.id!,
    country_dest_name: request.country_dest_name!,
    visa_type_name: request.visa_type_name!,
  }
  localStorage.removeItem('visaRequestId')
  await visaStore.createStoreVisa(payload)
  router.push({ name: 'custom.visarequest.create.upload', params: { visaRequestId: request.id } })
}


const openDelete = (id: string) => {
  selectedId.value = id
  isOpenDelete.value = true
}

const deleteRequest = async (id: string | null) => {
  if (!id) return
  try {
    await visaRequestStore.deleteVisaRequest(id)
    visaRequests.value = visaRequests.value.filter((req) => req.id !== id)

    if (currentPage.value > totalPages.value && currentPage.value > 1) {
      currentPage.value -= 1
    }
  } catch (error) {
    console.error('Erreur suppression demande :', error)
  } finally {
    isOpenDelete.value = false
    selectedId.value = null
  }
}


const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}


onMounted(fetchVisaRequests)
</script>

<template>
  <div class="min-h-screen p-3 sm:p-4 md:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 p-4 sm:p-5 md:p-6 bg-white rounded-xl shadow-lg border border-purple-100 gap-3 sm:gap-4">
      <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 flex items-center gap-2 sm:gap-3">
        <i class="fas fa-passport text-purple-600 text-2xl sm:text-3xl md:text-4xl"></i>
        <span class="hidden sm:inline">Mes Demandes</span>
        <span class="sm:hidden">Demandes</span>
      </h1>
      <router-link
        :to="{ name: 'custom.visarequest.create' }"
        class="px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
      >
        <i class="fas fa-plus"></i>
        <span class="hidden sm:inline">Nouvelle demande</span>
        <span class="sm:hidden">Nouvelle</span>
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-purple-500 py-12 sm:py-16 md:py-20 text-base sm:text-lg md:text-xl font-medium">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement...
    </div>

    <!-- Empty state -->
    <div v-else-if="visaRequests.length === 0" class="text-center py-12 sm:py-16 md:py-20 bg-white rounded-xl shadow-md border border-gray-100 px-4">
      <i class="fas fa-search-minus text-4xl sm:text-5xl md:text-6xl text-gray-300 mb-3 sm:mb-4"></i>
      <p class="text-base sm:text-lg md:text-xl font-semibold text-gray-600">
        Aucune demande de visa en cours.
      </p>
      <router-link
        :to="{ name: 'custom.visarequest.create' }"
        class="mt-4 inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
      >
        <i class="fas fa-arrow-right"></i> Démarrer une demande
      </router-link>
    </div>

    <!-- Cards grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <div
        v-for="request in paginatedRequests"
        :key="request.id"
        class="bg-white rounded-xl shadow-lg hover:shadow-xl p-4 sm:p-5 border border-gray-200 transition-all duration-300 flex flex-col justify-between"
      >
        <div class="flex flex-col mb-3 sm:mb-4 border-b pb-3 border-gray-100">
          <h2 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate mb-1">
            Visa {{ request.visa_type_name }}
          </h2>
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span class="text-xs sm:text-sm font-medium text-gray-500">
              <i class="fas fa-map-marker-alt text-gray-400 mr-1"></i> {{ request.country_dest_name || 'N/A' }}
            </span>
            <span
              class="px-2 sm:px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider"
              :class="visaRequestStatusColors.get(request.status)"
            >
              {{ visaRequestStatusMap.get(request.status) }}
            </span>
          </div>
        </div>

        <ul class="text-gray-600 text-xs sm:text-sm space-y-2 sm:space-y-3 mb-4 sm:mb-5">
          <li class="flex items-center gap-2">
            <i class="fas fa-user-circle text-blue-500 w-4 flex-shrink-0"></i>
            <span class="truncate"><b>Origine :</b> {{ request.country_origin_name || 'N/A' }}</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="fas fa-calendar-check text-green-500 w-4 flex-shrink-0"></i>
            <span><b>Soumis :</b> {{ formatDateDayMonthYear(request.created_at!) }}</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="fas fa-file-alt text-orange-500 w-4 flex-shrink-0"></i>
            <span class="truncate"><b>Réf :</b> <code class="text-xs bg-gray-100 px-1 py-0.5 rounded">{{ request.id?.substring(0, 8) }}...</code></span>
          </li>
        </ul>

        <div class="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            @click="openView(request.id)"
            class="flex-1 min-w-[70px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs sm:text-sm py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition"
          >
            <i class="fas fa-eye"></i> <span class="hidden xs:inline">Voir</span>
          </button>

          <button
            v-if="request.status === 'created'"
            @click="openDocument(request)"
            class="flex-1 min-w-[70px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition"
          >
            <i class="fa-solid fa-cloud-upload-alt"></i> <span class="hidden xs:inline">Upload</span>
          </button>

          <button
            v-if="request.status === 'pending'"
            @click="openPay(request)"
            class="flex-1 min-w-[70px] bg-green-600 hover:bg-green-700 text-white font-semibold text-xs sm:text-sm py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition"
          >
            <i class="fas fa-credit-card"></i> <span class="hidden xs:inline">Payer</span>
          </button>

          <button
            v-if="request.status !== 'processing'"
            @click="openDelete(request.id)"
            class="flex-1 min-w-[70px] bg-transparent text-red-500 border border-red-500 hover:bg-red-50 text-xs sm:text-sm py-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition"
            title="Supprimer la demande"
          >
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition text-sm"
      >
        <i class="fas fa-chevron-left"></i> <span class="hidden sm:inline">Précédent</span>
      </button>

      <div class="flex gap-1 sm:gap-2 flex-wrap justify-center">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold transition text-sm',
            currentPage === page ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
          ]"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition text-sm"
      >
        <span class="hidden sm:inline">Suivant</span> <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>

    <DeleteModalCustom
      v-if="isOpenDelete"
      message="cette demande de visa"
      confirmText="demande de visa"
      @close="isOpenDelete = false"
      @confirm="deleteRequest(selectedId)"
    />
</template>
