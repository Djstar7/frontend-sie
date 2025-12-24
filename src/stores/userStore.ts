import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { userService } from '@/services/userService'
import type { UserLogin, UserRegister } from '@/types/user'
import { safeParse } from '@/utils/convert'
import { toastSuccess } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'

export const useUserStore = defineStore('user', () => {
  // --------------------------
  // Variables réactives
  // --------------------------
  const user = ref<UserRegister | null>(safeParse(localStorage.getItem('user')))
  const token = ref<string | null>(safeParse(localStorage.getItem('access_token')))
  const isAuthenticated = ref(!!user.value)
  const loading = useLoading()
  const error = ref<string | null>(null)

  const role = computed(() => user.value?.role)

  // --------------------------
  // Mutations
  // --------------------------
  function setAuth(a: string, u: UserRegister) {
    user.value = u
    isAuthenticated.value = !!a
    token.value = a
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('access_token', JSON.stringify(a))
  }

  function resetAuth() {
    isAuthenticated.value = false
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('visarequestId')
    localStorage.removeItem('user_id')
    user.value = null
  }

  async function redirectDashboard() {
    if (!user.value?.role) return
    const role = user.value.role
    const routes: Record<string, string> = {
      admin: 'admin.dashboard',
      custom: 'custom.dashboard',
      agent: 'agent.users',
    }
    await router.push({ name: routes[role] ?? 'auth.login' })
  }

  // --------------------------
  // Actions
  // --------------------------
  async function register(data: UserRegister) {
    loading.startLoading('Enregistrement en cours')
    try {
      const response = await userService.register(data)
      setAuth(response.access_token, response.user)
      await redirectDashboard()
      toastSuccess('Inscription réussie')
      return response
    } catch (err) {
      loading.handleError(err, "Échec de l'enregistrement")
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  async function login(credentials: UserLogin) {
    loading.startLoading('Connexion en cours')
    try {
      const response = await userService.login(credentials)
      setAuth(response.access_token, response.user)
      await redirectDashboard()
      toastSuccess('Connexion réussie')
      return response
    } catch (err) {
      loading.handleError(err, 'Échec de la connexion. Vérifiez vos identifiants.')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  async function logout() {
    loading.startLoading('Déconnexion en cours')
    try {
      await userService.logout()
      resetAuth()
      await router.push({ name: 'auth.login' })
      toastSuccess('Déconnexion réussie')
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la déconnexion')
    } finally {
      loading.stopLoading()
    }
  }

  const createUser = async (data: UserRegister) => {
    loading.startLoading('Création du user en cours...')
    try {
      const response = await userService.createUser(data)
      toastSuccess(response.message || 'user créé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la création du user')
    } finally {
      loading.stopLoading()
    }
  }

  const showUser = async (id: string) => {
    loading.startLoading('Chargement du user en cours...')
    try {
      const response = await userService.showUser(id)
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la récupération du user')
    } finally {
      loading.stopLoading()
    }
  }
  const showUserByAgent = async (id: string) => {
    loading.startLoading('Chargement du user en cours...')
    try {
      const response = await userService.showUserByAgent(id)
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la récupération du user')
    } finally {
      loading.stopLoading()
    }
  }

  const getUsers = async () => {
    loading.startLoading('Chargement des users en cours...')
    try {
      const response = await userService.getUsers()
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la récupération des users')
    } finally {
      loading.stopLoading()
    }
  }
  const getCustoms = async () => {
    loading.startLoading('Chargement des clients en cours...')
    try {
      const response = await userService.getCustoms()
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la récupération des clients')
    } finally {
      loading.stopLoading()
    }
  }

  const editUser = async (id: string, data: UserRegister) => {
    loading.startLoading('Mise à jour du user en cours...')
    try {
      const response = await userService.editUser(id, data)
      toastSuccess(response.message || 'user mis à jour avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la mise à jour du user')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteUser = async (id: string) => {
    loading.startLoading('Suppression du user en cours...')
    try {
      const response = await userService.deleteUser(id)
      // users.splice(users.findIndex(p => p.id === id), 1)
      // if (user.value?.id === id) user.value = null
      toastSuccess(response.message || 'user supprimé avec succès')
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la suppression du user')
    } finally {
      loading.stopLoading()
    }
  }
  // --------------------------
  return {
    user,
    isAuthenticated,
    loading,
    error,
    role,
    token,

    register,
    login,
    logout,
    setAuth,
    resetAuth,

    createUser,
    showUser,
    getUsers,
    getCustoms,
    editUser,
    deleteUser,
    showUserByAgent,
  }
})
