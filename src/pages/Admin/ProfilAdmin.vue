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
  <section class="min-h-screen flex flex-col items-center px-6 py-16 bg-gray-50">
    <!-- Card -->
    <div
      v-if="!loading"
      class="w-full max-w-4xl bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-200 animate__animated animate__fadeIn"
    >
      <!-- HEADER -->
      <div
        class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 text-center text-white relative"
      >
        <div
          class="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border-4 border-white shadow-lg text-5xl font-bold tracking-wide"
        >
          {{ userInitials }}
        </div>

        <div class="mt-6 space-y-3">
          <h2 class="text-3xl font-semibold">{{ user?.name }}</h2>
          <p class="text-gray-100 text-lg"><i class="fas fa-envelope mr-2"></i>{{ user?.email }}</p>
        </div>

        <!-- Edit Button -->
        <button
          @click="openEditModal"
          class="absolute top-6 right-6 px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
        >
          <i class="fas fa-user-edit"></i> Modifier
        </button>
      </div>

      <!-- CONTENT -->
      <div class="p-10 text-gray-700">
        <h3 class="text-xl font-semibold mb-4">Informations du compte</h3>

        <div class="space-y-4">
          <div class="flex justify-between border-b pb-3">
            <span class="font-medium">Nom complet :</span>
            <span>{{ user?.name }}</span>
          </div>

          <div class="flex justify-between border-b pb-3">
            <span class="font-medium">Email :</span>
            <span>{{ user?.email }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-else class="text-center text-indigo-600 text-lg font-medium animate-pulse mt-20">
      Chargement du profil...
    </div>

    <!-- MODAL EDIT -->
    <div
      v-if="isOpenModalEdit"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          @click="closeEditModal"
          class="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition text-2xl"
        >
          ✕
        </button>

        <EditProfilAgentAdmin @updated="closeEditModal" />
      </div>
    </div>
  </section>
</template>
