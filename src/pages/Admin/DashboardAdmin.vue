<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen w-full">
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Tableau de bord administratif</h1>
      <p class="text-gray-600 mt-2">
        Vue d'ensemble complète de la plateforme et de ses indicateurs clés.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform transition duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 font-semibold">Total utilisateurs</p>
            <h3 class="text-4xl font-extrabold">{{ totalUsers }}</h3>
          </div>
          <i class="fas fa-users text-4xl text-blue-200 opacity-70"></i>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl shadow-lg p-6 text-white transform transition duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 font-semibold">Demandes de visa</p>
            <h3 class="text-4xl font-extrabold">{{ totalVisaRequests }}</h3>
          </div>
          <i class="fas fa-passport text-4xl text-orange-200 opacity-70"></i>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform transition duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 font-semibold">Paiements recus</p>
            <h3 class="text-4xl font-extrabold">{{ totalPayments }}</h3>
          </div>
          <i class="fas fa-check-circle text-4xl text-green-200 opacity-70"></i>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white transform transition duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 font-semibold">Revenus totaux</p>
            <h3 class="text-3xl font-extrabold">{{ totalRevenue.toLocaleString('fr-CM') }} XAF</h3>
          </div>
          <i class="fas fa-sack-dollar text-4xl text-purple-200 opacity-70"></i>
        </div>
      </div>
    </div>

    <hr class="mb-8 border-gray-200" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <div class="bg-white p-6 rounded-xl shadow-lg transition duration-300">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Statut des paiements</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas ref="statusPolarChartRef"></canvas>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg transition duration-300">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Répartition des utilisateurs</h2>
        <div class="h-80 flex items-center justify-center">
          <canvas ref="userHorizontalBarRef"></canvas>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg transition duration-300">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Statistiques Clés</h2>
        <div class="space-y-3">
          <router-link
            :to="{ name: 'admin.payment', query: { status: 'completed' } }"
            class="block p-4 bg-green-50 rounded-lg border-l-4 border-green-500 hover:shadow-md transition duration-300 cursor-pointer"
          >
            <p class="text-green-700 font-medium">Taux de réussite des paiements</p>
            <p class="text-2xl font-bold text-green-800">{{ paymentSuccessRate }}%</p>
          </router-link>

          <router-link
            :to="{ name: 'admin.visarequest', query: { period: 'this_month' } }"
            class="block p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition duration-300 cursor-pointer"
          >
            <p class="text-blue-700 font-medium">Demandes ce mois-ci</p>
            <p class="text-2xl font-bold text-blue-800">{{ requestsThisMonth }}</p>
          </router-link>

          <router-link
            :to="{ name: 'admin.visatype' }"
            class="block p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition duration-300 cursor-pointer"
          >
            <p class="text-purple-700 font-medium">Types de visa gérés</p>
            <p class="text-2xl font-bold text-purple-800">{{ visaTypes.length }}</p>
          </router-link>

          <router-link
            :to="{ name: 'admin.payment', query: { status: 'failed' } }"
            class="block p-4 bg-red-50 rounded-lg border-l-4 border-red-500 hover:shadow-md transition duration-300 cursor-pointer"
          >
            <p class="text-red-700 font-medium">Paiements échoués</p>
            <p class="text-2xl font-bold text-red-800">{{ failedPayments }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <hr class="mb-8 border-gray-200" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <div
        class="bg-white p-6 rounded-xl shadow-lg transition duration-300 col-span-full lg:col-span-2"
      >
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Évolution des Revenus</h2>
        <div class="h-96">
          <canvas ref="paymentAreaChartRef"></canvas>
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-lg transition duration-300 col-span-full lg:col-span-1"
      >
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          Répartition des demandes par Type de Visa
        </h2>
        <div class="h-80 flex items-center justify-center">
          <canvas ref="visaTypeDoughnutRef"></canvas>
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-lg transition duration-300 col-span-full lg:col-span-2"
      >
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Statistiques Globales des Demandes</h2>
        <div class="h-96">
          <canvas ref="visaRequestStatsRef"></canvas>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg transition duration-300">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Résumé du Processus</h2>

        <div class="space-y-3">
          <router-link
            :to="{ name: 'admin.visarequest', query: { status: 'all' } }"
            class="block p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition duration-300"
          >
            <p class="text-blue-700 font-medium">Total des demandes</p>
            <p class="text-2xl font-bold text-blue-800">{{ totalVisaRequests }}</p>
          </router-link>

          <router-link
            :to="{ name: 'admin.visarequest', query: { status: 'approved' } }"
            class="block p-4 bg-green-50 rounded-lg border-l-4 border-green-500 hover:shadow-md transition duration-300"
          >
            <p class="text-green-700 font-medium">Approuvées</p>
            <p class="text-2xl font-bold text-green-800">{{ approvedVisaRequests }}</p>
          </router-link>

          <router-link
            :to="{ name: 'admin.visarequest', query: { status: 'pending' } }"
            class="block p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 hover:shadow-md transition duration-300"
          >
            <p class="text-yellow-700 font-medium">En attente</p>
            <p class="text-2xl font-bold text-yellow-800">{{ pendingVisaRequests }}</p>
          </router-link>

          <router-link
            :to="{ name: 'admin.visarequest', query: { status: 'rejected' } }"
            class="block p-4 bg-red-50 rounded-lg border-l-4 border-red-500 hover:shadow-md transition duration-300"
          >
            <p class="text-red-700 font-medium">Rejetées</p>
            <p class="text-2xl font-bold text-red-800">{{ rejectedVisaRequests }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <hr class="mb-8 border-gray-200" />

    <div class="bg-white p-6 rounded-xl shadow-lg transition duration-300">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Dernières Demandes de Visa</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Utilisateur
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type de visa
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="request in recentVisaRequests" :key="request.id" @click="viewDetails(request.id, request.user.id!)" class="cursor-pointer hover:shadow-lg">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ request.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ request.user?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ request.visa_type_name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="visaRequestStatusColors.get(request.status)"
                >
                  {{ visaRequestStatusMap.get(request.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(request.created_at!) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted, watch } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useUserStore } from '@/stores/userStore'
import { usePaymentStore } from '@/stores/paymentStore'
import { useVisaTypeStore } from '@/stores/visaTypeStore'
import type { VisaRequest, VisaType } from '@/types/visa'
import type { UserRegister } from '@/types/user'
import type { Payment } from '@/types/payment'

import { visaRequestStatusColors, visaRequestStatusMap } from '@/utils/dataMap'
import router from '@/router'

// Chart.js imports
let Chart: any

// Dynamically import Chart.js to avoid build issues
import('chart.js/auto').then((module) => {
  Chart = module.default
})

// Store instances
const visaRequestStore = useVisaRequestStore()
const userStore = useUserStore()
const paymentStore = usePaymentStore()
const visaTypeStore = useVisaTypeStore()

// --- RÉFÉRENCES DES GRAPHIQUES (DIVERSIFIÉES) ---
const statusPolarChartRef = ref<HTMLCanvasElement | null>(null) // Polar Area Chart
const userHorizontalBarRef = ref<HTMLCanvasElement | null>(null) // Horizontal Bar Chart
const visaTypeDoughnutRef = ref<HTMLCanvasElement | null>(null) // CHANGEMENT: Doughnut Chart
const paymentAreaChartRef = ref<HTMLCanvasElement | null>(null) // Area Chart
const visaRequestStatsRef = ref<HTMLCanvasElement | null>(null) // Bar Chart (conservé)

let statusPolarChart: any = null
let userHorizontalBarChart: any = null
let visaTypeDoughnutChart: any = null // CHANGEMENT: Nouvelle instance de graphique
let paymentAreaChart: any = null
let visaRequestStatsChart: any = null

// Données réelles (à partir des stores)
const visaRequests = ref<VisaRequest[]>([])
const users = ref<UserRegister[]>([])
const payments = ref<Payment[]>([])
const visaTypes = ref<VisaType[]>([])

// --- Calcul des statistiques ---
const totalUsers = computed(() => users.value.length)
const totalVisaRequests = computed(() => visaRequests.value.length)
const totalPayments = computed(
  () => payments.value.filter((pay) => pay.status == 'completed').length,
)

const approvedVisaRequests = computed(
  () => visaRequests.value.filter((req) => req.status === 'approved').length,
)
const pendingVisaRequests = computed(
  () => visaRequests.value.filter((req) => req.status === 'pending').length,
)
const rejectedVisaRequests = computed(
  () => visaRequests.value.filter((req) => req.status === 'rejected').length,
)
const processingVisaRequests = computed(
  () => visaRequests.value.filter((req) => req.status === 'processing').length,
)

const totalRevenue = computed(() => {
  const paymentsFromStore = payments.value
  return paymentsFromStore
    .filter((p) => p.status === 'completed')
    .reduce((sum, payment) => {
      const amount =
        typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount || 0
      return sum + amount
    }, 0)
})
const viewDetails = (id: string, userId: string) => {
  router.push({ name: 'admin.visarequest.show', params: { visaRequestId: id, userId: userId } })
}

const requestsThisMonth = computed(() => {
  const realVisaRequests = visaRequests.value
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return realVisaRequests.filter((req) => {
    if (req.created_at) {
      const requestDate = new Date(req.created_at)
      return requestDate.getMonth() === currentMonth && requestDate.getFullYear() === currentYear
    }
    return false
  }).length
})

const failedPayments = computed(() => {
  const paymentsFromStore = payments.value
  return paymentsFromStore.filter((p) => p.status === 'failed').length
})

const paymentSuccessRate = computed(() => {
  const paymentsFromStore = payments.value
  const total = paymentsFromStore.length
  if (total === 0) return 0
  const completed = paymentsFromStore.filter((p) => p.status === 'completed').length
  return Math.round((completed / total) * 100)
})

const recentVisaRequests = computed(() => {
  const realVisaRequests = visaRequests.value

  return [...realVisaRequests]
    .sort((a, b) => {
      return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
    })
    .slice(0, 3)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Fonction pour charger toutes les données
const loadAllData = async () => {
  try {
    const visaTypesResult = await visaTypeStore.getVisaTypes()
    visaTypes.value = visaTypesResult?.data || []

    const usersResult = await userStore.getUsers()
    users.value = usersResult?.data || []

    const visaRequestsResult = await visaRequestStore.getVisaRequests()
    visaRequests.value = visaRequestsResult?.data || []

    const resPay = await paymentStore.getPayments()
    payments.value = resPay?.data || []

    // Initialiser les graphiques après le chargement des données
    nextTick(() => {
      initializeCharts()
    })
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
}

const initializeCharts = () => {
  createStatusPolarChart()
  createPaymentAreaChart()
  createUserHorizontalBarChart()
  createVisaTypeDoughnutChart() // CHANGEMENT
  createVisaRequestStatsChart()
}

// --- FONCTIONS DE CRÉATION DE GRAPHIQUES ---

// 1. Graphique Polar Area (Statut des paiements)
const createStatusPolarChart = () => {
  if (!Chart || !statusPolarChartRef.value) return

  if (statusPolarChart) statusPolarChart.destroy()

  const ctx = statusPolarChartRef.value.getContext('2d')
  if (!ctx) return

  const paymentsFromStore = payments.value || []

  const statusCounts: Record<string, number> = {
    completed: 0,
    pending: 0,
    failed: 0,
    processing: 0,
    canceled: 0,
    expired: 0,
  }
  paymentsFromStore.forEach((payment: Payment) => {
    const normalizedStatus = payment.status || ''
    if (statusCounts.hasOwnProperty(normalizedStatus)) {
      statusCounts[normalizedStatus]++
    }
  })

  const statusLabelsFR: Record<string, string> = {
    completed: 'Terminé',
    pending: 'En attente',
    failed: 'Échoué',
    processing: 'En traitement',
    canceled: 'Annulé',
    expired: 'Expiré',
  }

  const labels: string[] = []
  const chartData: number[] = []
  const backgroundColors = ['#10B981', '#FB923C', '#EF4444', '#7E22CE', '#6B7280', '#1D4ED8']
  const borderColors = ['#047857', '#F97316', '#B91C1C', '#6B21A8', '#374151', '#1E40AF']

  Object.entries(statusCounts).forEach(([status, count]) => {
    if (count > 0) {
      labels.push(statusLabelsFR[status])
      chartData.push(count)
    }
  })

  if (chartData.length === 0) return

  statusPolarChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels,
      datasets: [
        {
          data: chartData,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { font: { size: 12 }, padding: 10 },
        },
        tooltip: {
          backgroundColor: 'rgba(31, 41, 55, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#9CA3AF',
          borderWidth: 1,
          cornerRadius: 6,
        },
      },
      scale: {
        ticks: {
          beginAtZero: true,
          color: 'rgba(0, 0, 0, 0.7)',
        },
      },
    },
  })
}

// 2. Graphique Horizontal Bar (Répartition des utilisateurs)
const createUserHorizontalBarChart = () => {
  if (!Chart || !userHorizontalBarRef.value) return

  if (userHorizontalBarChart) userHorizontalBarChart.destroy()

  const ctx = userHorizontalBarRef.value.getContext('2d')
  if (!ctx) return

  const realUsers = users.value

  const roleCounts: Record<string, number> = { custom: 0, admin: 0, agent: 0 }

  realUsers.forEach((user: UserRegister) => {
    if (user.role && roleCounts.hasOwnProperty(user.role)) {
      roleCounts[user.role]++
    }
  })

  const chartData = [roleCounts['custom'], roleCounts['admin'], roleCounts['agent']]
  const labels = ['Clients', 'Administrateurs', 'Agents']

  if (chartData.some((count) => count > 0)) {
    userHorizontalBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Nombre d'utilisateurs",
            data: chartData,
            backgroundColor: ['#3B82F6', '#FB923C', '#7E22CE'],
            borderColor: ['#1D4ED8', '#F97316', '#6B21A8'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#9CA3AF',
            borderWidth: 1,
            cornerRadius: 6,
          },
        },
        scales: {
          y: {
            grid: { display: false },
            ticks: { color: 'rgba(0, 0, 0, 0.7)' },
          },
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: 'rgba(0, 0, 0, 0.7)' },
          },
        },
      },
    })
  }
}

// 3. Graphique Doughnut (Types de visa)
const createVisaTypeDoughnutChart = () => {
  if (!Chart || !visaTypeDoughnutRef.value) return

  if (visaTypeDoughnutChart) visaTypeDoughnutChart.destroy()

  const ctx = visaTypeDoughnutRef.value.getContext('2d')
  if (!ctx) return

  const realVisaRequests = visaRequests.value || []
  const realVisaTypes = visaTypes.value || []

  // Calcul du total des demandes par type de visa
  const typeCounts: Record<string, number> = {}
  realVisaRequests.forEach((request) => {
    const visaType = realVisaTypes.find((vt) => vt.id === request.visa_type_id)?.name || 'Inconnu'
    typeCounts[visaType] = (typeCounts[visaType] || 0) + 1
  })

  const labels = Object.keys(typeCounts)
  const data = Object.values(typeCounts)

  const backgroundColors = [
    '#6366F1', // Indigo 500
    '#FCD34D', // Amber 300
    '#10B981', // Emerald 500
    '#EF4444', // Red 500
    '#7E22CE', // Purple 700
    '#F97316', // Orange 600
    '#1E40AF', // Blue 800
  ]

  if (data.some((count) => count > 0)) {
    visaTypeDoughnutChart = new Chart(ctx, {
      type: 'doughnut', // CHANGEMENT: Type de graphique
      data: {
        labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right', // Afficher la légende à droite
            labels: { font: { size: 12 }, padding: 15 },
          },
          tooltip: {
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#9CA3AF',
            borderWidth: 1,
            cornerRadius: 6,
            callbacks: {
              label: function (context: any) {
                let label = context.label || ''
                if (label) {
                  label += ': '
                }
                if (context.parsed !== null) {
                  label += context.parsed
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                  const percentage = Math.round((context.parsed / total) * 100)
                  label += ` (${percentage}%)`
                }
                return label
              },
            },
          },
        },
        cutout: '70%', // Pour créer l'effet d'anneau (Doughnut)
      },
    })
  }
}

// 4. Graphique Area Chart (Historique des paiements)
const createPaymentAreaChart = () => {
  if (!Chart || !paymentAreaChartRef.value) return

  if (paymentAreaChart) paymentAreaChart.destroy()

  const ctx = paymentAreaChartRef.value.getContext('2d')
  if (!ctx) return

  const paymentsFromStore = payments.value || []

  const months = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Aoû',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
  ]
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const lastSixMonths = []
  const paymentData = []

  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    const year = currentYear - (currentMonth - i < 0 ? 1 : 0)
    lastSixMonths.push(`${months[monthIndex]} ${year}`)

    let totalAmount = 0
    for (const payment of paymentsFromStore) {
      if (payment.created_at) {
        const paymentDate = new Date(payment.created_at)
        if (
          paymentDate.getMonth() === monthIndex &&
          paymentDate.getFullYear() === year &&
          payment.status === 'completed'
        ) {
          const amount =
            typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount || 0
          totalAmount += amount
        }
      }
    }
    paymentData.push(totalAmount)
  }

  if (paymentData.some((count) => count > 0)) {
    paymentAreaChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: lastSixMonths,
        datasets: [
          {
            label: 'Montant des paiements (XAF)',
            data: paymentData,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderWidth: 2,
            fill: 'origin',
            tension: 0.3,
            pointBackgroundColor: '#1D4ED8',
            pointBorderColor: '#FFFFFF',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#9CA3AF',
            borderWidth: 1,
            cornerRadius: 6,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: {
              callback: (value: any) => value.toLocaleString('fr-CM') + ' XAF',
              color: 'rgba(0, 0, 0, 0.7)',
            },
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(0, 0, 0, 0.7)' },
          },
        },
      },
    })
  }
}

// 5. Graphique Bar (Statistiques des demandes de visa)
const createVisaRequestStatsChart = () => {
  if (!Chart || !visaRequestStatsRef.value) return

  if (visaRequestStatsChart) {
    visaRequestStatsChart.destroy()
  }

  const ctx = visaRequestStatsRef.value.getContext('2d')
  if (!ctx) return

  const statusCounts = {
    pending: pendingVisaRequests.value,
    processing: processingVisaRequests.value,
    approved: approvedVisaRequests.value,
    rejected: rejectedVisaRequests.value,
  }

  const labels = ['En attente', 'En traitement', 'Approuvé', 'Rejeté']
  const data = [
    statusCounts['pending'],
    statusCounts['processing'],
    statusCounts['approved'],
    statusCounts['rejected'],
  ]

  if (data.some((count) => count > 0)) {
    visaRequestStatsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nombre de demandes',
            data: data,
            backgroundColor: [
              'rgba(245, 158, 11, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(239, 68, 68, 0.7)',
            ],
            borderColor: [
              'rgba(202, 138, 4, 1)',
              'rgba(124, 58, 237, 1)',
              'rgba(4, 120, 87, 1)',
              'rgba(220, 38, 38, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            backgroundColor: 'rgba(31, 41, 55, 0.9)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#9CA3AF',
            borderWidth: 1,
            cornerRadius: 6,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { color: 'rgba(0, 0, 0, 0.7)' },
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(0, 0, 0, 0.7)' },
          },
        },
      },
    })
  }
}

// Watcher pour les changements dans les données du store
watch(
  [() => payments.value, () => users.value, () => visaRequests.value],
  () => {
    nextTick(() => {
      initializeCharts()
    })
  },
  { deep: true },
)

onMounted(() => {
  loadAllData()
})

onUnmounted(() => {
  // Détruire les instances de graphiques
  if (statusPolarChart) statusPolarChart.destroy()
  if (userHorizontalBarChart) userHorizontalBarChart.destroy()
  if (visaTypeDoughnutChart) visaTypeDoughnutChart.destroy() // CHANGEMENT
  if (paymentAreaChart) paymentAreaChart.destroy()
  if (visaRequestStatsChart) visaRequestStatsChart.destroy()
})
</script>
