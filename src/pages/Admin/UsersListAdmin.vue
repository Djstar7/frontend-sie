<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Custom, Profil, UserRegister } from '@/types/user'
import { useUserStore } from '@/stores/userStore'
import { useProfilStore } from '@/stores/profilStore'
import { toastSuccess } from '@/utils/toastConfig'
import EditUser from '@/components/EditUser.vue'
import CreateUser from '@/components/CreateUser.vue'
import { statusMap } from '@/utils/dataMap'
import DeleteModalCustom from '@/components/DeleteModalCustom.vue'

const users = ref<UserRegister[]>([])
const profils = ref<Record<string, Profil | null>>({})
const userData = ref<Custom>()
const isLoading = ref(true)
const error = ref<string | null>(null)
const idProfil = ref<string | undefined>(undefined)

const isOpenModalEditUser = ref(false)
const isOpenModalCreateUser = ref(false)

const isOpenDelete = ref(false)
const selectedId = ref<string | null>(null)

const search = ref('')

const route = useRoute()
const initialRole = (route.query.role as string)?.toLowerCase()
const filterRole = ref<string>(initialRole || '')

const userStore = useUserStore()
const profilStore = useProfilStore()

const currentPage = ref(1)
const perPage = ref(20)

const fetchUsers = async () => {
  isLoading.value = true
  error.value = null

  try {
    const res = await userStore.getUsers()
    users.value = res?.data ?? []

    for (const user of users.value) {
      if (user.role === 'custom' && user.id) {
        await fetchProfil(user.id)
      }
    }
  } catch (err) {
    console.error('Erreur lors du chargement des utilisateurs:', err)
  } finally {
    isLoading.value = false
  }
}

const fetchProfil = async (id: string) => {
  try {
    const resProfil = await profilStore.showProfilUser(id)
    profils.value[id] = resProfil?.data ?? null
  } catch (err) {
    console.error('Erreur lors du chargement du profil:', err)
  }
}

const addUser = () => (isOpenModalCreateUser.value = true)

const editUser = (user: UserRegister, profil: Profil | null) => {
  if (!profil) return
  isOpenModalEditUser.value = true

  const { id, ...profilWithoutId } = profil as { id?: string } & Omit<Profil, 'id'>
  userData.value = {
    ...user,
    ...profilWithoutId,
  }
  idProfil.value = id
}

const handleUserCreated = () => {
  fetchUsers()
  isOpenModalCreateUser.value = false
}

const handleUserUpdated = () => {
  fetchUsers()
  isOpenModalEditUser.value = false
}

const openDelete = (id: string) => {
  selectedId.value = id
  isOpenDelete.value = true
}

const deleteUser = async (id: string | null) => {
  if (!id) return

  try {
    const res = await userStore.deleteUser(id)
    users.value = users.value.filter((u) => u.id !== id)
    toastSuccess(res?.message || 'Supprimé avec succès')
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
  } finally {
    isOpenDelete.value = false
  }
}

const filteredUsers = computed(() => {
  const term = search.value.toLowerCase()

  return users.value.filter((u) => {
    const profil = profils.value[u.id ?? '']

    const matchesSearch =
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      profil?.first_name?.toLowerCase().includes(term) ||
      profil?.last_name?.toLowerCase().includes(term)

    const matchesRole = filterRole.value ? u.role === filterRole.value : true

    return matchesSearch && matchesRole
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredUsers.value.slice(start, start + perPage.value)
})

watch(
  [search, filterRole, users],
  () => {
    currentPage.value = 1
  },
  { deep: true },
)

onMounted(fetchUsers)

// --- FONCTIONNALITÉ D'EXPORTATION CSV ---

// Fonction utilitaire pour convertir un tableau d'objets en chaîne CSV
const convertToCSV = (data: UserRegister[]) => {
  const headers = [
    'Nom complet',
    "Nom d'utilisateur",
    'Email',
    'Téléphone',
    'Rôle',
    'Statut Mat.',
    'Pays',
  ]
  const headerRow = headers.join(';') + '\n'

  const csvContent = data
    .map((user) => {
      const profil = profils.value[user.id ?? '']

      // Encodage des chaînes pour éviter les problèmes avec les virgules/accents dans les données
      const sanitize = (str: string | undefined | null) => {
        if (!str) return 'N/A'
        // Assurez-vous que l'encodage est UTF-8 pour les accents
        return `"${String(str).replace(/"/g, '""')}"`
      }

      const fullName = sanitize(`${profil?.first_name || 'N/A'} ${profil?.last_name || 'N/A'}`)
      const name = sanitize(user.name)
      const email = sanitize(user.email)
      const phone = sanitize(profil?.phone)
      const role = sanitize(user.role)
      const statusMat = sanitize(profil?.status_mat ? statusMap.get(profil.status_mat) : undefined)
      const nationality = sanitize(profil?.nationality)

      // Utilisez le point-virgule (;) comme séparateur pour éviter les conflits avec les virgules dans les données
      return [fullName, name, email, phone, role, statusMat, nationality].join(';')
    })
    .join('\n')

  return headerRow + csvContent
}

// Fonction pour déclencher le téléchargement du fichier CSV
const exportToCSV = () => {
  if (filteredUsers.value.length === 0) {
    alert('Aucune donnée à exporter.')
    return
  }

  // Nous exportons les utilisateurs filtrés (tous les utilisateurs si aucun filtre)
  const csv = convertToCSV(filteredUsers.value)

  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' }) // Ajout de \ufeff pour le BOM UTF-8

  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'utilisateurs.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// --- FIN FONCTIONNALITÉ D'EXPORTATION CSV ---
</script>
<template>
  <div class="p-3 sm:p-4 md:p-6 w-full bg-gray-50 min-h-screen">
    <div
      class="flex flex-col md:flex-row md:justify-between items-center gap-3 sm:gap-4 mb-4 sm:mb-6 border-b-2 border-indigo-200 pb-3"
    >
      <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-indigo-700 text-center w-full">
        <i class="fas fa-users-cog mr-2 sm:mr-3"></i> Gestion des Utilisateurs
      </h1>
    </div>

    <div
      class="flex flex-col w-full items-stretch mb-4 sm:mb-6 gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm"
    >
      <div class="flex flex-col sm:flex-row w-full items-stretch sm:items-center gap-3 sm:gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher (Nom, Email, Prénom...)"
          class="w-full sm:flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-150"
        />

        <select
          v-model="filterRole"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-150 capitalize font-medium"
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        <button
          @click="exportToCSV"
          :disabled="isLoading || filteredUsers.length === 0"
          class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-semibold shadow-md transition duration-150 cursor-pointer w-full sm:w-auto justify-center disabled:opacity-50"
        >
          <i class="fas fa-file-csv"></i>
          <span class="hidden sm:inline">Exporter en CSV</span>
          <span class="sm:hidden">CSV</span>
        </button>

        <button
          @click="addUser"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-semibold shadow-md transition duration-150 cursor-pointer w-full sm:w-auto justify-center"
        >
          <i class="fas fa-user-plus"></i>
          <span class="hidden sm:inline">Ajouter un utilisateur</span>
          <span class="sm:hidden">Ajouter</span>
        </button>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-12 text-indigo-600 gap-3"
    >
      <i class="fas fa-spinner fa-spin text-4xl"></i>
      <p class="text-xl font-medium">Chargement des utilisateurs...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-md"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <div
      v-else
      class="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-xl border border-gray-200"
    >
      <!-- Mobile cards view -->
      <div class="block lg:hidden space-y-3">
        <div
          v-for="user in paginatedUsers"
          :key="user.id"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <i class="fas fa-user-circle text-gray-400 text-2xl"></i>
              <div>
                <p class="font-semibold text-gray-900 text-sm">
                  {{ profils[user.id!]?.first_name || 'N/A' }} {{ profils[user.id!]?.last_name || 'N/A' }}
                </p>
                <p class="text-gray-500 text-xs">@{{ user.name }}</p>
              </div>
            </div>
            <span
              :class="[
                'px-2 py-1 text-xs rounded-full font-semibold capitalize',
                { 'bg-blue-100 text-blue-800': user.role === 'custom' },
                { 'bg-purple-100 text-purple-800': user.role === 'agent' },
                { 'bg-indigo-100 text-indigo-800': user.role === 'admin' },
              ]"
            >
              {{ user.role }}
            </span>
          </div>
          <div class="space-y-1 text-sm text-gray-600 mb-3">
            <p><span class="font-medium">Email:</span> {{ user.email }}</p>
            <p><span class="font-medium">Tél:</span> {{ profils[user.id!]?.phone || 'N/A' }}</p>
            <p><span class="font-medium">Statut:</span> {{ statusMap.get(profils[user.id!]?.status_mat!) || 'N/A' }}</p>
            <p><span class="font-medium">Pays:</span> {{ profils[user.id!]?.nationality || 'N/A' }}</p>
          </div>
          <div class="flex gap-3 pt-2 border-t border-gray-200">
            <button
              @click.stop="editUser(user, profils[user.id!])"
              class="flex-1 flex items-center justify-center gap-2 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button
              @click="openDelete(user.id!)"
              class="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition text-sm font-medium"
            >
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-indigo-50 sticky top-0">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Nom complet
              </th>
              <th class="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Email
              </th>
              <th class="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Téléphone
              </th>
              <th class="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Rôle
              </th>
              <th class="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Statut Mat.
              </th>
              <th class="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Pays
              </th>
              <th class="px-4 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in paginatedUsers" :key="user.id" class="transition duration-100 hover:bg-gray-50">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <i class="fas fa-user-circle text-gray-400 text-2xl"></i>
                  <div class="flex flex-col">
                    <span class="font-semibold text-gray-900">
                      {{ profils[user.id!]?.first_name || 'N/A' }}
                      {{ profils[user.id!]?.last_name || 'N/A' }}
                    </span>
                    <span class="text-gray-500 text-sm">{{ user.name }}</span>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3 text-sm text-gray-700">{{ user.email }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ profils[user.id!]?.phone || 'N/A' }}</td>

              <td class="px-4 py-3">
                <span
                  :class="[
                    'px-3 py-1 text-xs rounded-full font-semibold capitalize',
                    { 'bg-blue-100 text-blue-800': user.role === 'custom' },
                    { 'bg-purple-100 text-purple-800': user.role === 'agent' },
                    { 'bg-indigo-100 text-indigo-800': user.role === 'admin' },
                  ]"
                >
                  {{ user.role }}
                </span>
              </td>

              <td class="px-4 py-3 text-sm text-gray-700 capitalize">
                {{ statusMap.get(profils[user.id!]?.status_mat!) || 'N/A' }}
              </td>

              <td class="px-4 py-3 text-sm text-gray-700 capitalize">
                {{ profils[user.id!]?.nationality || 'N/A' }}
              </td>

              <td class="px-4 py-3 flex gap-3 text-xl">
                <button
                  @click.stop="editUser(user, profils[user.id!])"
                  class="text-indigo-600 hover:text-indigo-800 transition"
                  title="Modifier l'utilisateur"
                >
                  <i class="fas fa-edit"></i>
                </button>

                <button
                  @click="openDelete(user.id!)"
                  class="text-red-600 hover:text-red-800 transition"
                  title="Supprimer l'utilisateur"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p
        v-if="filteredUsers.length === 0"
        class="text-center py-6 sm:py-8 text-base sm:text-lg font-medium text-gray-500"
      >
        <i class="fas fa-info-circle mr-2"></i> Aucun utilisateur trouvé correspondant aux critères.
      </p>

      <div
        v-if="totalPages > 1"
        class="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 sm:mt-6 px-3 sm:px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
      >
        <button
          @click="currentPage > 1 && currentPage--"
          :disabled="currentPage === 1"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-full text-indigo-600 border-indigo-300 disabled:opacity-50 hover:bg-indigo-50 transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <i class="fas fa-arrow-left"></i> <span class="hidden sm:inline">Précédent</span>
        </button>

        <span class="text-gray-700 font-semibold text-sm sm:text-base text-center">
          Page {{ currentPage }} / {{ totalPages }}
          <span class="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">({{ filteredUsers.length }} résultats)</span>
        </span>

        <button
          @click="currentPage < totalPages && currentPage++"
          :disabled="currentPage === totalPages"
          class="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-full text-indigo-600 border-indigo-300 disabled:opacity-50 hover:bg-indigo-50 transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <span class="hidden sm:inline">Suivant</span> <i class="fas fa-arrow-right"></i>
        </button>
      </div>

      <div
        v-if="isOpenModalCreateUser"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl relative transition-all duration-300"
        >
          <button
            @click="isOpenModalCreateUser = false"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          >
            <i class="fas fa-times"></i>
          </button>
          <CreateUser @created="handleUserCreated" />
        </div>
      </div>

      <div
        v-if="isOpenModalEditUser"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl relative transition-all duration-300"
        >
          <button
            @click="isOpenModalEditUser = false"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          >
            <i class="fas fa-times"></i>
          </button>
          <EditUser
            :form="userData!"
            :id="userData?.id!"
            :idProfil="idProfil!"
            @updated="handleUserUpdated"
          />
        </div>
      </div>

      <DeleteModalCustom
        v-if="isOpenDelete"
        :message="'cet utilisateur'"
        :confirmText="userData?.name ?? 'Utilisateur'"
        @close="isOpenDelete = false"
        @confirm="deleteUser(selectedId)"
      />
    </div>
  </div>
</template>
