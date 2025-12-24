<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import UserCard from '@/components/UserCard.vue'
import { useUserStore } from '@/stores/userStore'
import type { Profil, UserRegister } from '@/types/user'
import { useProfilStore } from '@/stores/profilStore'
import { statusMap } from '@/utils/dataMap'

const userStore = useUserStore()
const profilStore = useProfilStore()


const users = ref<UserRegister[]>([])
const profils = ref<Record<string, Profil | null>>({})
const loading = ref(true)
const error = ref<string | null>(null)


const currentPage = ref(1)
const itemsPerPage = 12
const filter = ref('')
const statusFilter = ref('all')


const fetchProfil = async (id: string) => {
  try {
    const resProfil = await profilStore.showProfilUser(id)
    profils.value[id] = resProfil?.data ?? null
  } catch (err) {
    console.error('Erreur lors du chargement du profil:', err)
  }
}

onMounted(async () => {
  try {
    const res = await userStore.getCustoms()
    users.value = res?.data ?? []


    await Promise.all(users.value.map(user => {
        if (user.id) {
            return fetchProfil(user.id)
        }
        return Promise.resolve()
    }))

  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs :', err)
  } finally {
    loading.value = false
  }
})


currentPage.value = 1
const filteredUsers = computed(() => {

  let result = users.value
  const searchString = filter.value.toLowerCase().trim()
  const currentStatusFilter = statusFilter.value

  if (currentStatusFilter !== 'all') {
    result = result.filter((user) => {
        const profil = user.id ? profils.value[user.id] : null
        return profil?.status_mat === currentStatusFilter
    })
  }

  if (searchString) {
    result = result.filter((user) => {
        const profil = user.id ? profils.value[user.id] : null

        const fullName = profil?.first_name && profil?.last_name
          ? `${profil.first_name} ${profil.last_name}`.toLowerCase()
          : (user.name || '').toLowerCase()

        const email = (user.email || '').toLowerCase()

        return fullName.includes(searchString) || email.includes(searchString)
    })
  }

  return result
})




const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
    <div class="mx-auto">
      <!-- Header -->
      <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-blue-700 font-extrabold mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
        <i class="fas fa-user-friends text-blue-500 text-lg sm:text-2xl md:text-3xl"></i>
        <span class="hidden sm:inline">Liste des Utilisateurs</span>
        <span class="sm:hidden">Utilisateurs</span>
      </h1>

      <!-- Filters -->
      <div class="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-lg mb-4 sm:mb-6 md:mb-8 flex flex-col md:flex-row gap-3 sm:gap-4">
        <div class="flex-1 relative">
          <i class="fas fa-search absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="filter"
            type="text"
            placeholder="Rechercher..."
            class="w-full py-2 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        <div class="w-full md:w-48 lg:w-60 relative">
          <i class="fas fa-ring absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <select
            v-model="statusFilter"
            class="w-full py-2 sm:py-3 pl-10 sm:pl-12 pr-8 sm:pr-10 text-sm sm:text-base border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option v-for="[key, value] in statusMap" :key="key" :value="key">
              {{ value }}
            </option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-500 py-8 sm:py-10">
        <i class="fas fa-spinner fa-spin text-3xl sm:text-4xl text-blue-500"></i>
        <p class="mt-3 text-base sm:text-lg">Chargement...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-500 py-8 sm:py-10">
        <i class="fas fa-exclamation-triangle text-3xl sm:text-4xl"></i>
        <p class="mt-3 text-base sm:text-lg">{{ error }}</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredUsers.length === 0" class="text-center text-gray-500 py-8 sm:py-10 px-4">
        <i class="fas fa-exclamation-circle text-3xl sm:text-4xl text-orange-500"></i>
        <p class="mt-3 text-sm sm:text-base md:text-lg">Aucun utilisateur trouvé.</p>
      </div>

      <!-- Cards grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <UserCard v-for="u in paginatedUsers" :key="u.id" :userId="u.id!" />
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 px-3 sm:px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 gap-3"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-full text-blue-600 border-blue-300 disabled:opacity-50 hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2 text-sm"
        >
          <i class="fas fa-arrow-left"></i> <span class="hidden sm:inline">Précédent</span>
        </button>
        <span class="text-gray-600 font-semibold text-sm text-center">
          Page {{ currentPage }} / {{ totalPages }}
          <span class="text-xs text-gray-500 ml-1 sm:ml-2">({{ filteredUsers.length }})</span>
        </span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-full text-blue-600 border-blue-300 disabled:opacity-50 hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2 text-sm"
        >
          <span class="hidden sm:inline">Suivant</span> <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>
