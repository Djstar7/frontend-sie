<template>
  <div class="flex md:h-[87vh] overflow-hidden antialiased text-sm">
    <aside
      class="flex-shrink-0 flex-col w-full xs:w-72 sm:w-64 md:w-10 lg:w-40 xl:w-60 border-r border-gray-200  shadow-xl shadow-gray-200/50 transition-all duration-300 absolute md:relative z-20 pt-7 h-full"
      :class="{
        flex: showList,
        'hidden md:flex': !showList,
      }"
    >
      <header class="h-16 flex items-center px-4 border-b border-gray-100/80 flex-shrink-0">
        <h2
          class="text-xl md:text-base lg:text-xl font-semibold text-gray-800 tracking-tight flex items-center"
        >
          <i class="fas fa-comments text-blue-500 mr-2 lg:mr-2"></i>
          <span class="md:hidden lg:inline">Mes Demandes</span>
        </h2>
      </header>

      <div
        v-if="idVisaRequest.length"
        class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white"
      >
        <TransitionGroup name="list" tag="ul">
          <li
            v-for="id in idVisaRequest"
            :key="id"
            @click="selectAndLoadMessages(id)"
            @mouseenter="(e) => showVisaPopover(e, id)"
            @mousemove="moveVisaPopover"
            @mouseleave="hideVisaPopover"
            @focus="(e) => showVisaPopover(e as unknown as MouseEvent, id)"
            @blur="hideVisaPopover"
            class="flex items-center p-3 sm:p-4 cursor-pointer border-b border-gray-100 transition duration-150 ease-in-out select-none"
            :class="{
              'bg-blue-50/70 hover:bg-blue-100 border-l-4 border-blue-500':
                selectedVisaRequest === id,
              'hover:bg-gray-50/70 border-l-4 border-transparent': selectedVisaRequest !== id,
            }"
          >
            <div
              class="flex-shrink-0 w-8 h-8 md:w-8 md:h-10 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs sm:text-sm mr-3 md:mr-0 lg:mr-4"
              :class="selectedVisaRequest === id ? 'bg-blue-500' : 'bg-gray-400'"
            >
              #
            </div>

            <div class="flex-1 min-w-0 md:hidden lg:block">
              <p class="font-medium text-gray-800 truncate text-sm">Demande</p>
              <p class="text-xs text-gray-500 truncate mt-0.5">Cliquez pour ouvrir le chat</p>
            </div>

            <span
              v-if="selectedVisaRequest === id"
              class="text-xs font-semibold text-blue-600 ml-2 md:ml-0 lg:ml-2"
              title="Chat Actif"
            >
              <i class="fas fa-check-circle"></i>
            </span>
          </li>
        </TransitionGroup>
      </div>

      <div v-else class="p-6 md:p-3 lg:p-6 text-center text-gray-400 italic mt-4">
        <p class="text-sm md:hidden lg:block">Vous n'avez pas encore de demandes.</p>
        <p class="text-xs mt-1 md:hidden lg:block">C'est ici qu'elles apparaîtront.</p>
        <p class="text-sm hidden md:block lg:hidden">Aucune demande.</p>
      </div>
    </aside>

    <main
      class="flex-1 flex flex-col min-w-0 h-full transition-all duration-300"
      :class="{
        // Correction UX : Sur mobile, n'afficher la conversation QUE si showList est faux
        hidden: showList && isMobile,
        flex: !showList || !isMobile,
      }"
    >
      <div
        v-if="!selectedVisaRequest"
        class="flex-1 flex items-center justify-center bg-gray-100/70 p-4 sm:p-6"
      >
        <div class="text-center text-gray-500 max-w-xs sm:max-w-sm px-4">
          <i class="fas fa-laptop-code text-5xl sm:text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-lg sm:text-xl font-semibold mb-2">Bienvenue au Centre d'Assistance</h3>
          <p class="text-sm sm:text-base">
            Sélectionnez une demande dans la barre latérale pour démarrer la discussion.
          </p>
          <button
            v-if="isMobile"
            @click="showList = true"
            class="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm shadow-md hover:bg-orange-600 transition w-full"
          >
            <i class="fas fa-list-ul mr-2"></i> Voir les Demandes
          </button>
        </div>
      </div>

      <div v-else class="flex flex-col h-full w-full">
        <header
          class="flex-shrink-0 h-16 bg-white border-b border-gray-200/70 flex items-center justify-between px-4 lg:px-6 shadow-sm z-10"
        >
          <div class="flex items-center min-w-0">
            <button
              v-if="isMobile"
              @click="showList = true"
              class="mr-3 text-gray-600 hover:text-orange-600 transition p-1"
              title="Afficher la liste des demandes"
            >
              <i class="fas fa-arrow-left text-lg sm:text-xl"></i>
            </button>
            <h3 class="text-base sm:text-lg font-medium text-gray-800 truncate md:hidden">
              Chat Demande
            </h3>
            <span
              class="hidden md:flex items-center text-lg font-medium text-gray-800 truncate"
              title="Demande de Visa"
            >
              <i class="fas fa-file-alt text-blue-500 mr-2"></i>
              Demande
            </span>
            <span
              class="ml-3 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full hidden sm:inline-block flex-shrink-0"
            >
              Ouvert
            </span>
          </div>
          <router-link
            class="text-gray-500 hover:text-blue-600 transition duration-150 flex-shrink-0 p-1"
            :to="{
              name: 'custom.visarequest.show.get',
              params: { visaRequestId: selectedVisaRequest },
            }"
            title="Voir les détails de la demande"
          >
            <i class="fas fa-info-circle text-xl sm:text-2xl"></i>
          </router-link>
        </header>

        <div
          ref="chatContainer"
          class="flex-1 overflow-y-auto bg-[#e5ddd5] chat-scroll"
          @scroll="onScroll"
        >
          <div
            class="space-y-3 mx-auto sm:space-y-4 max-w-full md:max-w-4xl lg:max-w-6xl xl:max-w-7xl"
          >
            <div v-if="messages.length === 0" class="flex justify-center pt-4 sm:pt-8">
              <div
                class="px-4 py-1.5 rounded-lg bg-[#fff8e1] text-xs sm:text-sm text-gray-700 shadow-sm font-medium"
              >
                <i class="fas fa-history mr-1"></i>
                Commencez la conversation.
              </div>
            </div>

            <div
              v-for="msg in messages"
              :key="msg?.id"
              class="relative flex group"
              :class="msg?.source == 'custom' ? 'justify-end' : 'justify-start'"
            >
              <Transition name="fade-in">
                <div
                  v-if="msg?.source == 'custom'"
                  class="absolute z-20 transition-all duration-200 right-0 top-0"
                  :class="{
                    '-mt-4 -mr-2': msg?.content.length <= 50,
                    '-mt-8': msg?.content.length > 50,
                    'opacity-100 md:opacity-0 md:group-hover:opacity-100':
                      highlightedMessageId !== msg.id,
                  }"
                >
                  <div
                    class="bg-gray-800/90 backdrop-blur-sm p-1 rounded-md text-white flex space-x-0.5 shadow-lg shadow-gray-900/10"
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

              <div
                @click="selectMessageToComment(msg)"
                :class="[
                  'p-2.5 sm:p-3 max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] break-words whitespace-pre-wrap relative text-sm sm:text-base shadow-md cursor-pointer transition-all duration-100 ease-out',
                  msg?.source == 'custom'
                    ? 'bg-[#d9fdd3] text-gray-900 rounded-xl rounded-tr-sm ml-4'
                    : 'bg-white text-gray-900 rounded-xl rounded-tl-sm mr-4 border border-gray-100/60',
                  highlightedMessageId === msg?.id ? 'highlight-flash' : '',
                ]"
              >
                <p class="leading-relaxed pr-10 min-w-[70px]">
                  <span
                    v-if="isEdit && selectMessage?.id === msg?.id"
                    class="text-xs text-orange-600 font-semibold mr-1"
                    >(Modification)</span
                  >
                  {{ msg?.content }}
                </p>

                <div
                  class="text-[10px] sm:text-[11px] absolute right-1 bottom-0.5 flex items-center"
                  :class="msg?.source === 'custom' ? 'text-gray-500' : 'text-gray-400'"
                >
                  <span class="mt-0.5">{{ formatHour(msg?.updated_at) }}</span>
                  <i
                    v-if="msg?.source === 'custom'"
                    :class="[
                      'fas ml-0.5',
                      msg.status === 'sending' ? 'fa-clock' : 'fa-check-double',
                      msg.status === 'sending' || msg.status === 'sent'
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
          class="flex-shrink-0 p-3 sm:p-4 bg-gray-100 border-t border-gray-200/70 flex gap-2 sm:gap-3 items-end shadow-inner-top z-10 relative"
        >
          <div
            v-if="isEdit && selectMessage"
            class="absolute bottom-full left-0 right-0 p-2 bg-yellow-500/80 backdrop-blur-sm text-xs sm:text-sm text-white flex items-center justify-between z-20 shadow-lg"
          >
            <span class="truncate pr-4">
              <i class="fas fa-edit mr-2"></i>
              Modification de message :
              <span class="font-semibold">{{ selectMessage.content.substring(0, 30) }}...</span>
            </span>
            <button
              @click="
                () => {
                  newMessage = ''
                  isEdit = false
                  selectMessage = null
                }
              "
              class="text-white opacity-70 hover:opacity-100 transition flex-shrink-0"
              title="Annuler la modification"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <textarea
            v-model="newMessage"
            :rows="Math.min(5, Math.max(1, newMessage.split('\n').length))"
            type="text"
            placeholder="Écrivez un message ici..."
            class="flex-1 resize-none border-0 bg-white rounded-xl px-4 py-2.5 shadow-inner-sm focus:ring-2 focus:ring-blue-400/50 focus:border-blue-500 focus:outline-none transition duration-150 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white text-sm sm:text-base"
            @keyup.enter.prevent="isEdit ? editMessageSend() : sendMessage()"
            :disabled="!selectedVisaRequest"
          ></textarea>
          <button
            @click="isEdit ? editMessageSend() : sendMessage()"
            :disabled="!newMessage.trim() && !isEdit"
            class="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full font-medium flex items-center justify-center disabled:opacity-50 transition duration-200 shadow-lg shadow-blue-500/30 flex-shrink-0"
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
        class="absolute z-50 max-w-xs sm:max-w-sm rounded-xl shadow-2xl p-4 bg-white/95 backdrop-blur-sm border border-gray-100 text-xs sm:text-sm transform transition-all duration-300"
        :style="{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }"
        @mouseenter="cancelHidePopover"
        @mouseleave="hideVisaPopover"
      >
        <h3 class="font-bold text-gray-800 mb-2 border-b pb-1 border-gray-100 text-sm sm:text-base">
          <i class="fas fa-tag mr-1 text-blue-500"></i>
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
            class="text-blue-600 hover:text-blue-700 font-medium transition duration-150 block mt-2 text-xs sm:text-sm"
            :to="{
              name: 'custom.visarequest.show.get',
              params: { visaRequestId: hoveredVisaDetails.id },
            }"
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
  </div>
</template>

<script setup lang="ts">
// ... Le script VUE.JS est conservé à l'identique car la logique
// de bascule (showList) et de détection mobile (isMobile)
// est déjà correctement implémentée pour supporter les changements du template.

import { ref, onMounted, nextTick, onBeforeUnmount, watch, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useChatStore } from '@/stores/chatStore'
import { useRoute } from 'vue-router'
import type { Chat as ChatType } from '@/types/chat'
import type { VisaRequest } from '@/types/visa'
import { api } from '@/services/api'
import { toastError } from '@/utils/toastConfig'
import { visaRequestStatusMap } from '@/utils/dataMap'
import DeleteModal from '@/components/DeleteModal.vue'

type MessageSource = 'agent' | 'custom'
type Chat = ChatType & { source?: MessageSource }

const chatStore = useChatStore()
const userStore = useUserStore()
const visaRequestStore = useVisaRequestStore()
const route = useRoute()

const idVisaRequest = ref<string[]>([])
const visaRequest = ref<VisaRequest[]>([])
const selectedVisaRequest = ref<string | null>(null)
const messages = ref<Chat[]>([])
const newMessage = ref<string>('')
const selectMessage = ref<Chat | null>(null)
const isEdit = ref<boolean>(false)
const loading = ref<boolean>(true)

const chatContainer = ref<HTMLDivElement | null>(null)
const isUserScrolling = ref<boolean>(false)
const SCROLL_THRESHOLD = 50
let pollingInterval: ReturnType<typeof setInterval> | null = null

const visaPopoverVisible = ref<boolean>(false)
const hoveredVisaId = ref<string | null>(null)
const hoveredVisaDetails = ref<VisaRequest | null>(null)
const popoverPos = ref<{ top: number; left: number }>({ top: 40, left: 40 })
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const highlightedMessageId = ref<string | null>(null)

const showList = ref(false)
const isMobile = computed(() => window.innerWidth < 768)

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

const scrollToBottom = (smooth = false) => {
  const el = chatContainer.value
  if (!el) return
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

const showVisaPopover = (e: MouseEvent, id: string) => {
  if (hideTimeout) clearTimeout(hideTimeout)
  hoveredVisaId.value = id
  hoveredVisaDetails.value = visaRequest.value.find((v) => v.id === id) ?? null
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  popoverPos.value = { top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX }
  visaPopoverVisible.value = true
}

const moveVisaPopover = (e: MouseEvent) => {
  if (!visaPopoverVisible.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  popoverPos.value = { top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX }
}

const hideVisaPopover = () => {
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    visaPopoverVisible.value = false
    hoveredVisaId.value = null
    hoveredVisaDetails.value = null
  }, 200)
}

const cancelHidePopover = () => {
  if (hideTimeout) clearTimeout(hideTimeout)
}

const selectAndLoadMessages = (id: string) => {
  loadMessages(id)
  if (isMobile.value) {
    showList.value = false
  }
}

const loadMessages = async (visaRequestId: string) => {
  const currentScrollPosition = chatContainer.value?.scrollTop || 0
  const currentScrollHeight = chatContainer.value?.scrollHeight || 0

  try {
    selectedVisaRequest.value = visaRequestId
    const customId = userStore.user?.id
    const res = await api.get(`/message/showbyvisarequest/${customId}/${visaRequestId}`)
    const agentMessages: Chat[] = res.data.agentMessages ?? []
    const customMessages: Chat[] = res.data.customMessages ?? []
    const agentWithMeta: Chat[] = agentMessages.map((m) => ({ ...m, source: 'agent' }))
    const customWithMeta: Chat[] = customMessages.map((m) => ({ ...m, source: 'custom' }))

    const all = [...agentWithMeta, ...customWithMeta].map((m: Chat) => ({
      ...m,
      created_at: m.created_at ? new Date(m.created_at).toISOString() : new Date().toISOString(),
    }))
    messages.value = all.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )

    await nextTick()

    if (!isUserScrolling.value || messages.value.length === 0) {
      scrollToBottom(true)
    } else if (chatContainer.value) {
      const newScrollHeight = chatContainer.value.scrollHeight
      const scrollDifference = newScrollHeight - currentScrollHeight
      chatContainer.value.scrollTop = currentScrollPosition + scrollDifference
    }
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
    messages.value = []
  }
}

const startPolling = () => {
  stopPolling()
  if (!selectedVisaRequest.value) return
  pollingInterval = setInterval(() => {
    if (selectedVisaRequest.value) loadMessages(selectedVisaRequest.value)
  }, 3000)
}

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

watch(selectedVisaRequest, (newVal) => {
  stopPolling()
  if (newVal) startPolling()
})

watch(
  () => messages.value.length,
  async (newLength, oldLength) => {
    if (newLength > oldLength) {
      await nextTick()
      if (!isUserScrolling.value) {
        scrollToBottom(true)
      }
    }
  },
)

const sendMessage = async () => {
  const content = newMessage.value.trim()
  if (!content || !selectedVisaRequest.value) return

  const tempId = Date.now().toString()
  const tempMessage: Chat = {
    id: tempId,
    user_id: userStore.user?.id ?? '',
    visa_request_id: selectedVisaRequest.value,
    content,
    status: 'sending',
    created_at: new Date().toISOString(),
    source: 'custom',
  }

  messages.value.push(tempMessage)
  scrollToBottom(true)

  try {
    await chatStore.createChat({
      user_id: userStore.user?.id,
      visa_request_id: selectedVisaRequest.value,
      content,
      status: 'sent',
    })
  } catch (error) {
    messages.value = messages.value.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m))
    console.error("Erreur lors de l'envoi du message:", error)
  } finally {
    newMessage.value = ''
  }
}

const isOpenDelete = ref(false)
const selectedId = ref<string>('')
const openDelete = (id: string) => {
  isOpenDelete.value = true
  selectedId.value = id
}

const deleteMessage = async (id: string) => {
  try {
    await chatStore.deleteChat(id)
    messages.value = messages.value.filter((m) => m?.id !== id)
    isOpenDelete.value = false

    if (selectMessage.value?.id === id) {
      isEdit.value = false
      selectMessage.value = null
      newMessage.value = ''
    }
  } catch (err) {
    console.error(err)
  }
}

const editMessage = (msg: Chat) => {
  isEdit.value = true
  newMessage.value = msg.content
  selectMessage.value = msg
}

const editMessageSend = async () => {
  if (!selectMessage.value) return
  const content = newMessage.value.trim()
  if (!content) return toastError('Message vide')

  try {
    await chatStore.editChat(selectMessage.value.id!, {
      ...selectMessage.value,
      user_id: selectMessage.value.user?.id,
      content,
    })
    messages.value = messages.value.map((m) =>
      m.id === selectMessage.value?.id ? { ...m, content } : m,
    )
    newMessage.value = ''
    isEdit.value = false
    selectMessage.value = null
  } catch (err) {
    console.error(err)
  } finally {
    scrollToBottom(true)
  }
}

const selectMessageToComment = (msg: Chat) => {
  highlightedMessageId.value = msg.id ?? null
  setTimeout(() => {
    highlightedMessageId.value = null
  }, 1500)
}

const handleResize = () => {
  // Sur un redimensionnement, si ce n'est plus mobile, s'assurer que la liste est affichée.
  if (!isMobile.value) {
    showList.value = true
  }
}

watch(isMobile, (newIsMobile) => {
  // Si on passe en mode mobile et une demande est sélectionnée, masquer la liste
  if (newIsMobile && selectedVisaRequest.value) {
    showList.value = false
  }
  // Si on quitte le mode mobile, afficher la liste
  else if (!newIsMobile) {
    showList.value = true
  }
})

onMounted(async () => {
  try {
    messages.value = []
    selectedVisaRequest.value = null
    idVisaRequest.value = []
    visaRequest.value = []
    stopPolling()
    if (!userStore.user) throw new Error('Utilisateur non connecté')
    const res = await visaRequestStore.showVisaRequestByUser(userStore.user.id!)
    visaRequest.value = res?.data ?? []
    idVisaRequest.value = visaRequest.value
      .filter((v) => v.status !== 'pending' && v.status !== 'created')
      .map((v) => v.id)

    if (route.params.visaRequestId) {
      loadMessages(route.params.visaRequestId as string)
      // Au chargement initial, si mobile et une demande est sélectionnée, on affiche le chat.
      if (isMobile.value) showList.value = false
    } else if (isMobile.value) {
      // Si mobile et aucune demande sélectionnée, on affiche la liste.
      showList.value = true
    } else {
      // Sur desktop, on affiche toujours la liste
      showList.value = true
    }
  } catch (err) {
    console.error(err)
    visaRequest.value = []
    idVisaRequest.value = []
  } finally {
    loading.value = false
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  stopPolling()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ... Les styles restent inchangés et sont toujours valides pour la fonctionnalité scrollbar, pop-up, etc. */

.bg-\[\#e5ddd5\] {
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="wa-pattern" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 0 10 L 10 10 L 10 0" fill="none" stroke="%23c2c2c2" stroke-width="0.3"></path><path d="M 30 0 L 30 10 L 40 10" fill="none" stroke="%23c2c2c2" stroke-width="0.3"></path><path d="M 0 30 L 10 30 L 10 40" fill="none" stroke="%23c2c2c2" stroke-width="0.3"></path><path d="M 30 40 L 40 40 L 40 30" fill="none" stroke="%23c2c2c2" stroke-width="0.3"></path></pattern></defs><rect width="100%" height="100%" fill="%23e5ddd5"></rect><rect width="100%" height="100%" fill="url(%23wa-pattern)"></rect></svg>');
  background-color: #e5ddd5;
  background-size: 400px 400px;
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

@keyframes flash-bg {
  0% {
    background-color: rgba(255, 255, 0, 0.3);
  }
  50% {
    background-color: rgba(255, 255, 0, 0.1);
  }
  100% {
    background-color: transparent;
  }
}

.highlight-flash {
  animation: flash-bg 1.5s ease-out forwards;
}
</style>
