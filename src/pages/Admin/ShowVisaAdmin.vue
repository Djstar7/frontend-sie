<template>
  <div class="p-6 md:p-10 min-h-screen bg-gray-100 antialiased">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-extrabold text-gray-800">
          <i class="fas fa-passport text-orange-500 mr-2"></i>
          Fiche d'Éligibilité Visa
        </h1>
        <router-link
          :to="{ name: 'admin.visa' }"
          class="text-orange-600 hover:text-orange-700 transition duration-150 flex items-center gap-2 font-medium"
        >
          <i class="fas fa-arrow-left"></i> Retour à la liste
        </router-link>
      </header>

      <div v-if="loading" class="text-center py-20 text-xl text-orange-500">
        <i class="fas fa-spinner fa-spin mr-3"></i> Chargement des détails du visa...
      </div>

      <div v-else class="space-y-8">
        <div class="bg-white rounded-xl shadow-2xl shadow-orange-100/50 border border-gray-100 p-6 md:p-8">
          <div class="flex items-center justify-between border-b pb-4 mb-4">
            <div class="flex items-center gap-4">
              <i class="fas fa-globe-americas text-4xl text-orange-500"></i>
              <div>
                <p class="text-sm font-medium text-gray-500 uppercase">Destination</p>
                <h2 class="text-2xl font-bold text-gray-900">{{ form.country_name || 'N/A' }}</h2>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-500 uppercase">Type de Visa</p>
              <span class="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full shadow-md">
                {{ form.visa_type_name || 'N/A' }}
              </span>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button
              @click="goToEdit(visaId!)"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-150 flex items-center gap-2 font-semibold text-sm"
              title="Modifier cette éligibilité"
            >
              <i class="fas fa-edit"></i> Modifier
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-col justify-between">
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-tag text-2xl text-green-500"></i>
              <p class="text-sm font-medium text-gray-500">Prix de Base</p>
            </div>
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(form.price_base) }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-col justify-between">
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-child text-2xl text-purple-500"></i>
              <p class="text-sm font-medium text-gray-500">Prix par Enfant</p>
            </div>
            <p class="text-3xl font-bold" :class="form.price_per_child ? 'text-purple-600' : 'text-gray-400'">
              {{ form.price_per_child ? formatCurrency(form.price_per_child) : 'N/A' }}
            </p>
          </div>

          <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-col justify-between">
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-clock text-2xl text-yellow-500"></i>
              <p class="text-sm font-medium text-gray-500">Délai de Traitement</p>
            </div>
            <p class="text-xl font-bold text-gray-900">
              {{ form.processing_duration_min }} - {{ form.processing_duration_max }}
              <span class="text-base text-gray-500 font-normal">Jours</span>
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-5 border-b pb-3 flex items-center gap-2">
            <i class="fas fa-user-check text-orange-500"></i> Critères d'Éligibilité
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <i class="fas fa-calendar-alt text-2xl text-indigo-500"></i>
              <div>
                <p class="text-sm text-gray-500">Âge Minimum</p>
                <p class="text-xl font-bold text-gray-900">{{ form.min_age }} ans</p>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <i class="fas fa-calendar-times text-2xl text-indigo-500"></i>
              <div>
                <p class="text-sm text-gray-500">Âge Maximum</p>
                <p class="text-xl font-bold text-gray-900">{{ form.max_age }} ans</p>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <i class="fas fa-heart text-2xl text-pink-500"></i>
              <div>
                <p class="text-sm text-gray-500">Statut Matrimonial</p>
                <p class="text-xl font-bold text-gray-900 capitalize">{{ statusMap.get(form.status_mat!) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-5 border-b pb-3 flex items-center gap-2">
            <i class="fas fa-file-alt text-orange-500"></i> Documents Requis
          </h3>

          <div v-if="form.documents.length === 0" class="text-center py-4 text-gray-500 italic">
            <i class="fas fa-exclamation-circle mr-1"></i> Aucun document spécifié pour cette éligibilité.
          </div>
          <ul v-else class="space-y-3">
            <li
              v-for="(doc, index) in form.documents"
              :key="index"
              class="flex items-start bg-gray-50 p-3 rounded-lg border border-gray-200 transition duration-150"
            >
              <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full mr-3">
                <i class="fas fa-check text-orange-500 text-sm"></i>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-800">{{ doc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVisaEligibilityStore } from '@/stores/useVisaEligibilityStore'
import type { VisaResourceType } from '@/types/visa'
import { statusMap } from '@/utils/dataMap'
import type { StatusMat } from '@/types/user'

interface VisaForm {
  country_name: string
  visa_type_name: string
  price_base: number | null
  price_per_child: number | null
  processing_duration_min: number | null
  processing_duration_max: number | null
  status_mat: StatusMat | null
  min_age: number | null
  max_age: number | null
  documents: string[]
}

const route = useRoute()
const router = useRouter()
const visaEligibilitiesStore = useVisaEligibilityStore()

const visaId = route.params.id as string
const loading = ref(true)

const form = ref<VisaForm>({
  country_name: '',
  visa_type_name: '',
  price_base: null,
  price_per_child: null,
  processing_duration_min: null,
  processing_duration_max: null,
  status_mat: null,
  min_age: null,
  max_age: null,
  documents: [],
})

const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}



const goToEdit = (id: string) => {
  router.push({ name: 'admin.visa.edit', params: { id } })
}

const loadVisaData = async () => {
  loading.value = true
  try {
    const res = await visaEligibilitiesStore.getEligibilityDetails(visaId!)
    const visa = res.data as VisaResourceType & { min_age: number; max_age: number; }

    if (!visa) {
      console.error('La réponse du serveur est vide')
      return
    }

    form.value = {
      country_name: visa.country ?? '',
      visa_type_name: visa.visa_type ?? '',
      price_base: parseFloat(visa.price_base?.toString() || '0'),
      price_per_child: visa.price_per_child ? parseFloat(visa.price_per_child.toString()) : null,
      processing_duration_min: visa.processing_duration_min,
      processing_duration_max: visa.processing_duration_max,
      status_mat: visa.status_mat as StatusMat,
      min_age: visa.min_age,
      max_age: visa.max_age,
      documents: visa.documents || [],
    }
  } catch (e) {
    console.error('Erreur lors du chargement du visa :', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadVisaData()
})
</script>
