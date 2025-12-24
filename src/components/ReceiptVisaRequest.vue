<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import type { Receipt } from '@/types/receipt'

const visaRequestStore = useVisaRequestStore()
const visaRequestId = String(visaRequestStore.visaRequestId)

const receipt = ref<Receipt | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    console.log('Récupération du reçu pour la demande ID :', visaRequestId)
    const response = await visaRequestStore.showVisaRequest(visaRequestId)
    receipt.value = (response?.data as unknown as Receipt) || null
    loading.value = false
    console.log('Reçu chargé :', receipt.value)
  } catch (error) {
    loading.value = false
    console.error('Erreur chargement reçu', error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <!-- Loader -->
    <div v-if="loading" class="text-blue-500 font-medium animate-pulse">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement des détails...
    </div>

    <!-- Reçu -->
    <div v-else-if="receipt" class="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8 space-y-8">
      <!-- Header -->
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-blue-600">
          <i class="fas fa-file-invoice-dollar mr-2"></i> Détails du Reçu de Paiement
        </h1>
        <p class="text-gray-500 text-sm">
          <i class="fas fa-hashtag mr-1"></i>
          Référence : <span class="font-medium">{{ receipt.payment.id }}</span>
        </p>
        <p class="text-gray-400 text-xs">
          <i class="fas fa-calendar-alt mr-1"></i>
          Créé le : {{ formatDateDayMonthYear(receipt.created_at) }}
        </p>
      </div>

      <!-- Payment Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-blue-500 mb-3">
          <i class="fas fa-credit-card mr-2"></i> Paiement
        </h2>
        <ul class="text-gray-700 space-y-1">
          <li>
            <span class="font-medium">Montant :</span> {{ receipt.payment.amount }}
            {{ receipt.payment.currency }}
          </li>
          <li>
            <span class="font-medium">Transaction :</span> {{ receipt.payment.transaction_id }}
          </li>
          <li><span class="font-medium">Méthode :</span> {{ receipt.payment.method }}</li>
          <li>
            <span class="font-medium">Statut :</span>
            <span
              class="px-2 py-1 text-sm rounded-md"
              :class="{
                'bg-green-100 text-green-700': receipt.payment.status === 'success',
                'bg-yellow-100 text-yellow-700': receipt.payment.status === 'pending',
                'bg-red-100 text-red-700': receipt.payment.status === 'failed',
              }"
            >
              <i
                :class="{
                  'fas fa-check-circle': receipt.payment.status === 'success',
                  'fas fa-clock': receipt.payment.status === 'pending',
                  'fas fa-times-circle': receipt.payment.status === 'failed',
                }"
                class="mr-1"
              ></i>
              {{ receipt.payment.status }}
            </span>
          </li>
        </ul>
      </section>

      <!-- Visa Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-purple-600 mb-3">
          <i class="fas fa-passport mr-2"></i> Visa
        </h2>
        <ul class="text-gray-700 space-y-1">
          <li>
            <span class="font-medium">Type :</span>
            {{ receipt.visa_request.visa_type_name || 'N/A' }}
          </li>
          <li>
            <span class="font-medium">Pays d’origine :</span>
            {{ receipt.visa_request.country_origin_name || 'N/A' }}
          </li>
          <li>
            <span class="font-medium">Destination :</span>
            {{ receipt.visa_request.country_dest_name || 'N/A' }}
          </li>
        </ul>
      </section>

      <!-- User Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-orange-500 mb-3">
          <i class="fas fa-user mr-2"></i> Utilisateur
        </h2>
        <ul class="text-gray-700 space-y-1">
          <li>
            <span class="font-medium">Nom :</span> {{ receipt.profil.last_name }}
            {{ receipt.profil.first_name }}
          </li>
          <li><span class="font-medium">Email :</span> {{ receipt.user.email }}</li>
          <li><span class="font-medium">Téléphone :</span> {{ receipt.profil.phone }}</li>
        </ul>
      </section>

      <!-- File Link -->
      <div class="text-center">
        <a
          v-if="receipt.file_path"
          :href="receipt.file_path"
          target="_blank"
          class="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <i class="fas fa-download mr-2"></i> Télécharger le fichier
        </a>
      </div>
    </div>

    <!-- Aucun reçu -->
    <div v-else class="text-red-500 font-medium">
      <i class="fas fa-exclamation-circle mr-1"></i> Aucun reçu trouvé pour cette demande.
    </div>
  </div>
</template>
