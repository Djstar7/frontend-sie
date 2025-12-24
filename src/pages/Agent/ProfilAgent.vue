<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { toastError } from '@/utils/toastConfig'
import type { UserRegister } from '@/types/user'
import EditProfilAgentAdmin from '@/components/EditProfilAgentAdmin.vue'

const userStore = useUserStore()

const user = ref<UserRegister | null>(null)
const loading = ref(false)
const isOpenModalEdit = ref(false)

// Initiales : fallback auto si pas de nom
const userInitials = computed(() => user.value?.name?.charAt(0)?.toUpperCase() || 'U')

// Charger l’utilisateur
const loadUser = async () => {
  loading.value = true
  try {
    if (!userStore.user) throw new Error('Utilisateur introuvable')
    user.value = userStore.user
  } catch (err) {
    console.error(err)
    toastError("Impossible de charger l'utilisateur.")
  } finally {
    loading.value = false
  }
}

// Modal
const openEditModal = () => {
  if (!user.value) return toastError('Données utilisateur manquantes.')
  isOpenModalEdit.value = true
}
const closeEditModal = () => (isOpenModalEdit.value = false)

onMounted(loadUser)
</script>

<template>
  <section class="min-h-screen flex flex-col items-center px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-16 bg-gray-50">
    <!-- Card -->
    <div
      v-if="!loading"
      class="w-full max-w-4xl bg-white shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200"
    >
      <!-- HEADER -->
      <div
        class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 sm:p-8 md:p-12 text-center text-white relative"
      >
        <div
          class="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border-3 sm:border-4 border-white shadow-lg text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide"
        >
          {{ userInitials }}
        </div>

        <div class="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold">{{ user?.name }}</h2>
          <p class="text-gray-100 text-sm sm:text-base md:text-lg truncate">
            <i class="fas fa-envelope mr-2"></i>{{ user?.email }}
          </p>
        </div>

        <!-- Edit Button -->
        <button
          @click="openEditModal"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-1 sm:gap-2"
        >
          <i class="fas fa-user-edit"></i>
          <span class="hidden sm:inline">Modifier</span>
        </button>
      </div>

      <!-- CONTENT -->
      <div class="p-4 sm:p-6 md:p-8 lg:p-10 text-gray-700">
        <h3 class="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Informations du compte</h3>

        <div class="space-y-3 sm:space-y-4">
          <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
            <span class="font-medium text-sm sm:text-base">Nom complet :</span>
            <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700">{{ user?.name }}</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
            <span class="font-medium text-sm sm:text-base">Email :</span>
            <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700 truncate">{{ user?.email }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-else class="text-center text-indigo-600 text-base sm:text-lg font-medium animate-pulse mt-12 sm:mt-16 md:mt-20">
      Chargement du profil...
    </div>

    <!-- MODAL EDIT -->
    <div
      v-if="isOpenModalEdit"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          @click="closeEditModal"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-600 hover:text-red-500 transition text-xl sm:text-2xl"
        >
          ✕
        </button>

        <EditProfilAgentAdmin :id="user?.id!" @updated="closeEditModal" />
      </div>
    </div>
  </section>
</template>
