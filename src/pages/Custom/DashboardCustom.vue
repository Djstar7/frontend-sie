<template>
  <div class="p-6 bg-gray-50 min-h-screen font-sans">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Tableau de bord</h1>
      <p class="text-gray-500 mt-2">Suivi en temps réel de vos demandes de visa</p>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white transition transform"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Demandes totales</p>
            <h3 class="text-3xl font-bold">{{ totalVisaRequests }}</h3>
          </div>
          <i class="fas fa-passport text-3xl opacity-80"></i>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-md p-6 text-white transition transform"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80 text-black">En cours</p>
            <h3 class="text-3xl font-bold">{{ pendingRequests }}</h3>
          </div>
          <i class="fas fa-clock text-3xl opacity-80"></i>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white transition transform"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Approuvées</p>
            <h3 class="text-3xl font-bold">{{ approvedRequests }}</h3>
          </div>
          <i class="fas fa-check-circle text-3xl opacity-80"></i>
        </div>
      </div>
    </div>
    <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
      <!-- HEADER -->
      <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 class="text-lg font-semibold text-gray-900">Suivi de votre demande</h2>

        <div v-if="visaRequests.length > 1" class="flex-grow max-w-md w-full">
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Sélectionnez une demande
          </label>

          <div class="relative">
            <div
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              <i class="fas fa-chevron-down text-sm"></i>
            </div>

            <select
              v-model="selectedVisaRequestId"
              class="block w-full px-4 py-3 bg-white text-sm border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-all duration-300 appearance-none hover:border-blue-400"
            >
              <option v-for="request in sortedVisaRequests" :key="request.id" :value="request.id">
                {{ request.visa_type_name }} – {{ request.country_dest_name }} ({{
                  formatDate(request.created_at)
                }})
              </option>
            </select>
          </div>
        </div>

        <router-link
          :to="{ name: 'custom.visarequest.get' }"
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mt-1 transition"
        >
          Voir toutes les demandes
          <i class="fas fa-arrow-right ml-1 text-sm"></i>
        </router-link>
      </div>

      <div v-if="loadingRequests" class="flex items-center justify-center py-8 text-blue-500">
        <i class="fas fa-spinner animate-spin text-2xl mr-3"></i>
        <span>Chargement des demandes...</span>
      </div>
      <div v-else-if="selectedVisaRequest">
        <!-- PROGRESS BAR -->
        <div class="flex items-center w-full max-w-4xl mx-auto py-6">
          <template v-for="(step, index) in progressSteps" :key="index">
            <div class="relative flex flex-col items-center">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300"
                :class="step.bgClass"
              >
                <i :class="step.icon"></i>
              </div>
              <span class="text-sm mt-2 font-medium text-gray-700">{{ step.label }}</span>
            </div>

            <!-- BAR -->
            <div
              v-if="index < progressSteps.length - 1"
              class="flex-1 h-2 bg-gray-200 rounded-full relative overflow-hidden flex items-center mx-3"
            >
              <div
                class="absolute left-0 h-full transition-all duration-500"
                :class="step.barColor"
                :style="{ width: step.barProgress }"
              ></div>
            </div>
          </template>
        </div>

        <!-- INFO CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- Type visa -->
          <div
            class="bg-gray-50 rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"
              >
                <i class="fas fa-passport text-lg"></i>
              </div>

              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Type de visa</p>
                <p class="font-semibold text-gray-900 text-sm">
                  {{ selectedVisaRequest.visa_type_name || 'Non spécifié' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Destination -->
          <div
            class="bg-gray-50 rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"
              >
                <i class="fas fa-flag text-lg"></i>
              </div>

              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Pays de destination</p>
                <p class="font-semibold text-gray-900 text-sm">
                  {{ selectedVisaRequest.country_dest_name || 'Non spécifié' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Statut -->
          <div
            class="bg-gray-50 rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"
              >
                <i class="fas fa-clock text-lg"></i>
              </div>

              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">Statut</p>

                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full inline-block mt-1"
                  :class="visaRequestStatusColors.get(selectedVisaRequest.status)"
                >
                  {{
                    visaRequestStatusMap.get(selectedVisaRequest.status) ||
                    selectedVisaRequest.status
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Last update -->
        <div class="mb-6">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Dernière mise à jour</p>
          <p class="font-semibold text-gray-900 text-sm">
            {{ formatDate(selectedVisaRequest.updated_at ?? selectedVisaRequest.created_at) }}
          </p>
        </div>

        <!-- Link -->
        <router-link
          :to="{
            name: 'custom.visarequest.show.get',
            params: { visaRequestId: selectedVisaRequest.id },
          }"
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mt-2 transition"
        >
          Voir plus de détails
          <i class="fas fa-arrow-right ml-1 text-sm"></i>
        </router-link>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        <i class="fas fa-info-circle text-4xl mb-4"></i>
        <p>Aucune demande de visa en cours.</p>

        <router-link
          :to="{ name: 'custom.visarequest.create' }"
          class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Créer une nouvelle demande
        </router-link>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          Répartition des demandes par statut
        </h2>
        <div class="h-72">
          <canvas ref="pieChartRef"></canvas>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Historique des paiements</h2>
        <router-link
          :to="{ name: 'custom.payment' }"
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          Voir tout <i class="fas fa-arrow-right ml-1 text-sm"></i>
        </router-link>
      </div>

      <div v-if="payments.length === 0" class="text-center text-gray-400 py-8">
        <i class="fas fa-file-invoice-dollar text-4xl mb-2"></i>
        <p>Aucun paiement enregistré pour le moment.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Méthode
              </th>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th class="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in payments" :key="payment.id">
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                {{ formatDate(payment.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 uppercase">
                {{ payment.method ?? 'Paiement Visa' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {{ payment.amount }} {{ payment.currency }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="paymentStatusColors.get(payment.status)"
                  >{{ paymentStatusMap.get(payment.status) }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- Paiements -->

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useUserStore } from '@/stores/userStore'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import type { Ref } from 'vue'
import type { DocumentItem } from '@/types/document'
import type { Payment } from '@/types/payment'
import type { Notification } from '@/types/notification'
import { usePaymentStore } from '@/stores/paymentStore'
import {
  paymentStatusColors,
  paymentStatusMap,
  visaRequestStatusColors,
  visaRequestStatusMap,
} from '@/utils/dataMap'
import type { VisaRequest } from '@/types/visa'

/* ---------- Stores ---------- */
const visaRequestStore = useVisaRequestStore()
const userStore = useUserStore()
const paymentStore = usePaymentStore()

/* ---------- Chart.js (dynamic import) ---------- */
let Chart: any = null
import('chart.js/auto').then((m) => {
  Chart = m.default ?? m
})

/* ---------- Refs / State ---------- */
const pieChartRef: Ref<HTMLCanvasElement | null> = ref(null)
let pieChart: any = null

const loadingRequests = ref(true)
const visaRequests = ref<VisaRequest[]>([])
const notifications = ref<Notification[]>([])
const documents = ref<DocumentItem[]>([])
const payments = ref<Payment[]>([])
const selectedVisaRequestId = ref<string | null>(null)

/* ---------- Computeds ---------- */
const sortedVisaRequests = computed(() =>
  [...visaRequests.value].sort(
    (a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime(),
  ),
)

const selectedVisaRequest = computed(() =>
  selectedVisaRequestId.value
    ? visaRequests.value.find((r) => r.id === selectedVisaRequestId.value) || null
    : sortedVisaRequests.value[0] || null,
)

const progressSteps = computed(() => {
  if (!selectedVisaRequest.value) return []

  const status = selectedVisaRequest.value.status

  const stepOrder: VisaRequest['status'][] = ['created', 'pending', 'processing', 'approved']

  const steps = [
    { label: 'Création', icon: 'fas fa-user-check' },
    { label: 'Documents', icon: 'fas fa-file-upload' },
    { label: 'Traitement', icon: 'fas fa-clipboard-check' },
    { label: 'Visa', icon: 'fas fa-stamp' },
  ]

  const currentIndex = stepOrder.indexOf(status)

  const colors = {
    created: 'bg-blue-500',
    pending: 'bg-yellow-500',
    processing: 'bg-purple-500',
    approved: 'bg-green-500',
  }

  return steps.map((step, idx) => {
    const isActive = idx <= currentIndex

    return {
      ...step,

      bgClass: isActive ? colors[status] : 'bg-gray-300',


      barProgress: idx < currentIndex ? '100%' : '0%',
      barColor: idx < currentIndex ? colors[status] : 'bg-gray-300',
    }
  })
})

const totalVisaRequests = computed(() => visaRequests.value.length)
const pendingRequests = computed(
  () => visaRequests.value.filter((r: VisaRequest) => r.status === 'pending').length,
)
const approvedRequests = computed(
  () => visaRequests.value.filter((r: VisaRequest) => r.status === 'approved').length,
)

/* ---------- Helpers ---------- */
const formatDate = (d?: string | null) => (d ? formatDateDayMonthYear(d) : '')

/* ---------- Charts helpers ---------- */
const destroyCharts = () => {
  try {
    if (pieChart) {
      pieChart.destroy()
      pieChart = null
    }
  } catch (e) {
    console.warn('Error destroying charts', e)
  }
}

const createCharts = async () => {
  if (!Chart) return
  await nextTick()


  destroyCharts()


  if (pieChartRef.value) {
    const statusCounts = {
      created: visaRequests.value.filter((r) => r.status === 'created').length,
      pending: visaRequests.value.filter((r) => r.status === 'pending').length,
      processing: visaRequests.value.filter((r) => r.status === 'processing').length,
      approved: visaRequests.value.filter((r) => r.status === 'approved').length,
      rejected: visaRequests.value.filter((r) => r.status === 'rejected').length,
    }

    const labels = ['Créées', 'En cours', 'En traitement', 'Approuvées', 'Rejetées']
    const data = [
      statusCounts.created,
      statusCounts.pending,
      statusCounts.processing,
      statusCounts.approved,
      statusCounts.rejected,
    ]
    const backgroundColor = ['#3b82f6', '#facc15', '#8b5cf6', '#10b981', '#ef4444']

    pieChart = new Chart(pieChartRef.value, {
      type: 'pie',
      data: { labels, datasets: [{ data, backgroundColor }] },
      options: { responsive: true, maintainAspectRatio: false },
    })
  }
}

/* ---------- Load data ---------- */
const loadAllData = async () => {
  loadingRequests.value = true
  try {
    const userId = userStore.user?.id
    if (userId) {
      const res = await visaRequestStore.showVisaRequestByUser(userId)
      visaRequests.value = res?.data ?? []


      const sorted = [...visaRequests.value].sort(
        (a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime(),
      )
      selectedVisaRequestId.value = sorted[0]?.id ?? null


      const resPay = await paymentStore.showPaymentByUser(userId)
      payments.value = resPay?.data.slice(0, 5) ?? []
    } else {
      visaRequests.value = []
      notifications.value = []
      payments.value = []
    }


    documents.value = []
  } catch (err) {
    console.error('Erreur chargement dashboard:', err)
  } finally {
    loadingRequests.value = false

    await createCharts()
  }
}

/* Update charts whenever visaRequests changes */
watch(
  visaRequests,
  async () => {
    await createCharts()
  },
  { deep: true },
)

onMounted(() => {
  loadAllData()
})

onUnmounted(() => {
  destroyCharts()
})
</script>

<style scoped>
/* petits ajustements visuels */
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
