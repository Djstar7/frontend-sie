<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePaymentStore } from '@/stores/paymentStore'
import type { Payment } from '@/types/payment'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import DeleteModal from '@/components/DeleteModal.vue'
import { useUserStore } from '@/stores/userStore'
import { paymentStatusColors, paymentStatusMap } from '@/utils/dataMap'

const payments = ref<Payment[]>([])
const paymentStore = usePaymentStore()
const route = useRoute()
const userStore = useUserStore()

const currentPage = ref(1)
const itemsPerPage = 20
const filter = ref<string>('')
const isOpenDelete = ref(false)
const selectedId = ref<string>('')

const initialStatus = (route.query.status as string)?.toLowerCase()
const filterStatus = ref<string>(initialStatus || '')

// Réinitialisation de la page lors du changement de filtre
watch(filter, () => {
  currentPage.value = 1
})
watch(filterStatus, () => {
  currentPage.value = 1
})

const filteredPayments = computed(() => {
  return payments.value.filter((p) => {
    const nameMatch = filter.value
      ? p.userName.toLowerCase().includes(filter.value.toLowerCase()) ||
        p.userEmail.toLowerCase().includes(filter.value.toLowerCase())
      : true

    let statusMatch = true

    if (filterStatus.value) {
      if (filterStatus.value === 'completed') {
        statusMatch = p.status === 'completed'
      } else if (filterStatus.value === 'failed') {
        statusMatch = p.status === 'failed'
      } else if (filterStatus.value === 'pending_grouped') {
        const pendingStatuses = ['pending', 'processing', 'canceled', 'expired']
        statusMatch = pendingStatuses.includes(p.status)
      } else {
        statusMatch = p.status === filterStatus.value
      }
    }

    return nameMatch && statusMatch
  })
})

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / itemsPerPage))
const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPayments.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const confirmDelete = (id: string) => {
  selectedId.value = id
  isOpenDelete.value = true
}

const deletePay = async (id: string) => {
  await paymentStore.deletePayment(id)
  payments.value = payments.value.filter((p) => p.id !== id)
  isOpenDelete.value = false
}

onMounted(async () => {
  // Simuler le chargement des paiements
  const res = await paymentStore.showPaymentByUser(String(userStore.user?.id))
  console.log(res)
  payments.value = res?.data || []
})
</script>
<template>
  <div class="min-h-screen w-full bg-gray-50 flex flex-col p-3 sm:p-4 md:p-6 max-w-full">
    <!-- Header -->
    <h2
      class="text-xl sm:text-2xl md:text-3xl justify-center font-bold mb-4 sm:mb-6 text-indigo-700 border-b-2 border-indigo-200 pb-2 flex items-center gap-2 sm:gap-3 text-center"
    >
      <i class="fas fa-wallet"></i>
      <span class="hidden sm:inline">Gestion des Transactions</span>
      <span class="sm:hidden">Transactions</span>
    </h2>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
      <input
        type="text"
        v-model="filter"
        placeholder="Rechercher..."
        class="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
      />
      <select
        v-model="filterStatus"
        class="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize transition duration-150 font-medium"
      >
        <option value="">Tous les statuts</option>
        <option value="completed">Payé</option>
        <option value="pending_grouped">En attente</option>
        <option value="failed">Échoué</option>
      </select>
    </div>

    <!-- Content -->
    <div class="flex-1 bg-white rounded-lg shadow-xl border border-gray-200">
      <!-- Mobile cards view -->
      <div class="block md:hidden p-3 space-y-3">
        <div
          v-for="p in paginatedPayments"
          :key="p.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="font-medium text-gray-900 text-sm truncate">{{ p.userName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ p.userEmail }}</p>
            </div>
            <span
              :class="paymentStatusColors.get(p.status) + ' font-semibold px-2 py-1 rounded-full text-xs'"
            >
              {{ paymentStatusMap.get(p.status) }}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Date:</span>
              <span class="font-medium text-gray-800">{{ formatDateDayMonthYear(p.created_at!) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Montant:</span>
              <span class="font-bold text-gray-800">{{ p.amount }} {{ p.currency }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Méthode:</span>
              <span class="text-gray-800 capitalize">{{ p.method }}</span>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-200">
            <button
              @click="confirmDelete(p.id!)"
              class="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
        <div v-if="paginatedPayments.length === 0" class="text-center py-8 text-gray-400">
          <i class="fas fa-info-circle mr-2"></i> Aucune transaction trouvée.
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full border-collapse">
          <thead class="sticky top-0 bg-indigo-100 z-10 border-b-2 border-indigo-300">
            <tr>
              <th class="px-3 lg:px-4 py-3 text-indigo-700 font-bold text-xs tracking-wider uppercase text-left">
                Date
              </th>
              <th class="px-3 lg:px-4 py-3 text-indigo-700 font-bold text-xs tracking-wider uppercase text-left">
                Utilisateur
              </th>
              <th class="px-3 lg:px-4 py-3 text-indigo-700 font-bold text-xs tracking-wider uppercase text-left">
                Montant
              </th>
              <th class="px-3 lg:px-4 py-3 text-indigo-700 font-bold text-xs tracking-wider uppercase text-left">
                Méthode
              </th>
              <th class="px-3 lg:px-4 py-3 text-indigo-700 font-bold text-xs tracking-wider uppercase text-left">
                Statut
              </th>
              <th class="px-3 lg:px-4 py-3 text-indigo-700 font-bold text-xs tracking-wider uppercase text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="p in paginatedPayments" :key="p.id" class="hover:bg-gray-50 transition duration-100">
              <td class="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                {{ formatDateDayMonthYear(p.created_at!) }}
              </td>
              <td class="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap text-sm">
                <div class="font-medium text-gray-900 truncate max-w-[120px] lg:max-w-[150px]">{{ p.userName }}</div>
                <div class="text-gray-500 text-xs truncate max-w-[120px] lg:max-w-[150px]">{{ p.userEmail }}</div>
              </td>
              <td class="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                {{ p.amount }} <span class="text-xs text-gray-500">{{ p.currency }}</span>
              </td>
              <td class="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {{ p.method }}
              </td>
              <td class="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap">
                <span
                  :class="paymentStatusColors.get(p.status) + ' font-semibold px-2 lg:px-3 py-1 rounded-full text-xs'"
                >
                  {{ paymentStatusMap.get(p.status) }}
                </span>
              </td>
              <td class="px-3 lg:px-4 py-3 lg:py-4 whitespace-nowrap font-medium">
                <button
                  @click="confirmDelete(p.id!)"
                  class="text-red-600 hover:text-red-800 transition text-lg"
                  title="Supprimer la transaction"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="paginatedPayments.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-400 font-medium">
                <i class="fas fa-info-circle mr-2"></i> Aucune transaction trouvée.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 px-3 sm:px-4 py-3 bg-white rounded-lg shadow-md border border-gray-200 gap-3"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 sm:px-4 py-2 border rounded-full text-indigo-600 border-indigo-300 disabled:opacity-50 hover:bg-indigo-50 transition font-medium flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
      >
        <i class="fas fa-arrow-left"></i> <span class="hidden sm:inline">Précédent</span>
      </button>
      <span class="text-gray-500 font-semibold text-sm text-center">
        Page {{ currentPage }} / {{ totalPages }}
        <span class="text-xs text-gray-500 ml-1 sm:ml-2">({{ filteredPayments.length }})</span>
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 sm:px-4 py-2 border rounded-full text-indigo-600 border-indigo-300 disabled:opacity-50 hover:bg-indigo-50 transition font-medium flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
      >
        <span class="hidden sm:inline">Suivant</span> <i class="fas fa-arrow-right"></i>
      </button>
    </div>

    <DeleteModal
      v-if="isOpenDelete"
      :val="'cette transaction'"
      @close="isOpenDelete = false"
      @confirm="deletePay(selectedId)"
    />
  </div>
</template>
<style scoped>
table th,
table td {
  text-align: left;
  vertical-align: middle;
}
</style>
