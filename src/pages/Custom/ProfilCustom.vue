<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useProfilStore } from '@/stores/profilStore'
import { toastError } from '@/utils/toastConfig'
import EditUser from '@/components/EditUser.vue'
import type { Custom, Profil, StatusMat, UserRegister } from '@/types/user'
import { statusMap } from '@/utils/dataMap'

const userStore = useUserStore()
const profilStore = useProfilStore()


const user = ref<UserRegister | null>(null)
const profil = ref<Profil | null>(null)
const loading = ref(false)
const isOpenModalEdit = ref(false)
const dataSend = ref<Custom>()



const userInitials = computed(() => {
  const f = profil.value?.first_name?.charAt(0)?.toUpperCase() ?? 'S'
  const l = profil.value?.last_name?.charAt(0)?.toUpperCase() ?? 'D'
  return f + l
})


const statusText = (status: string) => statusMap.get(status as StatusMat) || status


const loadUser = async () => {
  loading.value = true
  try {
    if (!userStore.user) throw new Error('Utilisateur introuvable')

    user.value = userStore.user

    const res = await profilStore.showProfilUser(user.value.id!)
    profil.value = res?.data || null
  } catch (e) {
    console.error(e)
    toastError('Erreur lors du chargement du profil.')
  } finally {
    loading.value = false
  }
}


const openEditModal = () => {
  if (!user.value) return toastError("Impossible d'ouvrir la modification.")

  dataSend.value = { ...user.value, ...profil.value! }
  isOpenModalEdit.value = true
}

const closeEditModal = () => (isOpenModalEdit.value = false)

onMounted(loadUser)
</script>

<template>
  <section class="min-h-screen flex flex-col items-center px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-16 bg-gray-50">
    <!-- CARD -->
    <div
      v-if="!loading"
      class="w-full max-w-5xl bg-white shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200"
    >
      <!-- HEADER -->
      <div
        class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 sm:p-8 md:p-12 text-center text-white relative"
      >
        <!-- Avatar -->
        <div
          class="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border-3 sm:border-4 border-white shadow-lg text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wider"
        >
          {{ userInitials }}
        </div>

        <!-- Names -->
        <div class="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            {{ profil?.first_name }} {{ profil?.last_name }}
          </h2>
          <p class="text-gray-100 text-sm sm:text-base md:text-lg">@{{ user?.name }}</p>
        </div>

        <!-- Edit Button Floating -->
        <button
          @click="openEditModal"
          class="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-1 sm:gap-2"
        >
          <i class="fas fa-user-edit"></i>
          <span class="hidden sm:inline">Modifier</span>
        </button>
      </div>

      <!-- CONTENT -->
      <div class="p-4 sm:p-6 md:p-8 lg:p-12 text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
        <!-- Infos personnelles -->
        <div>
          <h3 class="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Informations personnelles</h3>

          <div class="space-y-3 sm:space-y-4">
            <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
              <span class="font-medium text-sm sm:text-base">Email :</span>
              <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700 truncate">{{ user?.email }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
              <span class="font-medium text-sm sm:text-base">Téléphone :</span>
              <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700">{{ profil?.phone }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
              <span class="font-medium text-sm sm:text-base">Genre :</span>
              <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700">{{ profil?.gender === 'male' || !profil?.gender ? 'Homme' : 'Femme' }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
              <span class="font-medium text-sm sm:text-base">Date de naissance :</span>
              <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700">{{ profil?.date_of_birth }}</span>
            </div>
          </div>
        </div>

        <!-- Autres infos -->
        <div>
          <h3 class="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Détails supplémentaires</h3>

          <div class="space-y-3 sm:space-y-4">
            <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
              <span class="font-medium text-sm sm:text-base">Lieu de naissance :</span>
              <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700">{{ profil?.place_of_birth }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
              <span class="font-medium text-sm sm:text-base">Statut matrimonial :</span>
              <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700">{{ statusText(profil?.status_mat!) }}</span>
            </div>

            <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-2 sm:pb-3 gap-1">
              <span class="font-medium text-sm sm:text-base">Nationalité :</span>
              <span class="text-sm sm:text-base text-gray-600 sm:text-gray-700">{{ profil?.nationality }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Suppression de compte -->
      <div class="border-t border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user-slash text-red-600 text-lg sm:text-xl"></i>
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-semibold text-red-800">Supprimer mon compte</h3>
                <p class="text-xs sm:text-sm text-red-600 mt-1">
                  Cette action est irreversible. Toutes vos donnees seront supprimees definitivement.
                </p>
              </div>
            </div>
            <router-link
              :to="{ name: 'delete-account' }"
              class="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <i class="fas fa-trash-alt"></i>
              <span>Supprimer</span>
            </router-link>
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

        <EditUser
          :form="dataSend!"
          :idProfil="profil?.id ?? ''"
          :id="user?.id ?? ''"
          @updated="closeEditModal"
        />
      </div>
    </div>

  </section>
</template>
