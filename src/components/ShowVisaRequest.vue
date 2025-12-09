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
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
    <div v-if="loading" class="text-purple-600 font-semibold animate-spin-slow text-2xl py-20">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement des détails...
    </div>

    <div
      v-else-if="visaRequest"
      class="w-full max-w-6xl space-y-8 bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100"
    >
      <header class="text-center pb-6 border-b border-gray-100">
        <h1
          class="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center justify-center gap-3"
        >
          <i class="fas fa-passport text-purple-600"></i>
          Détails de la Demande
        </h1>

        <div class="flex items-center justify-center gap-6 text-sm text-gray-500 mt-3">
          <p>Créée : {{ formatDateDayMonthYear(visaRequest.created_at!) }}</p>
          <p>Mise à jour : {{ formatDateDayMonthYear(visaRequest.updated_at!) }}</p>
        </div>
      </header>

      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-6">
          <section class="bg-purple-50 border border-purple-200 rounded-xl p-5 shadow-lg">
            <h2 class="text-lg font-bold text-purple-700 mb-3 flex items-center gap-2">
              <i class="fas fa-info-circle"></i> Statut de la Demande
            </h2>

            <div class="flex flex-col gap-3">
              <span
                class="px-4 py-2 text-base rounded-lg font-bold shadow-sm w-full text-center"
                :class="visaRequestStatusColors.get(visaRequest.status)"
              >
                {{ visaRequestStatusMap.get(visaRequest.status) }}
              </span>

              <div
                v-if="visaRequest.status === 'pending' && userStore.role === 'custom'"
                class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg font-medium text-sm text-center"
              >
                <i class="fas fa-exclamation-circle mr-1"></i> Vous devez payer avant que notre
                service agent puisse trater votre demande !
              </div>

              <div v-if="userStore.user?.role === 'agent' && visaRequest.status !== 'approved'">
                <label for="status-update" class="block text-sm font-medium text-gray-700 mb-1"
                  >Mettre à jour le statut :</label
                >
                <select
                  id="status-update"
                  v-model="visaRequest.status"
                  @change="updateStatus(visaRequest.status)"
                  class="rounded-lg text-sm border-purple-300 focus:ring-purple-500 focus:border-purple-500 w-full px-3 py-2 shadow-sm bg-white"
                  :disabled="updatingStatus"
                >
                  <option value="processing">Traitement en cours</option>
                  <option value="rejected">Refusé</option>
                  <option value="approved">Approuvé (Rendez-vous)</option>
                </select>
              </div>
            </div>
          </section>

          <div class="space-y-4 pt-2">
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
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <i class="fas fa-file-alt"></i> Voir/Gérer les Documents
            </router-link>

            <router-link
              v-if="userStore.role !== 'admin' && visaRequest.status !== 'pending'"
              :to="{
                name:
                  userStore.role === 'agent'
                    ? 'agent.chat.user.show.visarequest.show'
                    : 'custom.chat',
                params: { visaRequestId: visaRequest.id, userId: visaRequest.user.id },
              }"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <i class="fas fa-comments"></i> Ouvrir la Discussion
            </router-link>

            <button
              v-if="visaRequest.status === 'created' && userStore.role === 'custom'"
              @click="openDocument(visaRequest)"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-cloud-upload-alt"></i> Téléverser les documents
            </button>

            <button
              v-if="visaRequest.status === 'pending' && userStore.role === 'custom'"
              @click="openPay(visaRequest)"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <i class="fas fa-credit-card"></i> Payer maintenant
            </button>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-8">
          <section class="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h2
              class="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2 border-b-2 border-purple-100 pb-2"
            >
              <i class="fas fa-passport"></i> Informations Visa
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 flex items-start gap-3"
              >
                <i class="fas fa-tag text-purple-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Type de visa</p>
                  <p class="font-semibold text-gray-800">
                    {{ visaRequest.visa_type_name || 'N/A' }}
                  </p>
                </div>
              </div>

              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 flex items-start gap-3"
              >
                <i class="fas fa-align-left text-purple-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Description</p>
                  <p class="font-semibold text-gray-800 text-justify">
                    {{ visaRequest.visa_type_desc || '—' }}
                  </p>
                </div>
              </div>

              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 flex items-start gap-3"
              >
                <i class="fas fa-map-marker-alt text-purple-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Pays d’origine</p>
                  <p class="font-semibold text-gray-800">
                    {{ visaRequest.country_origin_name || 'N/A' }}
                  </p>
                </div>
              </div>

              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500 flex items-start gap-3"
              >
                <i class="fas fa-plane-departure text-purple-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Destination</p>
                  <p class="font-semibold text-gray-800">
                    {{ visaRequest.country_dest_name || 'N/A' }}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h2
              class="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2 border-b-2 border-orange-100 pb-2"
            >
              <i class="fas fa-id-card"></i> Informations Client
            </h2>

            <div class="grid md:grid-cols-2 gap-4">
              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-3"
              >
                <i class="fas fa-user text-orange-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Nom complet</p>
                  <p class="font-semibold text-gray-800">
                    {{ visaRequest.profil.first_name }} {{ visaRequest.profil.last_name }}
                  </p>
                </div>
              </div>

              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-3"
              >
                <i class="fas fa-envelope text-orange-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <p class="font-semibold text-gray-800">{{ visaRequest.user.email }}</p>
                </div>
              </div>

              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-3"
              >
                <i class="fas fa-phone text-orange-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Téléphone</p>
                  <p class="font-semibold text-gray-800">{{ visaRequest.profil.phone }}</p>
                </div>
              </div>

              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-3"
              >
                <i class="fas fa-heart text-orange-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Statut matrimonial</p>
                  <p class="font-semibold text-gray-800">
                    {{ statusMap.get(visaRequest.profil.status_mat) }}
                  </p>
                </div>
              </div>

              <div
                class="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500 flex items-start gap-3"
              >
                <i class="fas fa-birthday-cake text-orange-600 mt-1"></i>
                <div>
                  <p class="text-sm text-gray-500">Âge</p>
                  <p class="font-semibold text-gray-800">
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
            class="bg-white rounded-xl p-6 shadow-md border border-gray-200"
            v-if="visaRequest.status === 'approved'"
          >
            <h2
              class="text-xl font-bold text-green-600 mb-4 flex items-center gap-2 border-b-2 border-green-100 pb-2"
            >
              <i class="fas fa-calendar-alt"></i> Gestion des Rendez-vous
            </h2>

            <div v-if="appointments.length" class="space-y-3">
              <div
                v-for="a in appointments"
                :key="a.id"
                class="bg-green-50 border border-green-200 p-4 rounded-lg flex justify-between items-center hover:shadow-sm transition"
              >
                <div>
                  <p class="font-bold text-green-700 flex items-center gap-2">
                    <i class="fas fa-clock"></i>
                    {{ formatDateDayMonthYear(a.scheduled_at) }}
                  </p>
                  <p class="mt-1 text-sm text-gray-600">
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
                    class="border rounded-lg px-3 py-1 text-sm bg-white shadow-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="pending">En attente</option>
                    <option value="rescheduled">Confirmer</option>
                  </select>
                  <span
                    v-else-if="userStore.user?.role === 'custom' && a.status === 'rescheduled'"
                    class="text-green-600 font-semibold text-sm"
                    >Confirmé</span
                  >

                  <button
                    v-if="userStore.user?.role === 'agent'"
                    @click="openDeleteAppoitment(a.id!)"
                    class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
                    title="Supprimer le rendez-vous"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <p v-else class="text-gray-500 italic text-sm p-4 text-center bg-gray-50 rounded-lg">
              <i class="fas fa-calendar-times mr-1"></i>
              Aucun rendez-vous proposé pour le moment.
            </p>

            <div
              v-if="userStore.user?.role === 'agent'"
              class="mt-6 p-5 bg-gray-100 rounded-xl border border-gray-200"
            >
              <h3 class="font-bold text-gray-700 mb-3">Proposer un nouveau créneau :</h3>
              <input
                v-model="newAppointment.scheduled_at"
                type="datetime-local"
                class="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3 bg-white shadow-sm focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                @click="addAppointment"
                :disabled="saving"
                class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg shadow transition"
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
        class="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition mt-6 pt-4 border-t border-gray-200 w-fit"
      >
        <i class="fas fa-arrow-left text-xl"></i>
        <span class="font-medium">Retour à la liste des demandes</span>
      </router-link>

      <DeleteModal
        v-if="isOpenDelete"
        :val="'ce rendez-vous'"
        @close="isOpenDelete = false"
        @confirm="deleteAppointment(selectedId)"
      />
    </div>

    <div v-else class="text-red-500 font-medium py-20">
      <i class="fas fa-exclamation-triangle mr-2"></i> Aucune demande de visa trouvée.
    </div>
  </div>
</template>
