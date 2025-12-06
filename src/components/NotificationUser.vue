<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Notification } from '@/types/notification'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// --- Props et Événements ---
const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

// --- Stock et état ---
const router = useRouter()
const notificationStore = useNotificationStore()
const userStore = useUserStore()
const notifications = ref<Notification[]>([])
const selectedNotif = ref<Notification | null>(null)
const showModal = ref(false)
const filter = ref<'all' | 'unread' | 'read'>('all')
const isLoggedIn = computed(() => !!userStore.user)

// --- Initialisation ---
onMounted(async () => {
  try {
    if (!isLoggedIn.value) return
    console.log('Erreur')
    const res = await notificationStore.getNotification()
    notifications.value = res?.data || []
  } catch (error) {
    console.error('Erreur de chargement des notifications:', error)
  }
})
setInterval(async () => {
  try {
    const res = await notificationStore.getNotification()
    notifications.value = res?.data || []
  } catch (error) {
    console.error('Erreur de chargement des notifications:', error)
  }
}, 5000)

// --- Fonctions utilitaires ---
const formatType = (type: string) => {
  if (!type) return 'Notification'
  const baseType = type.split('\\').pop()?.replace('Notification', '') || 'Notification'
  return baseType.charAt(0).toUpperCase() + baseType.slice(1)
}

/** Assigne l'icône Font Awesome et les classes CSS basées sur le type. */
const getNotifIconAndColor = (notif: Notification) => {
  const isUnread = !notif.status
  const type = formatType(notif.type).toLowerCase()

  let iconClass = 'fa-info-circle'
  let colorClass = isUnread ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
  let ringClass = ''

  switch (type) {
    case 'visarequest':
    case 'documentrequis':
      iconClass = 'fa-file-alt'
      colorClass = isUnread ? 'bg-yellow-600 text-white' : 'bg-yellow-200 text-yellow-800'
      break
    case 'visaaccepted':
      iconClass = 'fa-check-circle'
      colorClass = isUnread ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800'
      break
    case 'visarejected':
    case 'error':
    case 'systemerror':
      iconClass = 'fa-exclamation-triangle'
      colorClass = isUnread ? 'bg-red-600 text-white' : 'bg-red-200 text-red-800'
      break
    case 'payment':
      iconClass = 'fa-credit-card'
      colorClass = isUnread ? 'bg-indigo-600 text-white' : 'bg-indigo-200 text-indigo-800'
      break
    case 'appoitment':
      iconClass = 'fa-calendar-alt'
      break
    case 'message':
      iconClass = 'fa-comment-dots'
      break
    default:
      iconClass = 'fa-bell'
      break
  }

  const backgroundClass = isUnread
    ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500' // Non lu
    : 'bg-white hover:bg-gray-50 border-l-4 border-gray-100' // Lu

  if (isUnread) ringClass = 'ring-2 ring-blue-300'

  return { iconClass, avatarClass: colorClass, backgroundClass, ringClass }
}

// --- Computed ---
const filteredNotifications = computed(() => {
  if (filter.value === 'all') return notifications.value
  if (filter.value === 'unread') return notifications.value.filter((n) => !n.status)
  return notifications.value.filter((n) => n.status)
})

const unreadCount = computed(() => notifications.value.filter((n) => !n.status).length)

// --- Gestion des actions utilisateur ---
const setFilter = (newFilter: 'all' | 'unread' | 'read') => {
  filter.value = newFilter
}

const openModal = (notif: Notification) => {
  selectedNotif.value = notif
  showModal.value = true
  // Marquer comme lu si ce n'est pas déjà fait
  if (!notif.status && notif.id) {
    notif.status = new Date().toISOString()
    notificationStore.markRead(notif.id)
  }
}
const openLink = (link: string) => {
  router.push(link)

  showModal.value = false
}
const closeModal = () => {
  showModal.value = false
  selectedNotif.value = null
}

const closePanel = () => {
  emit('close')
}

const markAllRead = async () => {
  try {
    await notificationStore.markAllRead()
    notifications.value.forEach((n) => (n.status = n.status || new Date().toISOString()))
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications comme lues:', error)
  }
}
</script>

<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="props.isOpen"
      class="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl flex flex-col pt-20"
    >
      <header
        class="p-5 border-b border-gray-100 flex items-center justify-between shadow-sm sticky top-0 bg-white z-20"
      >
        <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <i class="fas fa-bell text-blue-600"></i>
          Notifications
          <span
            v-if="unreadCount > 0"
            class="text-sm bg-red-600 text-white font-medium px-2 py-0.5 rounded-full"
            >{{ unreadCount }}</span
          >
        </h2>
        <button
          @click="closePanel"
          class="text-gray-500 hover:text-gray-700 text-2xl p-2 rounded-full hover:bg-gray-100 transition"
        >
          <i class="fas fa-times"></i>
        </button>
      </header>

      <div
        class="p-4 border-b border-gray-100 flex justify-between items-center sticky top-[72px] bg-gray-50 z-10"
      >
        <div class="flex space-x-2 text-sm font-medium">
          <button
            @click="setFilter('all')"
            :class="[
              'py-2 px-3 rounded-full transition-colors',
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 bg-gray-200 hover:bg-gray-300',
            ]"
          >
            Tout ({{ notifications.length }})
          </button>
          <button
            @click="setFilter('unread')"
            :class="[
              'py-2 px-3 rounded-full transition-colors',
              filter === 'unread'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 bg-gray-200 hover:bg-gray-300',
            ]"
          >
            Non lues ({{ unreadCount }})
          </button>
        </div>
        <button
          @click="markAllRead"
          v-if="unreadCount > 0"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Tout marquer comme lu
        </button>
      </div>

      <ul class="flex-1 overflow-y-auto p-4 space-y-3">
        <li v-if="filteredNotifications.length === 0" class="p-4 text-center text-gray-500">
          <i class="fas fa-check-circle text-4xl mb-2"></i>
          <p>Vous êtes à jour. Aucune notification à afficher ici.</p>
        </li>

        <li
          v-for="notif in filteredNotifications"
          :key="notif.id"
          @click="openModal(notif)"
          :class="[
            'flex items-start gap-4 p-3 rounded-xl cursor-pointer shadow-sm transition duration-150 ease-in-out group',
            getNotifIconAndColor(notif).backgroundClass,
          ]"
        >
          <div
            class="w-10 h-10 flex items-center justify-center rounded-full text-lg font-semibold flex-shrink-0 mt-1"
            :class="[
              getNotifIconAndColor(notif).avatarClass,
              getNotifIconAndColor(notif).ringClass,
            ]"
          >
            <i :class="['fas', getNotifIconAndColor(notif).iconClass]"></i>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center">
              <p class="font-bold text-gray-900 line-clamp-1">
                {{ notif.author ? formatType(notif.author) : formatType(notif.type) }}
              </p>
              <div
                v-if="!notif.status"
                class="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"
                aria-label="Non lue"
              ></div>
            </div>

            <p
              :class="[
                'text-sm mt-0.5 line-clamp-2',
                !notif.status ? 'text-gray-800 font-medium' : 'text-gray-600',
              ]"
            >
              {{ notif.message }}
            </p>
            <p class="text-xs mt-1 text-gray-500">
              {{
                new Date(notif.created_at!).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
              - {{ new Date(notif.created_at!).toLocaleDateString() }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </transition>

  <transition
    enter-active-class="duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showModal"
      class="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8 bg-black/60"
      @click.self="closeModal"
    >
      <transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-if="showModal && selectedNotif"
          class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all"
        >
          <div class="flex items-start gap-3 border-b pb-4 mb-4 border-gray-100">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full text-xl flex-shrink-0 mt-1"
              :class="getNotifIconAndColor(selectedNotif).avatarClass"
            >
              <i :class="['fas', getNotifIconAndColor(selectedNotif).iconClass]"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900 flex-1 pt-1">
              {{ formatType(selectedNotif.type || '') }}
            </h2>
            <button
              @click="closeModal"
              class="text-gray-500 hover:text-gray-700 text-2xl p-1 rounded-full hover:bg-gray-100 transition"
            >
              <span class="sr-only">Fermer</span>
              ✕
            </button>
          </div>

          <p
            class="text-gray-700 text-base leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto"
          >
            {{ selectedNotif.message }}
          </p>

          <p class="text-xs mt-6 pt-2 border-t border-gray-100 text-gray-500">
            Reçu le : {{ new Date(selectedNotif.created_at!).toLocaleString() }}
          </p>

          <div class="mt-6 flex justify-between">
            <button
              @click="closeModal"
              class="px-4 py-2 rounded-full text-gray-700 font-medium bg-red-100 hover:bg-red-200 transition"
            >
              Fermer
            </button>
            <button
              @click="openLink(selectedNotif.link)"
              class="px-4 py-2 rounded-full text-blue-700 font-medium bg-blue-100 hover:bg-blue-200 transition"
            >
              Voir plus
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
