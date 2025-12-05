<template>
  <div class="flex md:h-[87vh] overflow-hidden bg-gray-100 antialiased text-sm">
    <aside
      class="flex-shrink-0 w-80 md:w-64 lg:w-80 bg-white border-r border-gray-200 shadow-2xl shadow-gray-200/50 flex flex-col transition-all duration-300 ease-in-out"
      :class="{
        // Mobile (sm) : Afficher en plein écran si showUsersList est true, sinon cacher
        'flex w-full': showUsersList && isMobile,
        hidden: !showUsersList && isMobile,
        // Desktop (md+) : Toujours visible
        flex: !isMobile,
      }"
    >
      <header class="h-16 flex items-center px-6 border-b border-gray-100/80 bg-white">
        <button
          v-if="isMobile && selectedUser"
          @click="handleBackToUsersList"
          class="mr-3 text-gray-500 hover:text-purple-600"
        >
          <i class="fas fa-arrow-left text-xl"></i>
        </button>
        <h2 class="text-xl font-extrabold text-purple-800 tracking-tight truncate">
          <i class="fas fa-users-crown text-purple-500 mr-2"></i>
          Clients
        </h2>
      </header>

      <div
        class="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white"
      >
        <div v-if="loading" class="flex justify-center py-8 text-gray-500 gap-2">
          <i class="fas fa-spinner animate-spin text-xl"></i>
          Chargement...
        </div>
        <div v-else-if="error" class="text-red-500 text-center p-4">{{ error }}</div>

        <TransitionGroup name="list" tag="ul" class="space-y-1">
          <li
            v-for="user in users"
            :key="user.id"
            @click="selectUserHandler(user)"
            class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition duration-200 ease-in-out select-none shadow-sm"
            :class="{
              'bg-purple-50/70 text-purple-800 font-semibold border-l-4 border-purple-500':
                selectedUser?.id === user.id,
              'hover:bg-gray-50/70 bg-white text-gray-800': selectedUser?.id !== user.id,
            }"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-md"
              :class="selectedUser?.id === user.id ? 'bg-purple-500' : 'bg-gray-400'"
            >
              {{ user.name ? user.name.charAt(0).toUpperCase() : '?' }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium truncate">{{ user.name }}</h3>
              <p class="text-gray-500 text-xs truncate mt-0.5">{{ user.email }}</p>
            </div>
            <span v-if="selectedUser?.id === user.id" class="text-purple-500 ml-2 text-lg">
              <i class="fas fa-chevron-right"></i>
            </span>
          </li>
        </TransitionGroup>
      </div>
    </aside>

    <aside
      :class="{
        'w-72 md:w-64 lg:w-72': selectedUser && !isMobile,
        'w-0': !selectedUser && !isMobile,
        hidden: isMobile, // Masquer sur mobile, l'overlay gère l'affichage
      }"
      class="flex-shrink-0 bg-white border-r border-gray-200 shadow-lg shadow-gray-100/50 flex-col transition-all duration-300 overflow-hidden sm:flex"
    >
      <header class="h-16 flex items-center px-4 border-b border-gray-100/80 bg-white">
        <h3 class="text-lg font-semibold text-gray-800 truncate">
          <i class="fas fa-passport text-orange-500 mr-2"></i>
          Demandes ({{ idVisaRequest.length }})
        </h3>
      </header>

      <div
        v-if="selectedUser"
        class="flex flex-col flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white"
      >
        <div v-if="idVisaRequest.length === 0" class="p-6 text-center text-gray-400 italic">
          <p>Aucune demande pour ce client.</p>
        </div>
        <ul v-else class="space-y-1 p-3">
          <li
            v-for="id in idVisaRequest"
            :key="id"
            @click="selectVisaRequestHandler(id)"
            @mouseenter="(e) => showVisaPopover(e, id)"
            @mousemove="moveVisaPopover"
            @mouseleave="hideVisaPopover"
            @focus="(e) => showVisaPopover(e as unknown as MouseEvent, id)"
            @blur="hideVisaPopover"
            class="p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out select-none shadow-sm"
            :class="{
              'bg-orange-50/70 text-orange-800 font-medium border-r-4 border-orange-500':
                selectedVisaRequest === id,
              'hover:bg-gray-50/70 bg-white text-gray-700': selectedVisaRequest !== id,
            }"
          >
            <div class="flex items-center justify-between">
              <p class="truncate font-medium">Demande</p>
              <i
                v-if="selectedVisaRequest === id"
                class="fas fa-comment-dots text-orange-500 ml-2"
              ></i>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">
              Statut:
              <span class="font-semibold">{{
                visaRequestStatusMap.get(visaRequests.find((v) => v.id === id)?.status || 'pending')
              }}</span>
            </p>
          </li>
        </ul>
      </div>
    </aside>

    <main
      class="flex-1 flex flex-col min-w-0 h-full bg-gray-50 transition-all duration-300 ease-in-out"
      :class="{
        // Mobile : Afficher si la liste des utilisateurs est masquée ET l'overlay des demandes est masqué
        'flex w-full': !showUsersList && !showVisaRequestList && isMobile,
        hidden: showUsersList && isMobile,
        // Desktop : Toujours visible
        flex: !isMobile,
      }"
    >
      <div
        v-if="!selectedUser"
        class="flex-1 sm:h-[calc(100vh-4rem-4rem)] flex items-center justify-center bg-gray-100/70"
      >
        <div class="text-center text-gray-500 max-w-sm p-6 bg-white rounded-xl shadow-2xl">
          <i class="fas fa-hand-pointer text-6xl text-purple-300 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2 text-gray-700">Démarrez l'assistance</h3>
          <p>
            Veuillez sélectionner un **Client** dans la première colonne pour afficher ses demandes
            et commencer à chatter.
          </p>
        </div>
      </div>

      <div v-else class="flex flex-col h-full w-full">
        <header
          class="flex-shrink-0 h-16 bg-white border-b border-gray-200/70 flex items-center justify-between px-6 shadow-sm z-10"
        >
          <div class="flex items-center">
            <button
              v-if="isMobile && !showUsersList"
              @click="handleBackToUsersList"
              class="mr-3 text-gray-500 hover:text-purple-600"
              title="Retour à la liste des clients"
            >
              <i class="fas fa-arrow-left text-xl"></i>
            </button>
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm bg-purple-500 mr-3 shadow-md"
            >
              {{ selectedInitial }}
            </div>
            <div class="flex flex-col min-w-0">
              <h3 class="text-lg font-bold text-gray-800 truncate leading-none">
                {{ selectedUser.name }}
              </h3>
              <span
                v-if="selectedVisaRequest"
                class="text-xs font-semibold text-orange-600 truncate leading-none mt-0.5"
              >
                Demande
              </span>
              <span v-else class="text-xs font-medium text-gray-500 truncate leading-none mt-0.5">
                Sélectionnez une demande
              </span>
            </div>
          </div>
          <router-link
            v-if="selectedVisaRequest"
            class="text-gray-500 hover:text-orange-600 transition duration-150"
            :to="{
              name: 'agent.users.show.visarequest.show',
              params: { visaRequestId: selectedVisaRequest, userId: selectedUser.id },
            }"
            title="Voir les détails de la demande"
          >
            <i class="fas fa-info-circle text-xl"></i>
          </router-link>
        </header>

        <div
          v-if="!selectedVisaRequest"
          class="flex-1 flex items-center justify-center text-gray-500 bg-gray-100/70"
        >
          <div class="text-center p-6 bg-white rounded-xl shadow-lg max-w-xs">
            <i class="fas fa-comment-slash text-4xl text-gray-300 mb-3"></i>
            <p class="text-sm">
              Veuillez sélectionner une demande de visa pour ouvrir l'historique de chat.
            </p>
            <button
              v-if="isMobile && idVisaRequest.length > 0"
              @click="showVisaRequestList = true"
              class="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm shadow-md hover:bg-orange-600 transition"
            >
              <i class="fas fa-list-ul mr-2"></i> Voir les Demandes
            </button>
          </div>
        </div>

        <div
          v-else
          ref="chatContainer"
          class="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 bg-[#f0f2f5] chat-scroll"
          @scroll="onScroll"
        >
          <div
            v-if="messages.length === 0"
            class="flex-1 flex items-center justify-center text-gray-400 italic text-center"
          >
            <div class="p-4 bg-gray-50 rounded-xl shadow-inner-sm border border-gray-100">
              <i class="fas fa-history mr-2"></i>
              Démarrez une nouvelle conversation.
            </div>
          </div>

          <div v-else class="flex flex-col gap-5 lg:max-w-screen-lg">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="relative flex group"
              :class="msg?.source == 'agent' ? 'justify-end' : 'justify-start'"
            >
              <div
                :class="[
                  'p-3 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] break-words whitespace-pre-wrap relative text-sm shadow-xl transition duration-150 ease-out',
                  msg?.source == 'agent'
                    ? 'bg-[#d9fdd3] text-gray-900 rounded-xl rounded-tr-sm shadow-green-500/10'
                    : 'bg-white text-gray-800 rounded-xl rounded-tl-sm shadow-gray-300/50 border border-gray-100',
                ]"
              >
                <div
                  v-if="msg?.source === 'agent' && msg.user?.id !== userStore.user?.id"
                  class="text-xs font-semibold mb-1 text-purple-600"
                >
                  {{ msg.user?.name || 'Autre Agent' }}
                </div>

                <Transition name="fade-in">
                  <div
                    v-if="msg?.source == 'agent' && msg.user?.id === userStore.user?.id"
                    class="absolute z-20 transition-all duration-200 -top-8 right-0 opacity-0 group-hover:opacity-100"
                  >
                    <div
                      class="bg-gray-800/90 backdrop-blur-sm p-1 rounded-md text-white flex space-x-1 shadow-lg shadow-gray-900/10 -mr-2"
                    >
                      <button
                        @click.stop="editMessage(msg)"
                        class="text-xs w-6 h-6 rounded-full hover:bg-gray-700/70 flex items-center justify-center cursor-pointer transition"
                        title="Modifier"
                      >
                        <i class="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        @click.stop="openDelete(msg.id!)"
                        class="text-xs w-6 h-6 rounded-full hover:bg-gray-700/70 flex items-center justify-center cursor-pointer transition"
                        title="Supprimer"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </Transition>

                <p class="leading-relaxed pr-8">
                  <span
                    v-if="isEdit && selectMessage?.id === msg?.id"
                    class="text-xs text-yellow-500 font-semibold mr-1"
                    >(Modification)</span
                  >
                  {{ msg.content }}
                </p>

                <div
                  class="text-[10px] absolute right-2 bottom-1 flex items-center"
                  :class="msg?.source == 'agent' ? 'text-gray-500' : 'text-gray-400'"
                >
                  <span class="mt-0.5">{{ formatHour(msg.updated_at) }}</span>
                  <i
                    v-if="msg?.source === 'agent' && msg.user?.id === userStore.user?.id"
                    :class="[
                      'fas ml-0.5',
                      msg.status === 'sending' ? 'fa-clock' : 'fa-check-double',
                      msg.status === 'sending'
                        ? 'text-gray-500'
                        : msg.status === 'sent'
                          ? 'text-gray-500'
                          : msg.status === 'failed'
                            ? 'text-red-500'
                            : 'text-blue-500',
                    ]"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer
          class="flex-shrink-0 p-4 bg-white border-t border-gray-200/70 flex gap-3 items-end shadow-inner-top z-20 relative"
        >
          <div
            v-if="isEdit && selectMessage"
            class="absolute bottom-full left-0 right-0 p-2 bg-yellow-500/90 backdrop-blur-sm text-sm text-white flex items-center justify-between z-30 shadow-xl"
          >
            <span>
              <i class="fas fa-edit mr-2"></i>
              Modification en cours :
              <span class="font-semibold">{{ selectMessage.content.substring(0, 30) }}...</span>
            </span>
            <button
              @click="
                () => {
                  isEdit = false
                  selectMessage = null
                  newMessage = ''
                }
              "
              class="text-white opacity-90 hover:opacity-100 transition"
              title="Annuler la modification"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <textarea
            v-model="newMessage"
            :rows="Math.min(5, Math.max(1, newMessage.split('\n').length))"
            placeholder="Répondre au client ici..."
            class="flex-1 resize-none border-0 bg-gray-50 rounded-xl px-4 py-3 shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition duration-150 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white text-gray-800"
            @keyup.enter.prevent="isEdit ? editMessageSend() : sendMessage()"
            :disabled="!selectedVisaRequest"
          ></textarea>

          <button
            @click="isEdit ? editMessageSend() : sendMessage()"
            :disabled="!newMessage.trim() && !isEdit"
            class="bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full font-medium flex items-center justify-center disabled:opacity-50 transition duration-200 shadow-xl shadow-purple-500/30 flex-shrink-0"
            title="Envoyer le message"
          >
            <i :class="isEdit ? 'fas fa-check' : 'fas fa-paper-plane'"></i>
          </button>
        </footer>
      </div>
    </main>

    <Transition name="pop-up">
      <div
        v-if="visaPopoverVisible && hoveredVisaDetails"
        class="absolute z-50 max-w-sm rounded-xl shadow-2xl p-4 bg-white/95 backdrop-blur-sm border border-gray-200 text-sm transform transition-all duration-300"
        :style="{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }"
        @mouseenter="cancelHidePopover"
        @mouseleave="hideVisaPopover"
      >
        <h3 class="font-bold text-gray-800 mb-2 border-b pb-1 border-gray-100">
          <i class="fas fa-tag mr-1 text-orange-500"></i>
          Détails Demande
        </h3>
        <div class="space-y-1 text-gray-700">
          <div v-if="hoveredVisaDetails.status">
            <span class="font-semibold">Status:</span>
            <span
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-xs font-medium',
                hoveredVisaDetails.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700',
              ]"
            >
              {{ visaRequestStatusMap.get(hoveredVisaDetails.status) }}
            </span>
          </div>
          <div v-if="(hoveredVisaDetails as any).updated_at">
            <span class="font-semibold">Soumise:</span>
            {{ formatDate((hoveredVisaDetails as any).updated_at) }}
          </div>
          <div v-if="(hoveredVisaDetails as any).visa_type_name">
            <span class="font-semibold">Type:</span>
            {{ (hoveredVisaDetails as any).visa_type_name }}
          </div>
          <div v-if="(hoveredVisaDetails as any).country_dest_name">
            <span class="font-semibold">Pays:</span>
            {{ (hoveredVisaDetails as any).country_dest_name }}
          </div>
          <router-link
            class="text-purple-600 hover:text-purple-700 font-medium transition duration-150 block mt-2"
            :to="{
              name: 'agent.users.show.visarequest.show',
              params: { visaRequestId: hoveredVisaDetails.id, userId: selectedUser?.id },
            }"
            @click="visaPopoverVisible = false"
          >
            <i class="fas fa-eye mr-1"></i>
            Voir la Fiche Complète
          </router-link>
        </div>
      </div>
    </Transition>

    <DeleteModal
      v-if="isOpenDelete"
      :val="'ce message'"
      @close="isOpenDelete = false"
      @confirm="deleteMessage(selectedId)"
    />

    <Transition name="slide-left">
      <aside
        v-if="isMobile && selectedUser && showVisaRequestList"
        class="fixed inset-0 z-40 bg-white shadow-2xl flex flex-col w-full"
      >
        <header class="h-16 flex items-center px-4 border-b border-gray-100/80 bg-white">
          <button
            @click="showVisaRequestList = false"
            class="mr-4 text-gray-600 hover:text-orange-600 transition"
          >
            <i class="fas fa-arrow-left text-xl"></i>
          </button>
          <h3 class="text-lg font-semibold text-gray-800 truncate">
            <i class="fas fa-passport text-orange-500 mr-2"></i>
            Demandes de {{ selectedUser.name }}
          </h3>
        </header>

        <div
          class="flex flex-col flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white"
        >
          <ul class="space-y-1 p-3">
            <li
              v-for="id in idVisaRequest"
              :key="id"
              @click="selectVisaRequestHandler(id, true)"
              class="p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out select-none shadow-sm"
              :class="{
                'bg-orange-50/70 text-orange-800 font-medium border-r-4 border-orange-500':
                  selectedVisaRequest === id,
                'hover:bg-gray-50/70 bg-white text-gray-700': selectedVisaRequest !== id,
              }"
            >
              <div class="flex items-center justify-between">
                <p class="truncate font-medium">Demande #{{ id.substring(0, 8) }}</p>
                <i
                  v-if="selectedVisaRequest === id"
                  class="fas fa-comment-dots text-orange-500 ml-2"
                ></i>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Statut:
                <span class="font-semibold">{{
                  visaRequestStatusMap.get(
                    visaRequests.find((v) => v.id === id)?.status || 'pending',
                  )
                }}</span>
              </p>
            </li>
          </ul>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount, computed, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useChatStore } from '@/stores/chatStore'
import type { UserRegister } from '@/types/user'
import type { Chat as ChatType } from '@/types/chat'
import type { VisaRequest } from '@/types/visa'
import { api } from '@/services/api'
import { toastError } from '@/utils/toastConfig'
import { useRoute } from 'vue-router'
import { visaRequestStatusMap } from '@/utils/dataMap'
import DeleteModal from '@/components/DeleteModal.vue'

// --- Stores & Route ---
const route = useRoute()
const userStore = useUserStore()
const chatStore = useChatStore()
const visaRequestStore = useVisaRequestStore()

// --- Local Types ---
type MessageSource = 'agent' | 'custom'
type Chat = ChatType & {
  source?: MessageSource
  user?: { id: string; name: string; email?: string }
}

// --- State ---
const users = ref<UserRegister[]>([])
const visaRequests = ref<VisaRequest[]>([])
const idVisaRequest = ref<string[]>([])
const selectedUser = ref<UserRegister | null>(null)
const selectedVisaRequest = ref<string | null>(null)
const messages = ref<Chat[]>([])
const selectMessage = ref<Chat | null>(null)
const isEdit = ref(false)
const newMessage = ref('')
const loading = ref(true)
const error = ref<string | null>(null)

const chatContainer = ref<HTMLDivElement | null>(null)
const isUserScrolling = ref(false)
const SCROLL_THRESHOLD = 50
let pollingInterval: ReturnType<typeof setInterval> | null = null

// Popover Visa
const visaPopoverVisible = ref(false)
const hoveredVisaId = ref<string | null>(null)
const hoveredVisaDetails = ref<VisaRequest | null>(null)
const popoverPos = ref({ top: 0, left: 0 })
let hideTimeout: ReturnType<typeof setTimeout> | null = null

// Delete Modal
const isOpenDelete = ref(false)
const selectedId = ref('')

// Responsive State
const isMobile = ref(window.innerWidth < 640)
// showUsersList: Vrai si la Colonne 1 (Clients) doit être affichée (Plein écran sur mobile, ou toujours sur desktop)
const showUsersList = ref(!isMobile.value)
// showVisaRequestList: Vrai si l'Overlay de la Colonne 2 (Demandes) doit être affiché sur mobile
const showVisaRequestList = ref(false)

// --- Computed ---
const selectedInitial = computed(() =>
  selectedUser.value?.name ? selectedUser.value.name.charAt(0).toUpperCase() : '?',
)

// --- Utility Functions ---
const formatDate = (dateStr?: string | Date | null): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return isNaN(d.getTime())
    ? ''
    : new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d)
}

const formatHour = (dateStr?: string | Date | null): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return isNaN(d.getTime())
    ? ''
    : new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(d)
}

// --- Chat Logic (Scroll, Polling, Select) ---
const scrollToBottom = (smooth = false) => {
  const el = chatContainer.value
  if (!el || isUserScrolling.value) return
  el.scrollTo({
    top: el.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  })
}

const onScroll = () => {
  const el = chatContainer.value
  if (!el) return
  isUserScrolling.value = el.scrollTop < el.scrollHeight - el.clientHeight - SCROLL_THRESHOLD
}

const startPolling = () => {
  stopPolling()
  if (!selectedVisaRequest.value) return
  pollingInterval = setInterval(async () => {
    if (selectedVisaRequest.value) await loadMessages(selectedVisaRequest.value, true)
  }, 3000)
}

const stopPolling = () => {
  if (pollingInterval !== null) clearInterval(pollingInterval)
  pollingInterval = null
}

const handleBackToUsersList = () => {
  showUsersList.value = true // Retourne à la liste des clients
  showVisaRequestList.value = false // S'assure que l'overlay est fermé
  // selectedUser.value = null // Optionnel: pour désélectionner l'utilisateur, mais je le garde sélectionné pour l'historique
}

const selectUserHandler = async (user: UserRegister) => {
  await selectUser(user)
  if (isMobile.value) {
    showUsersList.value = false // Masque la liste des clients
    // En mobile, si l'utilisateur a des demandes, on montre l'overlay des demandes.
    if (idVisaRequest.value.length > 0) {
      showVisaRequestList.value = true
    }
  }
}

const selectVisaRequestHandler = async (visaId: string, isMobileSelection = false) => {
  await loadMessages(visaId)
  if (isMobileSelection && isMobile.value) {
    showVisaRequestList.value = false // Ferme l'overlay des demandes après sélection
  }
}

const selectUser = async (user: UserRegister) => {
  if (selectedUser.value?.id === user.id) return
  selectedUser.value = user
  messages.value = []
  selectedVisaRequest.value = null
  stopPolling()

  try {
    const res = await visaRequestStore.showVisaRequestByUser(user.id!)
    visaRequests.value = res?.data ?? []
    idVisaRequest.value = visaRequests.value.map((v) => v.id)

    // Sur desktop, si des demandes existent, on sélectionne la première
    if (idVisaRequest.value.length > 0 && !isMobile.value) {
      await loadMessages(idVisaRequest.value[0])
    }
  } catch (err) {
    console.error('Erreur get visa ids:', err)
    visaRequests.value = []
    idVisaRequest.value = []
  }
}

const loadMessages = async (visaId: string, isPolling = false) => {
  if (!selectedUser.value) return

  // Stoppe et relance le polling si la demande change
  if (selectedVisaRequest.value !== String(visaId)) {
    stopPolling()
    selectedVisaRequest.value = String(visaId)
    startPolling()
  } else {
    selectedVisaRequest.value = String(visaId)
  }

  const currentScrollPosition = chatContainer.value?.scrollTop || 0
  const currentScrollHeight = chatContainer.value?.scrollHeight || 0

  try {
    const customId = selectedUser.value.id
    const res = await api.get(`/message/showbyvisarequest/${customId}/${visaId}`)

    const agentMessages = (res.data.agentMessages ?? []) as Chat[]
    const customMessages = (res.data.customMessages ?? []) as Chat[]

    const agentWithMeta: Chat[] = agentMessages.map((m) => ({ ...m, source: 'agent' }))
    const customWithMeta: Chat[] = customMessages.map((m) => ({ ...m, source: 'custom' }))

    const allMessages = [...agentWithMeta, ...customWithMeta].map((m) => ({
      ...m,
      updated_at: m.updated_at ? new Date(m.updated_at).toISOString() : new Date().toISOString(),
      created_at: m.created_at ? new Date(m.created_at).toISOString() : new Date().toISOString(),
    }))

    messages.value = allMessages.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )

    await nextTick()

    if (!isPolling || !isUserScrolling.value) {
      scrollToBottom(true)
    } else if (chatContainer.value) {
      const newScrollHeight = chatContainer.value.scrollHeight
      const scrollDifference = newScrollHeight - currentScrollHeight
      chatContainer.value.scrollTop = currentScrollPosition + scrollDifference
    }
  } catch (err) {
    console.error('Erreur loadMessages:', err)
    messages.value = []
  }
}

// --- Message CRUD ---
const sendMessage = async () => {
  const content = newMessage.value.trim()
  if (!content || !selectedUser.value || !selectedVisaRequest.value) return

  const tempId = Date.now().toString()
  const tempMessage: Chat = {
    id: tempId,
    user_id: userStore.user?.id || '',
    visa_request_id: selectedVisaRequest.value,
    content,
    status: 'sending',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    source: 'agent',
    user: {
      id: userStore.user?.id || '',
      name: userStore.user?.name || 'Agent',
      email: userStore.user?.email || '',
    }, // Info agent pour l'affichage immédiat
  }

  messages.value.push(tempMessage)
  scrollToBottom(true)
  newMessage.value = ''

  try {
    const res = await chatStore.createChat({
      ...tempMessage,
      user_id: tempMessage.user_id,
      status: 'sent',
    })
    if (res?.data?.id) {
      messages.value = messages.value.map((m) =>
        String(m.id) === String(tempId)
          ? {
              ...m,
              id: res.data.id,
              status: 'sent',
              updated_at: res.data.updated_at ?? m.updated_at,
            }
          : m,
      )
    }
  } catch (err) {
    messages.value = messages.value.map((m) =>
      String(m.id) === String(tempId) ? { ...m, status: 'failed' } : m,
    )
    console.error('Erreur sendMessage:', err)
  }
}

const openDelete = (id: string) => {
  isOpenDelete.value = true
  selectedId.value = id
}

const deleteMessage = async (id: string) => {
  try {
    await chatStore.deleteChat(id)
    messages.value = messages.value.filter((m) => String(m.id) !== String(id))
    isOpenDelete.value = false

    if (selectMessage.value?.id === id) {
      isEdit.value = false
      selectMessage.value = null
      newMessage.value = ''
    }
  } catch (err) {
    console.error('Erreur deleteMessage:', err)
  }
}

const editMessage = (msg: Chat) => {
  // Seuls les messages de l'agent actuel peuvent être édités
  if (msg.user?.id !== userStore.user?.id || msg.source !== 'agent') return
  isEdit.value = true
  newMessage.value = msg.content
  selectMessage.value = msg
}

const editMessageSend = async () => {
  if (!selectMessage.value || !newMessage.value.trim())
    return toastError('Le message ne peut pas être vide')
  if (selectMessage.value.user?.id !== userStore.user?.id) return

  try {
    await chatStore.editChat(selectMessage.value.id!, {
      ...selectMessage.value,
      user_id: userStore.user?.id,
      content: newMessage.value.trim(),
    })

    messages.value = messages.value.map((m) =>
      String(m.id) === String(selectMessage.value?.id)
        ? { ...m, content: newMessage.value.trim(), updated_at: new Date().toISOString() }
        : m,
    )
    newMessage.value = ''
    isEdit.value = false
    selectMessage.value = null
  } catch (err) {
    console.error('Erreur editMessageSend:', err)
  }
}

// --- Popover Logic ---
const showVisaPopover = (e: MouseEvent, id: string) => {
  if (hideTimeout) clearTimeout(hideTimeout)
  hoveredVisaId.value = id
  hoveredVisaDetails.value = visaRequests.value.find((v) => v.id === id) ?? null
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()

  let leftPos = rect.right + window.scrollX + 10
  const topPos = rect.top + window.scrollY

  // Ajustement pour éviter de sortir de l'écran (350px = largeur max du popover)
  if (leftPos + 350 > window.innerWidth) {
    leftPos = rect.left + window.scrollX - 350
  }

  popoverPos.value = { top: topPos, left: leftPos }
  visaPopoverVisible.value = true
}

// Neutralisation de moveVisaPopover (qui causait des instabilités)
const moveVisaPopover = () => {
  // Laisse cette fonction vide pour stabiliser le popover
}

const hideVisaPopover = () => {
  if (hideTimeout) clearTimeout(hideTimeout)
  // Délai pour permettre le mouvement de la souris vers le popover
  hideTimeout = setTimeout(() => {
    visaPopoverVisible.value = false
    hoveredVisaId.value = null
    hoveredVisaDetails.value = null
  }, 100)
}

const cancelHidePopover = () => hideTimeout && clearTimeout(hideTimeout)

const handleResize = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 640

  // Si on passe de mobile à desktop
  if (wasMobile && !isMobile.value) {
    showUsersList.value = true // Afficher les clients
    showVisaRequestList.value = false // Cacher l'overlay
    // Si un utilisateur est sélectionné, charger sa première demande
    if (selectedUser.value && !selectedVisaRequest.value && idVisaRequest.value.length > 0) {
      loadMessages(idVisaRequest.value[0])
    }
  }
}

// --- Lifecycle & Init ---
watch(isMobile, (newIsMobile) => {
  if (newIsMobile) {
    // Si passage en mobile
    if (selectedUser.value && !selectedVisaRequest.value && idVisaRequest.value.length > 0) {
      // Si un client est sélectionné mais pas de demande: montrer la liste des demandes
      showUsersList.value = false
      showVisaRequestList.value = true
    } else if (selectedVisaRequest.value) {
      // Si un chat est actif, masquer la liste des clients
      showUsersList.value = false
      showVisaRequestList.value = false
    } else {
      // Par défaut, montrer la liste des clients
      showUsersList.value = true
      showVisaRequestList.value = false
    }
  } else {
    // Si passage en desktop
    showUsersList.value = true
    showVisaRequestList.value = false
  }
})

onMounted(async () => {
  window.addEventListener('resize', handleResize)

  try {
    // 1. Charger tous les utilisateurs
    const res = await userStore.getCustoms()
    users.value = res?.data ?? []
    loading.value = false

    // 2. Vérifier si un UserID est dans la route (Deep link)
    const userIdInRoute = route.params.userId as string
    const visaRequestIdInRoute = route.params.visaRequestId as string

    if (userIdInRoute) {
      const user = users.value.find((u) => u.id === userIdInRoute)
      if (user) {
        await selectUser(user)

        // 3. Charger la demande spécifique si présente
        if (visaRequestIdInRoute && idVisaRequest.value.includes(visaRequestIdInRoute)) {
          await loadMessages(visaRequestIdInRoute)
          if (isMobile.value) {
            showUsersList.value = false
            showVisaRequestList.value = false // Chat affiché
          }
        } else if (isMobile.value && idVisaRequest.value.length > 0) {
          showUsersList.value = false
          showVisaRequestList.value = true // Liste des demandes affichée
        }
      }
    } else {
      // Par défaut, s'assurer que la liste des utilisateurs est visible
      showUsersList.value = true
    }
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors du chargement des utilisateurs.'
  }
})

onBeforeUnmount(() => {
  stopPolling()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Les styles restent inchangés et sont valides */

.bg-\[\#f0f2f5\] {
  background-color: #f0f2f5;
}

.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(160, 174, 192, 0.7) transparent;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(160, 174, 192, 0.7);
  border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.shadow-inner-top {
  box-shadow:
    0 -1px 3px 0 rgba(0, 0, 0, 0.05),
    0 -1px 2px 0 rgba(0, 0, 0, 0.03);
}

/* Animations de transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.pop-up-enter-active {
  transition: all 0.3s ease-out;
}
.pop-up-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.pop-up-enter-from,
.pop-up-leave-to {
  transform: translateY(-10px) scale(0.95);
  opacity: 0;
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* Animation pour l'overlay mobile */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
}
</style>
