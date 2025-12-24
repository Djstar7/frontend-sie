<template>
  <div class="bg-white">
    <section class="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 overflow-hidden">
      <div class="container mx-auto px-3 sm:px-4 md:px-6">
        <div class="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 md:gap-16">
          <div class="lg:w-1/2">
            <span
              class="text-xs sm:text-sm font-semibold uppercase text-red-600 tracking-wider flex items-center gap-2 mb-2"
            >
              <i class="fa-solid fa-plane-departure"></i> Certification
            </span>
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4 mt-2">
              Agence Légalement Accréditée
            </h2>
            <p class="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              <strong>Immigration de l'Estuaire</strong> est une agence agréée et certifiée...
            </p>
          </div>

          <div class="lg:w-1/2 w-full">
            <div
              class="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-blue-100"
            >
              <div
                v-for="(img, idx) in certImages"
                :key="idx"
                class="p-3 bg-white rounded-lg shadow-inner flex justify-center items-center"
              >
                <img
                  :src="img"
                  :alt="`Logo de Certification ${idx + 1}`"
                  class="max-h-20 w-auto opacity-70 hover:opacity-100 transition duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="isLoggedIn" class="py-8 sm:py-10 md:py-12 bg-purple-50">
      <div class="container mx-auto px-3 sm:px-4 md:px-6 max-w-3xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div>
            <span
              class="text-xs sm:text-sm font-semibold uppercase text-red-600 tracking-wider flex items-center gap-2"
            >
              <i class="fa-solid fa-pen-to-square"></i> Partagez votre Expérience
            </span>
            <h3 class="text-xl sm:text-2xl font-extrabold text-blue-900 mt-1">Donnez votre avis</h3>
            <p class="text-xs sm:text-sm text-gray-600 mt-1">
              Vous pouvez ajouter, modifier ou supprimer vos avis.
            </p>
          </div>

          <div class="flex-shrink-0">
            <button
              @click="toggleCreateForm"
              class="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow hover:from-blue-700 hover:to-purple-700 transition text-sm sm:text-base"
            >
              <i :class="createFormOpen ? 'fas fa-times mr-1 sm:mr-2' : 'fas fa-plus mr-1 sm:mr-2'"></i>
              <span class="hidden sm:inline">{{ createFormOpen ? 'Fermer' : 'Ajouter un avis' }}</span>
              <span class="sm:hidden">{{ createFormOpen ? 'Fermer' : 'Ajouter' }}</span>
            </button>
          </div>
        </div>

        <transition name="fade" mode="out-in">
          <form
            v-if="createFormOpen"
            key="form-create"
            @submit.prevent="submitAvis"
            class="bg-white p-6 rounded-2xl shadow-2xl border border-purple-200"
          >
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold mb-2">Votre note</label>
              <div class="flex items-center space-x-2">
                <i
                  v-for="n in 5"
                  :key="n"
                  @click="selectRating(n)"
                  :class="[
                    'fas fa-star text-2xl cursor-pointer transition-colors duration-150',
                    n <= newAvisTempRating
                      ? 'text-orange-500'
                      : 'text-gray-300 hover:text-orange-400',
                  ]"
                ></i>
                <span class="text-sm text-gray-600">({{ newAvisTempRating }} / 5)</span>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-gray-700 font-semibold mb-2">Votre commentaire</label>
              <textarea
                v-model="newAvis.content"
                rows="4"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="Décrivez votre expérience..."
              ></textarea>
            </div>

            <div class="flex justify-end items-center space-x-3">
              <button
                type="button"
                @click="resetCreateForm"
                class="px-4 py-2 border rounded-full text-gray-700 hover:bg-gray-100 transition"
              >
                Annuler
              </button>

              <button
                type="submit"
                :disabled="isProcessing"
                class="px-5 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition disabled:opacity-50"
              >
                <i v-if="isProcessing" class="fas fa-spinner fa-spin mr-2"></i>
                <span v-else><i class="fas fa-paper-plane mr-2"></i>Soumettre</span>
              </button>
            </div>
          </form>
        </transition>
      </div>
    </section>

    <section class="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div class="container mx-auto px-3 sm:px-4 md:px-6">
        <div class="text-center mb-8 sm:mb-12 md:mb-16">
          <span
            class="text-xs sm:text-sm font-semibold uppercase text-red-600 tracking-wider flex items-center justify-center gap-2 mb-2"
          >
            <i class="fa-solid fa-star"></i> Témoignages
          </span>
          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4 mt-2">
            Ce que disent nos clients
          </h2>
          <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
            Découvrez les retours d'expériences vérifiés de notre communauté.
          </p>

          <p v-if="!isLoggedIn" class="mt-3 sm:mt-4 text-blue-600 font-semibold text-sm sm:text-base">
            Connectez-vous pour pouvoir ajouter, modifier ou supprimer votre propre avis !
          </p>
        </div>

        <div v-if="isLoading" class="text-center py-10">
          <i class="fas fa-spinner fa-spin text-4xl text-purple-600"></i>
          <p class="mt-3 text-gray-600">Chargement des témoignages...</p>
        </div>

        <div v-else-if="allAvis.length === 0" class="text-center py-10 text-gray-500">
          <p>Aucun avis trouvé pour le moment. Soyez le premier à partager votre expérience !</p>
        </div>

        <div v-else class="relative">
          <button
            @click="scrollReviews('prev')"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition hidden md:block"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <div
            ref="reviewsContainer"
            class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide px-2"
            @wheel="stopAutoScrollTemporarily"
            @touchstart="stopAutoScrollTemporarily"
            @touchend="startAutoScroll"
          >
            <article
              v-for="review in allAvis"
              :key="review.id"
              class="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%] snap-center bg-gray-50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition"
            >
              <span class="text-4xl text-purple-600 block mb-4"
                ><i class="fas fa-quote-left"></i
              ></span>

              <p class="text-gray-700 mb-4 italic line-clamp-5">"{{ review.content }}"</p>

              <div class="flex items-center justify-between pt-4 border-t border-purple-100">
                <div class="flex items-center">
                  <img
                    src="/src/assets/images/logo.png"
                    class="w-12 h-12 rounded-full object-cover mr-4 border-2 border-red-500"
                    alt="avatar"
                  />
                  <div>
                    <h4 class="font-bold text-gray-800">
                      {{
                        review.name ||
                        `Utilisateur (ID: ${String(review.user_id).substring(0, 8)}…)`
                      }}
                    </h4>
                    <div class="text-orange-500 text-sm">
                      <i
                        v-for="n in 5"
                        :key="n"
                        :class="['fas fa-star', { 'text-gray-300': n > review.rating }]"
                      ></i>
                    </div>
                  </div>
                </div>

                <div
                  v-if="isLoggedIn && review.user_id === currentUserId"
                  class="flex items-center space-x-2"
                >
                  <button
                    @click="startEdit(review)"
                    class="text-blue-500 hover:text-blue-700 transition"
                    title="Modifier mon avis"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="openDeleteModal(review.id)"
                    class="text-red-500 hover:text-red-700 transition"
                    title="Supprimer mon avis"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </article>
          </div>

          <button
            @click="scrollReviews('next')"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition hidden md:block"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="isEditModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
        <h3 class="text-2xl font-bold text-blue-900 mb-4">Modifier votre avis</h3>

        <form @submit.prevent="updateAvis">
          <div class="mb-4">
            <label class="block text-gray-700 font-semibold mb-2">Note</label>
            <div class="flex items-center space-x-2">
              <i
                v-for="n in 5"
                :key="n"
                @click="editingReview.rating = n"
                :class="[
                  'fas fa-star text-2xl cursor-pointer transition-colors duration-150',
                  n <= editingReview.rating
                    ? 'text-orange-500'
                    : 'text-gray-300 hover:text-orange-400',
                ]"
              ></i>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-semibold mb-2">Commentaire</label>
            <textarea
              v-model="editingReview.content"
              rows="4"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            ></textarea>
          </div>

          <div class="flex justify-end items-center space-x-3">
            <button
              type="button"
              @click="isEditModalOpen = false"
              class="px-4 py-2 border rounded-full text-gray-700 hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isProcessing"
              class="px-5 py-2 bg-blue-600 text-white rounded-full font-bold shadow hover:bg-blue-700 transition disabled:opacity-50"
            >
              <i v-if="isProcessing" class="fas fa-spinner fa-spin mr-2"></i>
              <span v-else>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    <DeleteModal
      v-if="isOpenDelete"
      :val="'cet avis'"
      @close="isOpenDelete = false"
      @confirm="deleteUserAvis(selectedId)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAvisStore } from '@/stores/avisStore'
import { useUserStore } from '@/stores/userStore'
import type { Avis as AvisType } from '@/types/avis'
// Assurez-vous d'avoir ce composant ou remplacez-le par une confirmation native
// import DeleteModal from './DeleteModal.vue'

// Interface locale pour s'assurer que l'ID est toujours présent pour les avis affichés
interface Avis extends AvisType {
  id: string
}

const avisStore = useAvisStore()
const userStore = useUserStore()

const isLoggedIn = computed(() => Boolean(userStore.user))
const currentUserId = computed(() => userStore.user?.id ?? null)

const isLoading = ref(false)
const isProcessing = ref(false)
const allAvis = ref<Avis[]>([])
const reviewsContainer = ref<HTMLElement | null>(null)

let scrollInterval: number | null = null
let temporaryStopTimeout: number | null = null
const isOpenDelete = ref(false)
const selectedId = ref<string>('')

// Gestion du formulaire d'ajout
const createFormOpen = ref(false)
const newAvisTempRating = ref<number>(5)
const newAvis = ref<Omit<AvisType, 'id'>>({
  content: '',
  rating: 5,
  user_id: '',
})

// Gestion du formulaire de modification
const isEditModalOpen = ref(false)
const editingReview = ref<Avis>({
  id: '',
  content: '',
  rating: 5,
  user_id: '',
  name: '',
})

const certImages = [
  '/src/assets/images/cert1.png',
  '/src/assets/images/cert-2.jpg',
  '/src/assets/images/cert-3.jpg',
]

function selectRating(n: number) {
  newAvisTempRating.value = n
  newAvis.value.rating = n
}

function toggleCreateForm() {
  createFormOpen.value = !createFormOpen.value
}

function resetCreateForm() {
  newAvis.value.content = ''
  newAvisTempRating.value = 5
  newAvis.value.rating = 5
  createFormOpen.value = false
}

// Logique de défilement
const getCardWidth = (container: HTMLElement) => {
  const cw = container.clientWidth
  // Utilisation de la largeur basée sur les classes Tailwind
  if (cw >= 1024) return cw * 0.3 + 24
  if (cw >= 640) return cw * 0.45 + 24
  return cw * 0.85 + 24
}

function scrollReviews(direction: 'prev' | 'next') {
  stopAutoScrollTemporarily()
  const container = reviewsContainer.value
  if (!container) return
  const cardWidth = getCardWidth(container)
  let newPos = container.scrollLeft + (direction === 'next' ? cardWidth : -cardWidth)

  if (newPos > container.scrollWidth - container.clientWidth) newPos = 0
  if (newPos < 0) newPos = container.scrollWidth - container.clientWidth

  container.scrollTo({ left: newPos, behavior: 'smooth' })
}

function stopAutoScroll() {
  if (scrollInterval) {
    clearInterval(scrollInterval)
    scrollInterval = null
  }
}

function startAutoScroll() {
  if (scrollInterval) return
  scrollInterval = window.setInterval(() => {
    // Vérifie si la souris n'est pas sur le conteneur
    if (reviewsContainer.value && !reviewsContainer.value.matches(':hover')) {
      scrollReviews('next')
    }
  }, 4000)
}

function stopAutoScrollTemporarily() {
  stopAutoScroll()
  if (temporaryStopTimeout) clearTimeout(temporaryStopTimeout)
  temporaryStopTimeout = window.setTimeout(startAutoScroll, 5000)
}

// Logique CRUD
async function fetchAvis() {
  isLoading.value = true
  stopAutoScroll()
  if (temporaryStopTimeout) clearTimeout(temporaryStopTimeout)

  try {
    const res = await avisStore.getAvis()
    // S'assurer que chaque avis a un ID de type string pour le keying et les opérations
    allAvis.value = (res?.data ?? []).map((a: AvisType) => ({
      ...a,
      id: a.id || String(Date.now() + Math.random()),
    })) as Avis[]
  } catch (err) {
    console.error('Erreur récupération avis :', err)
  } finally {
    isLoading.value = false
    await nextTick()
    startAutoScroll()
  }
}

async function submitAvis() {
  if (!isLoggedIn.value || !currentUserId.value) return
  if (!newAvis.value.content || newAvisTempRating.value <= 0) return

  try {
    isProcessing.value = true
    newAvis.value.user_id = String(currentUserId.value)
    newAvis.value.rating = newAvisTempRating.value

    await avisStore.createAvis(newAvis.value)
    await fetchAvis()
    resetCreateForm()
  } catch (err) {
    console.error('Erreur création avis :', err)
  } finally {
    isProcessing.value = false
  }
}

function startEdit(review: Avis) {
  if (review.user_id !== currentUserId.value) return // Sûreté
  editingReview.value = { ...review }
  isEditModalOpen.value = true
}

async function updateAvis() {
  if (!editingReview.value.id) return
  try {
    isProcessing.value = true
    await avisStore.editAvis(editingReview.value.id, {
      content: editingReview.value.content,
      rating: editingReview.value.rating,
      user_id: editingReview.value.user_id,
    })
    isEditModalOpen.value = false
    await fetchAvis()
  } catch (err) {
    console.error('Erreur mise à jour avis :', err)
  } finally {
    isProcessing.value = false
  }
}

const openDeleteModal = (id: string) => {
  isOpenDelete.value = true
  selectedId.value = id
}

async function deleteUserAvis(id: string) {
  try {
    isProcessing.value = true
    await avisStore.deleteAvis(id)
    isOpenDelete.value = false
    await fetchAvis()
  } catch (err) {
    console.error('Erreur suppression avis :', err)
  } finally {
    isProcessing.value = false
  }
}

// Cycle de vie
onMounted(() => {
  fetchAvis()
  // Défilement automatique géré par l'événement :hover dans le template
  window.addEventListener('blur', stopAutoScroll)
  window.addEventListener('focus', startAutoScroll)
})

onUnmounted(() => {
  stopAutoScroll()
  if (temporaryStopTimeout) clearTimeout(temporaryStopTimeout)
  window.removeEventListener('blur', stopAutoScroll)
  window.removeEventListener('focus', startAutoScroll)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
