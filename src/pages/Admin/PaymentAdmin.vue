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
  <div class="min-h-screen w-full bg-gray-50 flex flex-col p-6">
    <h2
      class="text-3xl justify-center font-bold mb-6 text-indigo-700 border-b-2 border-indigo-200 pb-2 flex items-center gap-3"
    >
      <i class="fas fa-wallet"></i> Gestion des Transactions
    </h2>

    <div class="flex flex-wrap gap-4 w-full mb-6 items-center bg-white p-4 rounded-lg shadow-sm">
      <input
        type="text"
        v-model="filter"
        placeholder="Rechercher (Nom, Email)"
        class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
      />
      <select
        v-model="filterStatus"
        class="min-w-[180px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize transition duration-150 font-medium"
      >
        <option value="">Tous les statuts </option>
        <option value="completed">Payé</option>
        <option value="pending_grouped">En attente</option>
        <option value="failed">Échoué</option>
      </select>
    </div>

    <div class="flex-1 overflow-auto bg-white rounded-lg shadow-xl border border-gray-200">
      <table class="w-full border-collapse min-w-full">
        <thead class="sticky top-0 bg-indigo-100 z-10 border-b-2 border-indigo-300">
          <tr>
            <th
              class="px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase w-[10%]"
            >
              Date
            </th>
            <th
              class="px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase w-[20%]"
            >
              Utilisateur
            </th>
            <th
              class="px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase w-[15%]"
            >
              Montant
            </th>
            <th
              class="px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase w-[15%]"
            >
              Méthode
            </th>
            <th
              class="px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase w-[20%]"
            >
              Statut
            </th>
            <th
              class="px-6 py-3 text-indigo-700 font-bold text-sm tracking-wider uppercase w-[10%]"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="p in paginatedPayments" :key="p.id" class="transition duration-100">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
              {{ formatDateDayMonthYear(p.created_at!) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="font-medium text-gray-900">{{ p.userName }}</div>
              <div class="text-gray-500">{{ p.userEmail }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
              {{ p.amount }} <span class="text-xs text-gray-500">{{ p.currency }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
              {{ p.method }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
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
            <td class="px-6 py-4 whitespace-nowrap font-medium">
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
            <td colspan="7" class="text-center py-6 text-gray-400 font-medium text-lg">
              <i class="fas fa-info-circle mr-2"></i> Aucune transaction trouvée correspondant aux
              critères.
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
        class="px-4 py-2 border rounded-full text-indigo-600 border-indigo-300 disabled:opacity-50 hover:bg-indigo-50 transition font-medium flex items-center gap-2"
      >
        <i class="fas fa-arrow-left"></i> Précédent
      </button>
      <span class="text-gray-500 font-semibold">
        Page {{ currentPage }} / {{ totalPages }}
        <span class="text-sm text-gray-500 ml-2">({{ filteredPayments.length }} résultats)</span>
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border rounded-full text-indigo-600 border-indigo-300 disabled:opacity-50 hover:bg-indigo-50 transition font-medium flex items-center gap-2"
      >
        Suivant <i class="fas fa-arrow-right"></i>
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
