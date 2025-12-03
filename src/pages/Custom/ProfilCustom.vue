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
  <section class="min-h-screen flex flex-col items-center px-6 py-16 bg-gray-50">
    <!-- CARD -->
    <div
      v-if="!loading"
      class="w-full max-w-5xl bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-200 animate__animated animate__fadeIn"
    >
      <!-- HEADER -->
      <div
        class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 text-center text-white relative"
      >
        <!-- Avatar -->
        <div
          class="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border-4 border-white shadow-lg text-5xl font-extrabold tracking-wider"
        >
          {{ userInitials }}
        </div>

        <!-- Names -->
        <div class="mt-6 space-y-3">
          <h2 class="text-3xl md:text-4xl font-bold">
            {{ profil?.first_name }} {{ profil?.last_name }}
          </h2>
          <p class="text-gray-100 text-lg">@{{ user?.name }}</p>
        </div>

        <!-- Edit Button Floating -->
        <button
          @click="openEditModal"
          class="absolute top-6 right-6 px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
        >
          <i class="fas fa-user-edit"></i> Modifier
        </button>
      </div>

      <!-- CONTENT -->
      <div class="p-12 text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Infos personnelles -->
        <div>
          <h3 class="text-xl font-semibold mb-4">Informations personnelles</h3>

          <div class="space-y-4">
            <div class="flex justify-between border-b pb-3">
              <span class="font-medium">Email :</span>
              <span>{{ user?.email }}</span>
            </div>

            <div class="flex justify-between border-b pb-3">
              <span class="font-medium">Téléphone :</span>
              <span>{{ profil?.phone }}</span>
            </div>

            <div class="flex justify-between border-b pb-3">
              <span class="font-medium">Genre :</span>
              <span>{{ profil?.gender === 'male' || !profil?.gender ? 'Homme' : 'Femme' }}</span>
            </div>

            <div class="flex justify-between border-b pb-3">
              <span class="font-medium">Date de naissance :</span>
              <span>{{ profil?.date_of_birth }}</span>
            </div>
          </div>
        </div>

        <!-- Autres infos -->
        <div>
          <h3 class="text-xl font-semibold mb-4">Détails supplémentaires</h3>

          <div class="space-y-4">
            <div class="flex justify-between border-b pb-3">
              <span class="font-medium">Lieu de naissance :</span>
              <span>{{ profil?.place_of_birth }}</span>
            </div>

            <div class="flex justify-between border-b pb-3">
              <span class="font-medium">Statut matrimonial :</span>
              <span>{{ statusText(profil?.status_mat!) }}</span>
            </div>

            <div class="flex justify-between border-b pb-3">
              <span class="font-medium">Nationalité :</span>
              <span>{{ profil?.nationality }}</span>
            </div>
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

        <EditUser
          :form="dataSend!"
          :idProfil="profil?.id"
          :id="user?.id!"
          @updated="closeEditModal"
        />
      </div>
    </div>
  </section>
</template>
