<template>
  <div class="p-6 w-full bg-gray-50 min-h-screen transition-all duration-300">
    <!-- HEADER -->
    <div class="flex flex-col gap-6 mb-6">
      <h1 class="text-4xl font-extrabold text-purple-600 text-center drop-shadow">
        <i class="fas fa-question-circle"></i> Gestion des Questions FAQ
      </h1>

      <!-- BARRE DE CONTROLE -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Partie gauche : Recherche + Filtre -->
        <div class="flex items-center gap-2 w-full md:w-2/3">
          <!-- Recherche -->
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher par question ou réponse..."
            class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <!-- Filtre catégorie collé à l'input -->
          <select
            v-model="selectedCategory"
            class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Bouton Ajouter à droite -->
        <div class="w-full md:w-auto flex justify-end">
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl cursor-pointer"
          >
            <i class="fas fa-plus"></i>
            Ajouter une question
          </button>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-purple-600">
      <i class="fas fa-spinner fa-spin text-4xl mr-3"></i>
      <p class="text-xl animate-pulse">Chargement des questions...</p>
    </div>

    <!-- ERREUR -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow-sm"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <!-- TABLEAU -->
    <div v-else class="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-purple-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Question
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Réponse
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Catégorie
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="faq in filteredAndSearchedFaqs" :key="faq.id">
            <td class="px-6 py-4 text-sm text-gray-900">{{ faq.question }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ faq.answer }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 capitalize">{{ faq.category }}</td>
            <td class="px-6 py-4 flex gap-2">
              <button
                @click="openEditModal(faq)"
                class="text-orange-400 hover:text-orange-600 text-xl transition-transform cursor-pointer"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="confirmDelete(faq.id!)"
                class="text-red-500 hover:text-red-700 text-xl transition-transform cursor-pointer"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredAndSearchedFaqs.length === 0">
            <td colspan="4" class="text-center text-gray-500 py-8">Aucune question trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CREATE -->
    <div
      v-if="isOpenModalCreateFaqChat"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          @click="isOpenModalCreateFaqChat = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>
        <CreateFaqChat @created="handleFaqChatCreated" />
      </div>
    </div>

    <!-- MODAL EDIT -->
    <div
      v-if="isOpenModalEditFaqChat"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          @click="isOpenModalEditFaqChat = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>
        <EditFaqChat @updated="handleFaqChatUpdated" :faq="selectedFaqChat!" />
      </div>
    </div>

    <!-- MODAL DELETE -->
    <DeleteModal
      v-if="isOpenDelete"
      :val="'cette question'"
      @close="isOpenDelete = false"
      @confirm="deleteFaqChat(selectedId)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { FaqChat } from '@/types/faqchat'
import { useFaqChatStore } from '@/stores/faqChatStore'
import CreateFaqChat from '@/components/CreateFaqChat.vue'
import EditFaqChat from '@/components/EditFaqChat.vue'
import DeleteModal from '@/components/DeleteModal.vue'

const faqChats = ref<FaqChat[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const faqchatStore = useFaqChatStore()

// Modales
const isOpenModalCreateFaqChat = ref(false)
const isOpenModalEditFaqChat = ref(false)
const isOpenDelete = ref(false)
const selectedFaqChat = ref<FaqChat | null>(null)
const selectedId = ref<string>('')

// FILTRE
const selectedCategory = ref<string>('')
const searchQuery = ref<string>('')
const categories = ref<string[]>([])

const filteredAndSearchedFaqs = computed(() => {
  return faqChats.value.filter((faq) => {
    const matchesCategory = selectedCategory.value ? faq.category === selectedCategory.value : true
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

// Fetch FAQ
const fetchFaqChat = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await faqchatStore.getFaqChats()
    faqChats.value = res?.data ?? []

    // Extraire les catégories uniques
    const cats = faqChats.value.map((f) => f.category)
    categories.value = Array.from(new Set(cats))
  } catch (err) {
    console.error('Erreur lors du chargement des questions:', err)
    error.value = 'Impossible de charger les questions FAQ.'
  } finally {
    isLoading.value = false
  }
}

// Actions modales
const openCreateModal = () => (isOpenModalCreateFaqChat.value = true)
const openEditModal = (faq: FaqChat) => {
  selectedFaqChat.value = faq
  isOpenModalEditFaqChat.value = true
}
const handleFaqChatCreated = () => {
  isOpenModalCreateFaqChat.value = false
  fetchFaqChat()
}
const handleFaqChatUpdated = () => {
  isOpenModalEditFaqChat.value = false
  fetchFaqChat()
}

// Suppression
const confirmDelete = (id: string) => {
  selectedId.value = id
  isOpenDelete.value = true
}
const deleteFaqChat = async (id: string) => {
  try {
    await faqchatStore.deleteFaqChat(id)
    faqChats.value = faqChats.value.filter((q) => q.id !== id)
    isOpenDelete.value = false
  } catch (err) {
    console.error('Erreur lors de la suppression de la question:', err)
  }
}

onMounted(fetchFaqChat)
</script>
