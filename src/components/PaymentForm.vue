<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVisaStore } from '@/stores/visaStore'
import { useUserStore } from '@/stores/userStore'
import { usePaymentStore } from '@/stores/paymentStore'
import type { PaymentSend } from '@/types/payment'

const visaStore = useVisaStore()
const userStore = useUserStore()
const paymentStore = usePaymentStore()
const route = useRoute()
const router = useRouter()
// const router = useRouter()

// const interval: number | null = null
const loading = ref(false)
const error = ref<string | null>(null)
const amount = ref(100)
// Données dynamiques
const email = computed(() => userStore.user?.email ?? '')
amount.value = visaStore?.visa.value?.price_base as number
const visaRequestId = computed(() => route.params.visaRequestId ?? '')
const paymentMethods = ['MTN', 'Orange', 'PayPal', 'MasterCard']

// Créer un paiement
const createPayment = async () => {
  if (!visaRequestId.value) {
    error.value = 'Impossible de récupérer l’identifiant de la demande de visa.'
    return
  }

  loading.value = true
  error.value = null

  try {
    const payload: PaymentSend = {
      amount: amount.value,
      email: email.value,
      visa_request_id: visaRequestId.value as string,
      method: 'mtn',
      currency: 'XAF',
    }
    await paymentStore.createPayment(payload)

    router.push({
      name: 'custom.visarequest.show.get',
      params: { visaRequestId: visaRequestId.value },
    })
    // if (!res.data.success) {
    //   error.value = res.data.error || "Erreur lors de l'initialisation du paiement."
    //   return
    // }

    // const { transaction_id, authorization_url, customer, reference } = res.data

    // if (!transaction_id || !authorization_url || !customer || !reference) {
    //   error.value = 'Données de paiement incomplètes.'
    //   return
    // }

    // // Stocker infos NotchPay avant redirection
    // localStorage.setItem('notchpay_customer', customer)
    // localStorage.setItem('notchpay_reference', reference)

    // // Redirection vers NotchPay
    // window.location.href = authorization_url
  } catch (e) {
    console.error('Erreur createPayment', e)
  } finally {
    loading.value = false
  }
}

// Polling du paiement
// const startPolling = (reference: string) => {
//   if (!reference) return
//   interval = window.setInterval(async () => {
//     try {
//       const res = await api.get(`/payment/status/${reference}`)
//       if (res.data.success && res.data.status) {
//         clearInterval(interval!)
//         if (res.data.status === 'complete') router.push({ name: 'payment.success' })
//         else if (res.data.status === 'failed') router.push({ name: 'payment.failed' })
//         else console.warn('Paiement en cours...')
//       } else {
//         console.warn(res.data.message)
//       }
//     } catch (err) {
//       console.error('Erreur checkStatus', err)
//     }
//   }, 4000)
// }

// // Afficher détails
// const openView = (request: any) => {
//   console.log('Afficher détails pour', request)
// }
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4 w-full">
    <div
      class="w-full max-w-xl p-8 rounded-3xl shadow-2xl text-white flex flex-col gap-6 bg-blue-400"
    >
      <!-- Montant -->
      <div class="text-center">
        <h3 class="text-2xl font-bold mb-1">Montant à payer</h3>
        <p class="text-4xl font-extrabold">{{ amount }} XAF</p>
      </div>

      <!-- Moyens de paiement -->
      <div>
        <p class="text-center mb-3 font-medium text-white/80">Méthodes de paiement disponibles</p>
        <div class="flex justify-center gap-4 flex-wrap">
          <span
            v-for="method in paymentMethods"
            :key="method"
            class="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold text-sm"
          >
            {{ method }}
          </span>
        </div>
      </div>

      <!-- Bouton paiement -->
      <button
        @click="createPayment"
        :disabled="loading"
        class="w-full py-4 font-bold rounded-2xl text-white text-lg flex justify-center items-center gap-3 transition bg-black/40 hover:bg-black/50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-credit-card"></i>
        <span>{{ loading ? 'Chargement...' : 'Procéder au paiement' }}</span>
      </button>

      <!-- Boutons retour/détails -->
      <div class="flex gap-3 mt-4">
        <router-link
          :to="{
            name: 'custom.visarequest.get',
          }"
          class="flex-1 text-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <i class="fas fa-arrow-left"></i> Retour
        </router-link>

        <router-link
          :to="{
            name: 'custom.visarequest.show.get',
            params: { visaRequestId: visaRequestId },
          }"
          class="flex-1 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <i class="fas fa-list"></i> Détails
        </router-link>
      </div>

      <!-- Erreur -->
      <p v-if="error" class="text-red-200 text-center font-medium">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </p>
    </div>
  </div>
</template>
