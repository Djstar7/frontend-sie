<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Profil, StatusMat, UserData } from '@/types/user'
import { formatDateDayMonthYear } from '@/utils/formatDate'
import { useProfilStore } from '@/stores/profilStore'
import { useUserStore } from '@/stores/userStore'
import { statusMap } from '@/utils/dataMap'
import { useRouter } from 'vue-router'

const props = defineProps<{ userId: string }>()

const router = useRouter()
const profilStore = useProfilStore()
const userStore = useUserStore()
const profil = ref<Profil | null>(null)
const user = ref<UserData | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const resUser = await userStore.showUserByAgent(String(props.userId))
    const resProfil = await profilStore.showProfilUser(String(props.userId))

    user.value = resUser?.data || null
    profil.value = resProfil?.data || null
  } catch (error) {
    console.error("Erreur lors du chargement des données du profil :", error)
  } finally {
    isLoading.value = false
  }
})

const initials = computed(() => {
  const first = profil.value?.first_name?.charAt(0) || ''
  const last = profil.value?.last_name?.charAt(0) || ''
  return (first + last).toUpperCase() || '?'
})

const fullName = computed(() => {
  if (profil.value?.first_name && profil.value?.last_name) {
    return `${profil.value.first_name} ${profil.value.last_name}`
  }
  return user.value?.name || 'Utilisateur inconnu'
})

const navigateToVisaRequests = async () => {
    const routePayload = {
        name: 'agent.users.show.visarequest',
        params: { userId: user.value?.id }
    };

    try {
        await router.push(routePayload);
    } catch (error) {
        console.error("Erreur de navigation Vue Router (Vérifiez votre routeur):", error);
    }
}
</script>

<template>
  <div
    class="relative bg-white rounded-3xl shadow-lg p-6 md:p-8 max-w-lg w-full mx-auto transform transition-all duration-300"
  >
    <div class="absolute top-4 right-4 flex space-x-3">
      <div
        class="flex items-center space-x-1.5 p-2 bg-blue-100 rounded-full shadow-md"
        :class="{ 'opacity-100 animate-pulse': (user?.numberMessageUnRead ?? 0) > 0, 'opacity-75': (user?.numberMessageUnRead ?? 0) === 0 }"
        title="Messages non lus"
      >
        <i class="fas fa-comment-dots text-blue-600 text-lg"></i>
        <span class="text-blue-700 font-bold text-base leading-none">{{ user?.numberMessageUnRead ?? 0 }}</span>
      </div>

      <div
        class="flex items-center space-x-1.5 p-2 bg-orange-100 rounded-full shadow-md"
        :class="{ 'opacity-100 animate-pulse': (user?.numberVisaRequestPending ?? 0) > 0, 'opacity-75': (user?.numberVisaRequestPending ?? 0) === 0 }"
        title="Demandes de visa en attente"
      >
        <i class="fas fa-hourglass-half text-orange-600 text-lg"></i>
        <span class="text-orange-700 font-bold text-base leading-none">{{ user?.numberVisaRequestPending ?? 0 }}</span>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-48">
        <i class="fas fa-spinner fa-spin text-blue-500 text-3xl"></i>
        <span class="ml-3 text-gray-500">Chargement du profil...</span>
    </div>

    <div v-else class="flex flex-col items-center text-center pt-10">
      <div
        class="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl font-extrabold mb-4 shadow-xl ring-4 ring-blue-100"
      >
        {{ initials }}
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ fullName }}</h2>

      <div class="space-y-1 text-gray-600 mb-6">
          <p class="flex items-center justify-center gap-2 text-md">
            <i class="fas fa-envelope text-blue-500 w-5"></i>
            <span class="truncate">{{ user?.email || 'Non spécifié' }}</span>
          </p>
          <p class="flex items-center justify-center gap-2 text-md">
            <i class="fas fa-phone-alt text-green-500 w-5"></i>
            <span>{{ profil?.phone?.toString() || 'Non spécifié' }}</span>
          </p>
      </div>

      <hr class="w-full border-gray-200 mb-6" />

      <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm">

        <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
          <i class="fas fa-venus-mars text-pink-500 text-lg w-5 text-center"></i>
          <div>
            <strong class="text-gray-700 block">Genre</strong>
            <span class="text-gray-500">
              {{ profil?.gender === 'male' ? 'Homme' : (profil?.gender === 'female' ? 'Femme' : 'N/A') }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
          <i class="fas fa-flag text-red-500 text-lg w-5 text-center"></i>
          <div>
            <strong class="text-gray-700 block">Nationalité</strong>
            <span class="text-gray-500">{{ profil?.nationality || 'N/A' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
          <i class="fas fa-birthday-cake text-yellow-500 text-lg w-5 text-center"></i>
          <div>
            <strong class="text-gray-700 block">Naissance</strong>
            <span class="text-gray-500">
              {{ profil?.date_of_birth ? formatDateDayMonthYear(profil.date_of_birth) : 'N/A' }}
              <span v-if="profil?.place_of_birth" class="block text-xs italic">à {{ profil.place_of_birth }}</span>
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
          <i class="fas fa-ring text-purple-500 text-lg w-5 text-center"></i>
          <div>
            <strong class="text-gray-700 block">Statut</strong>
            <span class="text-gray-500">
              {{ statusMap.get(profil?.status_mat as StatusMat) || 'N/A' }}
            </span>
          </div>
        </div>

      </div>

      <button
        v-if="user?.id"
        @click="navigateToVisaRequests"
        class="mt-8 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
      >
        <i class="fas fa-file-alt"></i>
        Voir les demandes de visa
      </button>
    </div>
  </div>
</template>

<style scoped>
.shadow-3xl {
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.15);
}
</style>
