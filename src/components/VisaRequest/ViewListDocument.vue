<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useVisaStore } from '@/stores/visaStore'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import type { VisaRequestPayload, VisaResourceType } from '@/types/visa'
import { iconClassMap, statusMap } from '@/utils/dataMap'
import type { StatusMat } from '@/types/user'

// --- Stores & Router ---
const router = useRouter()
const userStore = useUserStore()
const visaStore = useVisaStore()
const visaRequestStore = useVisaRequestStore()

// --- State ---
const visaData = ref<VisaResourceType | null>(null)

// --- Lifecycle ---
onMounted(() => {
  if (visaStore.visa) {
    visaData.value = visaStore.visa.value
  } else {
    router.push({ name: 'custom.visarequest.create' })
    toastError('Aucune donnée de visa trouvée')
  }
})

// --- Helpers ---

/**
 * Récupère le texte complet du statut matrimonial.
 */
const getStatus = (status: string | null): string => {
  if (!status) return 'Non renseigné'
  return statusMap.get(status.toLowerCase() as StatusMat) || status
}

/**
 * Récupère la classe d'icône pour le statut matrimonial.
 */
const getIconClass = (status: string | null): string => {
  if (!status) return 'fas fa-question-circle'
  return iconClassMap.get(status.toLowerCase() as StatusMat) || 'fas fa-question-circle'
}

// --- Actions ---

/**
 * Lance la création de la demande de visa et redirige vers l'upload.
 */
const submitVisaRequest = async () => {
  try {
    if (!visaData.value) return toastError('Aucun visa sélectionné')

    const { id: userId } = userStore.user!
    const { user_id } = visaData.value

    if (userId !== user_id) {
      return toastError('Visa invalide pour cet utilisateur')
    }

    const payload: VisaRequestPayload = {
      user_id: userId,
      country_dest_name: visaData.value.country!,
      visa_type_name: visaData.value.visa_type!,
      nationality: visaData.value.nationality!,
    }

    let requestIdToUse: string;

    if (visaRequestStore.visaRequestId === null) {
      const res = await visaRequestStore.createVisaRequest(payload)
      if (!res || !res.data.id) throw new Error('Erreur lors de la création de la demande de visa')
      requestIdToUse = res.data.id;
      toastSuccess(res.message || 'Demande de visa créée avec succès')
    } else {
      requestIdToUse = visaRequestStore.visaRequestId;
    }

    router.push({
      name: 'custom.visarequest.create.upload',
      params: { visaRequestId: requestIdToUse },
    })

  } catch (e) {
    console.error('Erreur soumission demande de visa:', e)
    toastError("Une erreur est survenue lors du lancement de la procédure.")
  }
}

/**
 * Supprime le visa en cours et redirige vers la création.
 */
const deleteProcessing = () => {
  localStorage.removeItem('visa')
  localStorage.removeItem('visaRequestId')
  router.push({ name: 'custom.visarequest.create' })
  toastSuccess('Procédure de visa réinitialisée')
}
</script>

<template>
  <div class="w-full min-h-screen">
    <div class=" bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-gray-100">

      <header class="text-center w-full mb-8">
        <div class="inline-block p-3 bg-purple-50 rounded-full mb-3 border border-purple-200">
          <i class="fas fa-plane-departure text-4xl text-purple-700 animate-pulse duration-500"></i>
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-purple-600 tracking-tight">
          Votre Dossier est Prêt !
        </h1>
        <p class="text-gray-500 mt-1 text-base max-w-4xl mx-auto">
          **Vérifiez les détails finaux** avant de passer à l'étape d'envoi de vos pièces justificatives.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div class="p-4 rounded-xl bg-indigo-50 border border-indigo-200 shadow-md transition-all duration-300 transform hover:scale-[1.01] cursor-default min-h-[120px] flex flex-col justify-between">
          <div class="w-10 h-10 flex items-center justify-center rounded-full text-xl mb-1 shadow-md bg-indigo-600 text-white">
            <i class="fas fa-globe"></i>
          </div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-indigo-700">Destination</h2>
          <p class="text-xl font-bold tracking-tight text-gray-800 mt-0.5">{{ visaData?.country || 'N/A' }}</p>
        </div>

        <div class="p-4 rounded-xl bg-purple-50 border border-purple-200 shadow-md transition-all duration-300 transform hover:scale-[1.01] cursor-default min-h-[120px] flex flex-col justify-between">
          <div class="w-10 h-10 flex items-center justify-center rounded-full text-xl mb-1 shadow-md bg-purple-600 text-white">
            <i class="fas fa-passport"></i>
          </div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-purple-700">Type de Visa</h2>
          <p class="text-xl font-bold tracking-tight text-gray-800 mt-0.5">{{ visaData?.visa_type || 'N/A' }}</p>
        </div>

        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 shadow-md transition-all duration-300 transform hover:scale-[1.01] cursor-default min-h-[120px] flex flex-col justify-between">
          <div class="w-10 h-10 flex items-center justify-center rounded-full text-xl mb-1 shadow-md bg-rose-600 text-white">
            <i :class="getIconClass(visaData?.status_mat!)"></i>
          </div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-rose-700">Statut Matrimonial</h2>
          <p class="text-xl font-bold tracking-tight text-gray-800 mt-0.5">{{ getStatus(visaData?.status_mat!) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

        <div class="p-5 rounded-xl bg-green-50 border border-green-300 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-center min-h-[120px]">
          <h2 class="text-base font-semibold text-green-700 flex items-center mb-1">
            <i class="fas fa-money-bill-wave text-xl mr-2"></i>
            Coût de Traitement (Base)
          </h2>
          <p class="text-4xl font-extrabold text-green-600 mt-1">
            {{ visaData?.price_base || 0 }} <span class="text-2xl font-bold">FCFA</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">*Hors frais de dossier/service additionnels</p>
        </div>

        <div class="p-5 rounded-xl bg-yellow-50 border border-yellow-300 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-center min-h-[120px]">
          <h2 class="text-base font-semibold text-orange-700 flex items-center mb-1">
            <i class="fas fa-hourglass-half text-xl mr-2"></i>
            Délai Estimé
          </h2>
          <p class="text-4xl font-extrabold text-orange-600 mt-1">
            {{ visaData?.processing_duration_min || '?' }} - {{ visaData?.processing_duration_max || '?' }} <span class="text-2xl font-bold">jours</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">*Le délai peut varier selon la période et l'ambassade</p>
        </div>
      </div>

      <div class="w-full bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <i class="fas fa-list-alt text-purple-600 text-xl"></i> Checklist des Documents
        </h2>

        <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <li
            v-for="(doc, index) in visaData?.documents"
            :key="index"
            class="flex items-start bg-white p-3 rounded-lg border border-gray-100 shadow-sm transition-all duration-200"
          >
            <span
              class="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full font-bold text-xs mt-0.5"
            >
              {{ index + 1 }}
            </span>
            <p class="ml-3 text-gray-700 font-medium text-sm leading-tight">
              {{ doc }}
            </p>
          </li>
        </ul>
        <p v-if="!visaData?.documents || visaData.documents.length === 0" class="text-center text-gray-500 italic py-4 text-sm">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          Aucun document requis trouvé pour ce type de visa.
        </p>
      </div>

      <div class="flex flex-col-reverse md:flex-row w-full justify-end gap-4 pt-6 border-t border-gray-200">

        <button
          class="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-md"
          @click="deleteProcessing"
        >
          <i class="fas fa-redo-alt"></i>
          Réinitialiser
        </button>

        <button
          @click="submitVisaRequest"
          class="flex items-center justify-center gap-2 px-8 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-300/70 transform hover:scale-[1.01]"
        >
          <i class="fas fa-cloud-upload-alt"></i>
          Continuer vers l'Upload
        </button>
      </div>
    </div>
  </div>
</template>
