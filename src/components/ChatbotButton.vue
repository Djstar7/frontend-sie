<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useFaqChatStore } from '@/stores/faqChatStore'
import type { FaqChat } from '@/types/faqchat'
import { toastError } from '@/utils/toastConfig'

// --- Store et États ---
const faqChatStore = useFaqChatStore()
const questions = ref<FaqChat[]>([])
const selectedCategory = ref<string | null>(null)
const chatMessages = ref<{ sender: 'user' | 'bot'; text: string; loading?: boolean }[]>([])
const isOpen = ref(false) // Initialisé à false, vous pouvez le changer si vous voulez qu'il soit ouvert par défaut
const loading = ref(true)
const error = ref<string | null>(null)

// --- Chargement des données ---
onMounted(async () => {
  try {
    const res = await faqChatStore.getFaqChats()
    // Initialisation d'un message d'accueil
    chatMessages.value.push({
      sender: 'bot',
      text: "Bienvenue sur notre chat d'aide ! Veuillez choisir une catégorie pour commencer.",
    })
    questions.value = res?.data || []
  } catch (e) {
    console.error('Erreur lors du chargement des FaqChats :', e)
    error.value = 'Impossible de charger les questions.'
    toastError(error.value)
  } finally {
    loading.value = false
  }
})

// --- Catégories Uniques (Calculées) ---
const categories = computed(() =>
  [...new Set((questions.value || []).map((q) => q.category))].sort(),
)

// --- Logique du Chat ---
async function chooseQuestion(q: FaqChat) {
  // Fermer la liste des questions et catégories après le choix
  selectedCategory.value = null

  // 1. Message Utilisateur
  chatMessages.value.push({ sender: 'user', text: q.question })
  await nextTick()
  scrollToBottom()

  // 2. Message de chargement du Bot
  chatMessages.value.push({ sender: 'bot', text: '', loading: true })
  await nextTick()
  scrollToBottom()

  // 3. Réponse du Bot après un délai
  setTimeout(async () => {
    const botIndex = chatMessages.value.findIndex((m) => m.loading)
    if (botIndex !== -1) {
      chatMessages.value[botIndex] = { sender: 'bot', text: q.answer }
      await nextTick()
      scrollToBottom()
    }
  }, 1000) // Réduit à 1 seconde pour une meilleure expérience
}

function scrollToBottom() {
  const container = document.querySelector<HTMLDivElement>('.chat-messages')
  // Utilisation de setTimeout pour s'assurer que le DOM est à jour après nextTick
  setTimeout(() => {
    if (container) container.scrollTop = container.scrollHeight
  }, 50)
}

function toggleChat() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <button
    @click="toggleChat"
    class="fixed bottom-5 right-5 w-16 h-16 rounded-full /* Dégradé primaire Bleu-Violet */ bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-2xl shadow-blue-500/50 flex items-center justify-center text-2xl z-50 transform hover:scale-105 transition-all duration-300"
  >
    <i :class="isOpen ? 'fas fa-times' : 'fas fa-comments'"></i>
  </button>

  <div
    v-if="isOpen"
    class="fixed bottom-24 right-5 w-full max-w-sm h-[560px] bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden z-40 border border-gray-100 transform transition-all duration-300 ease-in-out"
  >
    <div
      class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 font-semibold flex items-center justify-between shadow-md"
    >
      <span class="flex items-center gap-2 text-lg">
        <i class="fas fa-robot text-red-300"></i> Assistant SIE
      </span>
      <i
        class="fas fa-minus cursor-pointer hover:text-red-300 transition-colors text-xl"
        @click="toggleChat"
      ></i>
    </div>

    <div class="flex-1 p-5 overflow-y-auto chat-messages space-y-4 text-sm bg-gray-50/50">
      <div v-if="loading" class="text-center text-purple-600 animate-pulse mt-10">
        <i class="fas fa-circle-notch fa-spin mr-2 text-2xl"></i> Chargement des FAQs...
      </div>
      <div
        v-else-if="error"
        class="text-center text-red-600 mt-10 p-4 border border-red-300 rounded-lg bg-red-50"
      >
        <i class="fas fa-exclamation-triangle mr-2"></i>{{ error }}
      </div>

      <div v-else>
        <div
          v-for="(msg, i) in chatMessages"
          :key="i"
          class="flex items-start gap-3 py-2"
          :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            v-if="msg.sender === 'bot'"
            class="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg flex-shrink-0"
          >
            <i class="fas fa-robot text-xs"></i>
          </div>

          <div
            v-if="!msg.loading"
            :class="[
              'px-4 py-4 rounded-2xl shadow-md max-w-[80%] break-words transition-colors duration-300 text-sm',
              msg.sender === 'user'
                ? 'bg-purple-600 text-white rounded-br-none' // Bulle utilisateur (Violet)
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-200', // Bulle bot
            ]"
          >
            {{ msg.text }}
          </div>

          <div
            v-else
            class="bg-white text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[70%] flex items-center gap-1 shadow-md"
          >
            <span class="dot bounce text-2xl leading-none" v-for="n in 3" :key="n">.</span>
          </div>

          <div
            v-if="msg.sender === 'user'"
            class="w-8 h-8 flex items-center justify-center bg-gray-400 text-white rounded-full shadow-lg flex-shrink-0"
          >
            <i class="fas fa-user text-xs"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 p-4 bg-white shadow-inner">
      <div v-if="!selectedCategory" class="max-h-36 overflow-y-auto">
        <p class="text-xs font-semibold uppercase text-gray-600 mb-3">Choisir un thème :</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="bg-blue-50 px-3 py-1.5 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 flex items-center gap-1.5 shadow-sm"
          >
            <i class="fas fa-tag text-red-500"></i> {{ cat }}
          </button>
        </div>
      </div>

      <div v-else>
        <button
          class="text-xs font-semibold text-purple-600 hover:text-red-500 underline mb-3 flex items-center gap-1.5 transition-colors"
          @click="selectedCategory = null"
        >
          <i class="fas fa-arrow-left text-sm"></i> Retour aux thèmes
        </button>
        <div class="space-y-2 max-h-36 overflow-y-auto">
          <button
            v-for="(q, index) in questions.filter((q) => q.category === selectedCategory)"
            :key="q.id"
            @click="chooseQuestion(q)"
            class="w-full text-left text-sm bg-gray-50 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-start gap-2 border border-gray-100 shadow-sm"
          >
            <i class="mt-1 text-red-500 text-lg flex-shrink-0 p-1 rounded-full bg-red-100">{{
              index + 1
            }}</i>
            {{ q.question }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar stylée (Violet/Rouge) */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
  /* Utilisation du violet avec opacité */
  background-color: rgba(109, 40, 217, 0.6);
  border-radius: 3px;
}

/* Animation points de suspension (Plus doux) */
.dot {
  display: inline-block;
  font-weight: bold;
  color: #a0a0a0; /* Gris clair */
  animation: bounce 1s infinite;
}
.dot:nth-child(1) {
  animation-delay: 0s;
}
.dot:nth-child(2) {
  animation-delay: 0.15s;
}
.dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
</style>
