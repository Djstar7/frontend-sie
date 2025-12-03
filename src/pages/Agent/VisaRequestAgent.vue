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
  <div class=" bg-gray-50 min-h-screen">
    <div class=" mx-auto">
        <h1 class="text-4xl text-blue-700 font-extrabold mb-8 flex items-center gap-3">
            <i class="fas fa-user-friends text-blue-500"></i>
            Liste des Utilisateurs
        </h1>

        <div class="bg-white p-5 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row gap-4">

            <div class="flex-1 relative">
                <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                    v-model="filter"
                    type="text"
                    placeholder="Filtrer par nom ou email..."
                    class="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
            </div>

            <div class="w-full md:w-60 relative">
                <i class="fas fa-ring absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <select
                    v-model="statusFilter"
                    class="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
                >
                    <option value="all">Tous les statuts</option>
                    <option v-for="[key, value] in statusMap" :key="key" :value="key">
                      {{ value }}
                    </option>
                </select>
                <i class="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
        </div>

        <div v-if="loading" class="text-center text-gray-500 py-10">
            <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
            <p class="mt-3 text-lg">Chargement des utilisateurs...</p>
        </div>
        <div v-else-if="error" class="text-center text-red-500 py-10">
            <i class="fas fa-exclamation-triangle text-4xl"></i>
            <p class="mt-3 text-lg">{{ error }}</p>
        </div>
        <div v-else-if="filteredUsers.length === 0" class="text-center text-gray-500 py-10">
            <i class="fas fa-exclamation-circle text-4xl text-orange-500"></i>
            <p class="mt-3 text-lg">Aucun utilisateur trouvé correspondant à votre recherche et filtre.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserCard v-for="u in paginatedUsers" :key="u.id" :userId="u.id!" />
        </div>

        <div
            v-if="totalPages > 1"
            class="flex justify-between items-center mt-8 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100"
        >
            <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 border rounded-full text-blue-600 border-blue-300 disabled:opacity-50 hover:bg-blue-50 transition font-medium flex items-center gap-2"
            >
                <i class="fas fa-arrow-left"></i> Précédent
            </button>
            <span class="text-gray-600 font-semibold">
                Page {{ currentPage }} / {{ totalPages }}
                <span class="text-sm text-gray-500 ml-2">({{ filteredUsers.length }} résultats)</span>
            </span>
            <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 border rounded-full text-blue-600 border-blue-300 disabled:opacity-50 hover:bg-blue-50 transition font-medium flex items-center gap-2"
            >
                Suivant <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    </div>
  </div>
</template>
