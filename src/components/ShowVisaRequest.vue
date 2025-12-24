<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useAppoitmentStore } from '@/stores/appoitmentStore'
import { useRoute } from 'vue-router'
import { toastError, toastSuccess } from '@/utils/toastConfig' // Ajout de toastSuccess
import { useUserStore } from '@/stores/userStore'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import type { Appoitment, StatusAppt } from '@/types/appoitment'
import type { StatusVisa, Visa, VisaRequest } from '@/types/visa'
import { useVisaStore } from '@/stores/visaStore'
import router from '@/router'
import {
  apptStatusColors,
  apptStatusMap,
  statusMap,
  visaRequestStatusColors,
  visaRequestStatusMap,
} from '@/utils/dataMap'
import DeleteModal from './DeleteModal.vue'

// Stores & Route
const route = useRoute()
const userStore = useUserStore()
const visaStore = useVisaStore()
const visaRequestStore = useVisaRequestStore()
const appoitmentStore = useAppoitmentStore()

const visaRequestId = String(route.params.visaRequestId)

// States
const visaRequest = ref<VisaRequest | null>(null)
const appointments = ref<Appoitment[]>([])
const newAppointment = ref({ scheduled_at: '', status: 'pending' })
const loading = ref(true)
const saving = ref(false)
const updatingStatus = ref(false)

// CRUD Appointments
const fetchAppointments = async () => {
  try {
    const res = await appoitmentStore.showAppoitmentByVisaRequest(visaRequestId as string)
    appointments.value = res?.data || []
  } catch (e) {
    console.error(e)
  }
}

const addAppointment = async () => {
  if (!newAppointment.value.scheduled_at) return toastError("La date et l'heure sont requises.")

  const selectedDate = new Date(newAppointment.value.scheduled_at)
  if (selectedDate <= new Date())
    return toastError('La date du rendez-vous doit être dans le futur.')

  saving.value = true
  try {
    const payload = {
      visa_request_id: visaRequestId,
      scheduled_at: newAppointment.value.scheduled_at,
      status: newAppointment.value.status as StatusAppt,
    }
    await appoitmentStore.createAppoitment(payload)
    newAppointment.value = { scheduled_at: '', status: 'pending' }
    await fetchAppointments()
    toastSuccess('Rendez-vous proposé avec succès.')
  } catch (e) {
    console.error(e)
    toastError("Erreur lors de l'ajout du rendez-vous.")
  } finally {
    saving.value = false
  }
}

const updateAppointment = async (id: string, data: Appoitment) => {
  // Vérif si la date fournie dans data est valide (seulement si elle est modifiée par l'Agent)
  if (data.scheduled_at) {
    const selectedDate = new Date(data.scheduled_at)
    if (selectedDate <= new Date())
      return toastError('La nouvelle date du rendez-vous doit être dans le futur.')
  }

  // Si c'est le client qui confirme (statut 'rescheduled'), il faut s'assurer que l'Agent est notifié ou que l'action est justifiée.
  if (data.status === 'rescheduled' && userStore.user?.role === 'custom') {
    toastSuccess('Rendez-vous confirmé. Veuillez attendre la validation finale.')
  }

  try {
    await appoitmentStore.editAppoitmentByUser(id, data)
    await fetchAppointments()
  } catch (e) {
    console.error(e)
    toastError('Erreur lors de la mise à jour du rendez-vous.')
  }
}

const isOpenDelete = ref(false)
const selectedId = ref<string>('')

const openDeleteAppoitment = (id: string) => {
  selectedId.value = id
  isOpenDelete.value = true
}

const deleteAppointment = async (id: string) => {
  try {
    await appoitmentStore.deleteAppoitment(id)
    isOpenDelete.value = false
    await fetchAppointments()
  } catch (e) {
    console.error(e)
    toastError('Erreur lors de la suppression du rendez-vous.')
  }
}

// Update VisaRequest status
const updateStatus = async (newStatus: StatusVisa) => {
  if (!visaRequest.value) return
  updatingStatus.value = true
  try {
    await visaRequestStore.editVisaRequest(visaRequestId, { status: newStatus })
    visaRequest.value.status = newStatus
  } catch (e) {
    console.error(e)
    toastError('Erreur lors de la mise à jour du statut.')
  } finally {
    updatingStatus.value = false
  }
}

const openPay = async (request: VisaRequest) => {
  const payload: Visa = {
    user_id: request.user.id!,
    country_dest_name: request.country_dest_name!,
    visa_type_name: request.visa_type_name!,
  }
  await visaStore.createStoreVisa(payload)
  router.push({
    name: 'custom.payment.store',
    params: { visaRequestId: request.id },
  })
}

const openDocument = async (request: VisaRequest) => {
  const payload: Visa = {
    user_id: request.user.id!,
    country_dest_name: request.country_dest_name!,
    visa_type_name: request.visa_type_name!,
  }
  await visaStore.createStoreVisa(payload)

  router.push({ name: 'custom.visarequest.create.upload', params: { visaRequestId: request.id } })
}

// Init
onMounted(async () => {
  try {
    const res = await visaRequestStore.showVisaRequest(visaRequestId)
    visaRequest.value = res?.data || null
    if (visaRequest.value) {
      await fetchAppointments()
    } else {
      toastError('Demande de visa introuvable.')
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-6 sm:py-8 md:py-10 px-3 sm:px-4">
    <div v-if="loading" class="text-purple-600 font-semibold text-lg sm:text-xl md:text-2xl py-10 sm:py-20">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement des détails...
    </div>

    <div
      v-else-if="visaRequest"
      class="w-full max-w-6xl space-y-4 sm:space-y-6 md:space-y-8 bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl shadow-lg sm:shadow-2xl border border-gray-100"
    >
      <header class="text-center pb-4 sm:pb-6 border-b border-gray-100">
        <h1
          class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 flex items-center justify-center gap-2 sm:gap-3"
        >
          <i class="fas fa-passport text-purple-600 text-lg sm:text-xl md:text-2xl lg:text-3xl"></i>
          <span>Détails de la Demande</span>
        </h1>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
          <p>Créée : {{ formatDateDayMonthYear(visaRequest.created_at!) }}</p>
          <p>Mise à jour : {{ formatDateDayMonthYear(visaRequest.updated_at!) }}</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div class="lg:col-span-1 space-y-4 sm:space-y-6">
          <section class="bg-purple-50 border border-purple-200 rounded-xl p-3 sm:p-4 md:p-5 shadow-lg">
            <h2 class="text-base sm:text-lg font-bold text-purple-700 mb-2 sm:mb-3 flex items-center gap-2">
              <i class="fas fa-info-circle"></i> Statut de la Demande
            </h2>

            <div class="flex flex-col gap-2 sm:gap-3">
              <span
                class="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-bold shadow-sm w-full text-center"
                :class="visaRequestStatusColors.get(visaRequest.status)"
              >
                {{ visaRequestStatusMap.get(visaRequest.status) }}
              </span>

              <div
                v-if="visaRequest.status === 'pending' && userStore.role === 'custom'"
                class="bg-red-100 border border-red-400 text-red-700 px-2 sm:px-3 py-2 rounded-lg font-medium text-xs sm:text-sm text-center"
              >
                <i class="fas fa-exclamation-circle mr-1"></i> Vous devez payer avant que notre
                service agent puisse traiter votre demande !
              </div>

              <div v-if="userStore.user?.role === 'agent' && visaRequest.status !== 'approved'">
                <label for="status-update" class="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >Mettre à jour le statut :</label
                >
                <select
                  id="status-update"
                  v-model="visaRequest.status"
                  @change="updateStatus(visaRequest.status)"
                  class="rounded-lg text-xs sm:text-sm border-purple-300 focus:ring-purple-500 focus:border-purple-500 w-full px-2 sm:px-3 py-2 shadow-sm bg-white"
                  :disabled="updatingStatus"
                >
                  <option value="processing">Traitement en cours</option>
                  <option value="rejected">Refusé</option>
                  <option value="approved">Approuvé (Rendez-vous)</option>
                </select>
              </div>
            </div>
          </section>

          <div class="space-y-3 sm:space-y-4 pt-2">
            <router-link
              v-if="userStore.role !== 'admin'"
              :to="{
                name:
                  userStore.role === 'agent'
                    ? 'agent.users.show.visarequest.show.document'
                    : 'custom.visarequest.show.document',
                params: { visaRequestId: visaRequest.id },
                query: { status: visaRequest.status },
              }"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold sm:font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <i class="fas fa-file-alt"></i> <span class="truncate">Voir/Gérer Documents</span>
            </router-link>

            <router-link
              v-if="
                userStore.role !== 'admin' &&
                visaRequest.status !== 'pending' &&
                visaRequest.status !== 'created'
              "
              :to="{
                name:
                  userStore.role === 'agent'
                    ? 'agent.chat.user.show.visarequest.show'
                    : 'custom.chat',
                params: { visaRequestId: visaRequest.id, userId: visaRequest.user.id },
              }"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold sm:font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <i class="fas fa-comments"></i> <span class="truncate">Ouvrir Discussion</span>
            </router-link>

            <button
              v-if="visaRequest.status === 'created' && userStore.role === 'custom'"
              @click="openDocument(visaRequest)"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold sm:font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <i class="fa-solid fa-cloud-upload-alt"></i> <span class="truncate">Téléverser documents</span>
            </button>

            <button
              v-if="visaRequest.status === 'pending' && userStore.role === 'custom'"
              @click="openPay(visaRequest)"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold sm:font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <i class="fas fa-credit-card"></i> <span>Payer maintenant</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          <section class="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-md border border-gray-200">
            <h2
              class="text-base sm:text-lg md:text-xl font-bold text-purple-600 mb-3 sm:mb-4 flex items-center gap-2 border-b-2 border-purple-100 pb-2"
            >
              <i class="fas fa-passport"></i> Informations Visa
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-tag text-purple-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Type de visa</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base truncate">
                    {{ visaRequest.visa_type_name || 'N/A' }}
                  </p>
                </div>
              </div>

              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-align-left text-purple-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Description</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
                    {{ visaRequest.visa_type_desc || '—' }}
                  </p>
                </div>
              </div>

              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-map-marker-alt text-purple-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Pays d'origine</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base truncate">
                    {{ visaRequest.country_origin_name || 'N/A' }}
                  </p>
                </div>
              </div>

              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-plane-departure text-purple-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Destination</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base truncate">
                    {{ visaRequest.country_dest_name || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-md border border-gray-200">
            <h2
              class="text-base sm:text-lg md:text-xl font-bold text-orange-600 mb-3 sm:mb-4 flex items-center gap-2 border-b-2 border-orange-100 pb-2"
            >
              <i class="fas fa-id-card"></i> Informations Client
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-user text-orange-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Nom complet</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base truncate">
                    {{ visaRequest.profil.first_name }} {{ visaRequest.profil.last_name }}
                  </p>
                </div>
              </div>

              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-envelope text-orange-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Email</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base truncate">{{ visaRequest.user.email }}</p>
                </div>
              </div>

              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-phone text-orange-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Téléphone</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base">{{ visaRequest.profil.phone }}</p>
                </div>
              </div>

              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-heart text-orange-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Statut matrimonial</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base">
                    {{ statusMap.get(visaRequest.profil.status_mat) }}
                  </p>
                </div>
              </div>

              <div
                class="p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-2 sm:gap-3"
              >
                <i class="fas fa-birthday-cake text-orange-600 mt-1 text-sm sm:text-base"></i>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm text-gray-500">Âge</p>
                  <p class="font-semibold text-gray-800 text-sm sm:text-base">
                    {{
                      visaRequest.profil.date_of_birth
                        ? new Date().getFullYear() -
                          new Date(visaRequest.profil.date_of_birth).getFullYear()
                        : 'N/A'
                    }}
                    ans
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            class="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-md border border-gray-200"
            v-if="visaRequest.status === 'approved'"
          >
            <h2
              class="text-base sm:text-lg md:text-xl font-bold text-green-600 mb-3 sm:mb-4 flex items-center gap-2 border-b-2 border-green-100 pb-2"
            >
              <i class="fas fa-calendar-alt"></i> Gestion des Rendez-vous
            </h2>

            <div v-if="appointments.length" class="space-y-2 sm:space-y-3">
              <div
                v-for="a in appointments"
                :key="a.id"
                class="bg-green-50 border border-green-200 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:shadow-sm transition"
              >
                <div>
                  <p class="font-bold text-green-700 flex items-center gap-2 text-sm sm:text-base">
                    <i class="fas fa-clock"></i>
                    {{ formatDateDayMonthYear(a.scheduled_at) }}
                  </p>
                  <p class="mt-1 text-xs sm:text-sm text-gray-600">
                    Statut :
                    <span
                      class="font-medium px-2 py-0.5 rounded-full text-xs"
                      :class="apptStatusColors.get(a.status)"
                    >
                      {{ apptStatusMap.get(a.status) }}
                    </span>
                  </p>
                </div>

                <div class="flex gap-2 items-center">
                  <select
                    v-if="userStore.user?.role === 'custom' && a.status === 'pending'"
                    v-model="a.status"
                    @change="updateAppointment(a.id!, a)"
                    class="border rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white shadow-sm focus:ring-green-500 focus:border-green-500 flex-1 sm:flex-none"
                  >
                    <option value="pending">En attente</option>
                    <option value="rescheduled">Confirmer</option>
                  </select>
                  <span
                    v-else-if="userStore.user?.role === 'custom' && a.status === 'rescheduled'"
                    class="text-green-600 font-semibold text-xs sm:text-sm"
                    >Confirmé</span
                  >

                  <button
                    v-if="userStore.user?.role === 'agent'"
                    @click="openDeleteAppoitment(a.id!)"
                    class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm transition"
                    title="Supprimer le rendez-vous"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <p v-else class="text-gray-500 italic text-xs sm:text-sm p-3 sm:p-4 text-center bg-gray-50 rounded-lg">
              <i class="fas fa-calendar-times mr-1"></i>
              Aucun rendez-vous proposé pour le moment.
            </p>

            <div
              v-if="userStore.user?.role === 'agent'"
              class="mt-4 sm:mt-6 p-3 sm:p-4 md:p-5 bg-gray-100 rounded-xl border border-gray-200"
            >
              <h3 class="font-bold text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Proposer un nouveau créneau :</h3>
              <input
                v-model="newAppointment.scheduled_at"
                type="datetime-local"
                class="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 w-full mb-2 sm:mb-3 bg-white shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
              />
              <button
                @click="addAppointment"
                :disabled="saving"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg shadow transition text-sm sm:text-base"
              >
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ saving ? 'Ajout...' : 'Ajouter ce rendez-vous' }}
              </button>
            </div>
          </section>
        </div>
      </div>

      <router-link
        :to="{
          name:
            userStore.role === 'agent'
              ? 'agent.users.show.visarequest'
              : userStore.role === 'custom'
                ? 'custom.visarequest.get'
                : 'admin.visarequest',
        }"
        class="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 w-fit text-sm sm:text-base"
      >
        <i class="fas fa-arrow-left text-base sm:text-xl"></i>
        <span class="font-medium">Retour à la liste</span>
      </router-link>

      <DeleteModal
        v-if="isOpenDelete"
        :val="'ce rendez-vous'"
        @close="isOpenDelete = false"
        @confirm="deleteAppointment(selectedId)"
      />
    </div>

    <div v-else class="text-red-500 font-medium py-10 sm:py-20 text-sm sm:text-base text-center px-4">
      <i class="fas fa-exclamation-triangle mr-2"></i> Aucune demande de visa trouvée.
    </div>
  </div>
</template>
