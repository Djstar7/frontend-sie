<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useFaqChatStore } from '@/stores/faqChatStore'
import type { FaqChat } from '@/types/faqchat'
import { toastError } from '@/utils/toastConfig'

const faqChatStore = useFaqChatStore()
const questions = ref<FaqChat[]>([])
const selectedCategory = ref<string | null>(null)
const chatMessages = ref<{ sender: 'user' | 'bot'; text: string; loading?: boolean }[]>([])
const isOpen = ref(true)
const loading = ref(true)
const error = ref<string | null>(null)
// Charger les questions FAQ
onMounted(async () => {
  try {
    const res = await faqChatStore.getFaqChats()
    questions.value = res?.data || []
  } catch (e) {
    console.error('Erreur lors du chargement des FaqChats :', e)
    error.value = 'Impossible de charger les questions.'
    toastError(error.value)
  } finally {
    loading.value = false
  }
})

// Categories uniques
const categories = computed(() =>
  [...new Set((questions.value || []).map((q) => q.category))].sort(),
)

// Gestion des messages
async function chooseQuestion(q: FaqChat) {
  chatMessages.value.push({ sender: 'user', text: q.question })
  await nextTick()
  scrollToBottom()

  // Ajouter message de chargement pour le bot
  chatMessages.value.push({ sender: 'bot', text: '', loading: true })
  await nextTick()
  scrollToBottom()

  // Réponse bot après 1.5s
  setTimeout(async () => {
    const botIndex = chatMessages.value.findIndex((m) => m.loading)
    if (botIndex !== -1) {
      chatMessages.value[botIndex] = { sender: 'bot', text: q.answer }
      await nextTick()
      scrollToBottom()
    }
  }, 1500)
}

function scrollToBottom() {
  const container = document.querySelector<HTMLDivElement>('.chat-messages')
  if (container) container.scrollTop = container.scrollHeight
}

function closeChat() {
  isOpen.value = false
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed bottom-20 right-5 w-96 h-[500px] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden"
  >
    <!-- Header -->
    <div class="bg-blue-600 text-white p-4 font-semibold flex items-center justify-between">
      <span class="flex items-center gap-2"><i class="fas fa-robot"></i> Chat d'aide</span>
      <i
        class="fas fa-times cursor-pointer hover:text-red-400 transition-colors"
        @click="closeChat"
      ></i>
    </div>

    <!-- Zone de chat -->
    <div class="flex-1 p-4 overflow-y-auto chat-messages space-y-4 text-base">
      <div v-if="loading" class="text-center text-blue-500 animate-pulse">
        <i class="fas fa-spinner fa-spin mr-2"></i> Chargement...
      </div>
      <div v-else-if="error" class="text-center text-red-500">
        <i class="fas fa-exclamation-circle mr-2"></i>{{ error }}
      </div>
      <div v-else>
        <div
          v-for="(msg, i) in chatMessages"
          :key="i"
          class="flex items-end gap-2 mb-4"
          :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- Avatar -->
          <div
            v-if="msg.sender === 'bot'"
            class="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full shadow"
          >
            <i class="fas fa-robot text-sm"></i>
          </div>

          <div
            v-if="!msg.loading"
            :class="
              msg.sender === 'user'
                ? 'bg-blue-500 text-white px-4 py-2 rounded-xl max-w-[70%] break-words'
                : 'bg-gray-200 px-4 py-2 rounded-xl max-w-[70%] break-words'
            "
          >
            {{ msg.text }}
          </div>

          <div v-else class="bg-gray-200 px-4 py-2 rounded-xl max-w-[70%] flex items-center gap-1">
            <span class="dot bounce" v-for="n in 3" :key="n">.</span>
          </div>

          <!-- Avatar utilisateur -->
          <div
            v-if="msg.sender === 'user'"
            class="w-8 h-8 flex items-center justify-center bg-gray-400 text-white rounded-full shadow"
          >
            <i class="fas fa-user text-sm"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des questions -->
    <div class="border-t p-3 bg-gray-50">
      <div v-if="!selectedCategory">
        <p class="text-sm font-bold mb-3">Choisir une catégorie :</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <i class="fas fa-folder text-blue-500"></i> {{ cat }}
          </button>
        </div>
      </div>

      <div v-else>
        <button
          class="text-sm text-blue-600 underline mb-3 flex items-center gap-2"
          @click="selectedCategory = null"
        >
          <i class="fas fa-arrow-left"></i> Retour
        </button>
        <div class="space-y-3 max-h-20 overflow-y-auto">
          <button
            v-for="q in questions.filter((q) => q.category === selectedCategory)"
            :key="q.id"
            @click="chooseQuestion(q)"
            class="w-full text-left text-base bg-gray-100 px-4 py-2 rounded hover:bg-blue-50 transition-colors flex items-center gap-3"
          >
            <i class="fas fa-question-circle text-blue-500"></i> {{ q.question }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar stylée */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

/* Animation points de suspension */
.dot {
  display: inline-block;
  font-weight: bold;
  animation: bounce 1.2s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
