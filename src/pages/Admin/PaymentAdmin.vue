<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePaymentStore } from '@/stores/paymentStore'
import type { Payment, StatusPayment } from '@/types/payment'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import DeleteModal from '@/components/DeleteModal.vue'




const CONSOLIDATED_STATUS_MAP = new Map<StatusPayment, { display: string; classes: string }>([

  ['completed', { display: 'Payé (Terminé)', classes: 'bg-green-100 text-green-700' }],

  ['failed', { display: 'Échoué', classes: 'bg-red-100 text-red-700' }],

  ['pending', { display: 'En attente', classes: 'bg-yellow-100 text-yellow-700' }],
  ['processing', { display: 'En traitement', classes: 'bg-indigo-100 text-indigo-700' }],
  ['canceled', { display: 'Annulé', classes: 'bg-gray-200 text-gray-600' }],
  ['expired', { display: 'Expiré', classes: 'bg-gray-300 text-gray-700' }],
])


const getStatusDisplayName = (status: StatusPayment): string => {
  return CONSOLIDATED_STATUS_MAP.get(status)?.display || 'Inconnu'
}


const getStatusDisplayClasses = (status: StatusPayment): string => {
  return CONSOLIDATED_STATUS_MAP.get(status)?.classes || 'bg-gray-100 text-gray-500'
}



const payments = ref<Payment[]>([])
const paymentStore = usePaymentStore()
const route = useRoute()


const currentPage = ref(1)
const itemsPerPage = 20
const filter = ref<string>('')
const editingStatusId = ref<string>()
const editedStatus = ref<StatusPayment>()
const isOpenDelete = ref(false)
const selectedId = ref<string>('')


const initialStatus = (route.query.status as string)?.toLowerCase()
const filterStatus = ref<string>(initialStatus || '')



const startEditingStatus = (payment: Payment) => {
  editingStatusId.value = payment.id
  editedStatus.value = payment.status
}

const saveStatus = async (payment: Payment) => {
  if (editedStatus.value) {
    await paymentStore.editPayment(payment.id!, editedStatus.value)

    const index = payments.value.findIndex((p) => p.id === payment.id)
    if (index !== -1) {
      payments.value[index].status = editedStatus.value
    }
  }
  editingStatusId.value = undefined
}



currentPage.value = 1
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
  const res = await paymentStore.getPayments()
  payments.value = res?.data || []
})
</script>
<template>
  <div class="min-h-screen w-full bg-gray-50 flex flex-col p-3 sm:p-4 md:p-6">
    <h2
      class="text-xl sm:text-2xl md:text-3xl justify-center font-bold mb-4 sm:mb-6 text-indigo-700 border-b-2 border-indigo-200 pb-2 flex items-center gap-2 sm:gap-3"
    >
      <i class="fas fa-wallet"></i> Gestion des Transactions
    </h2>

    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-4 sm:mb-6 items-stretch sm:items-center bg-white p-3 sm:p-4 rounded-lg shadow-sm">
      <input
        type="text"
        v-model="filter"
        placeholder="Rechercher (Nom, Email)"
        class="flex-1 w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
      />
      <select
        v-model="filterStatus"
        class="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize transition duration-150 font-medium"
      >
        <option value="">Tous les statuts </option>
        <option value="completed">Payé</option>
        <option value="pending_grouped">En attente</option>
        <option value="failed">Échoué</option>
      </select>
    </div>

    <div class="flex-1 bg-white rounded-lg shadow-xl border border-gray-200">
      <!-- Mobile cards view -->
      <div class="block lg:hidden p-3 space-y-3">
        <div
          v-for="p in paginatedPayments"
          :key="p.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="font-semibold text-gray-900 text-sm">{{ p.userName }}</p>
              <p class="text-gray-500 text-xs">{{ p.userEmail }}</p>
            </div>
            <span
              :class="getStatusDisplayClasses(p.status) + ' font-semibold px-2 py-1 rounded-full text-xs'"
            >
              {{ getStatusDisplayName(p.status) }}
            </span>
          </div>
          <div class="space-y-1 text-sm text-gray-600 mb-3">
            <p class="font-bold text-gray-800">{{ p.amount }} <span class="text-xs text-gray-500">{{ p.currency }}</span></p>
            <p><span class="font-medium">Méthode:</span> <span class="capitalize">{{ p.method }}</span></p>
            <p class="text-xs text-gray-400">{{ formatDateDayMonthYear(p.created_at!) }}</p>
          </div>

          <div v-if="editingStatusId === p.id" class="flex items-center gap-2 mb-3 p-2 bg-white rounded-lg">
            <select
              v-model="editedStatus"
              @click.stop
              class="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="completed">Terminé (Payé)</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoué</option>
            </select>
            <button
              @click.stop="saveStatus(p)"
              class="px-3 py-1 text-sm font-medium text-white bg-indigo-500 rounded hover:bg-indigo-400"
            >
              <i class="fas fa-save mr-1"></i> OK
            </button>
          </div>

          <div class="flex gap-3 pt-2 border-t border-gray-200">
            <button
              @click.stop="startEditingStatus(p)"
              class="flex-1 flex items-center justify-center gap-2 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button
              @click="confirmDelete(p.id!)"
              class="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
        <div v-if="paginatedPayments.length === 0" class="text-center py-6 text-gray-400 font-medium">
          <i class="fas fa-info-circle mr-2"></i> Aucune transaction trouvée.
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="hidden lg:block overflow-auto">
        <table class="w-full border-collapse min-w-full">
          <thead class="sticky top-0 bg-indigo-100 z-10 border-b-2 border-indigo-300">
            <tr>
              <th class="px-4 xl:px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase">
                Date
              </th>
              <th class="px-4 xl:px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase">
                Utilisateur
              </th>
              <th class="px-4 xl:px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase">
                Montant
              </th>
              <th class="px-4 xl:px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase">
                Méthode
              </th>
              <th class="px-4 xl:px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase">
                Statut
              </th>
              <th class="px-4 xl:px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="p in paginatedPayments" :key="p.id" class="transition duration-100 hover:bg-gray-50">
              <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                {{ formatDateDayMonthYear(p.created_at!) }}
              </td>
              <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm">
                <div class="font-medium text-gray-900">{{ p.userName }}</div>
                <div class="text-gray-500">{{ p.userEmail }}</div>
              </td>
              <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                {{ p.amount }} <span class="text-xs text-gray-500">{{ p.currency }}</span>
              </td>
              <td class="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {{ p.method }}
              </td>
              <td class="px-4 xl:px-6 py-4 whitespace-nowrap">
                <div v-if="editingStatusId === p.id" class="flex items-center gap-2">
                  <select
                    v-model="editedStatus"
                    @click.stop
                    class="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="completed">Terminé (Payé)</option>
                    <option value="pending">En attente</option>
                    <option value="failed">Échoué</option>
                  </select>
                  <button
                    @click.stop="saveStatus(p)"
                    class="px-2 py-1 text-xs font-medium text-white bg-indigo-500 rounded hover:bg-indigo-400"
                    title="Sauvegarder"
                  >
                    <i class="fas fa-save"></i>
                  </button>
                </div>
                <span
                  v-else
                  :class="
                    getStatusDisplayClasses(p.status) +
                    ' font-semibold px-3 py-1 rounded-full text-xs'
                  "
                >
                  {{ getStatusDisplayName(p.status) }}
                </span>
              </td>
              <td class="px-4 xl:px-6 py-4 whitespace-nowrap font-medium">
                <div class="flex items-center text-lg gap-3">
                  <button
                    @click.stop="startEditingStatus(p)"
                    class="text-indigo-600 hover:text-indigo-800 transition"
                    title="Modifier le statut"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDelete(p.id!)"
                    class="text-red-600 hover:text-red-800 transition"
                    title="Supprimer la transaction"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedPayments.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-400 font-medium text-lg">
                <i class="fas fa-info-circle mr-2"></i> Aucune transaction trouvée correspondant aux critères.
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
        class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-full text-indigo-600 border-indigo-300 disabled:opacity-50 hover:bg-indigo-50 transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <i class="fas fa-arrow-left"></i> <span class="hidden sm:inline">Précédent</span>
      </button>
      <span class="text-gray-500 font-semibold text-sm sm:text-base text-center">
        Page {{ currentPage }} / {{ totalPages }}
        <span class="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">({{ filteredPayments.length }} résultats)</span>
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-full text-indigo-600 border-indigo-300 disabled:opacity-50 hover:bg-indigo-50 transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
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
