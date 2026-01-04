import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { userService } from '@/services/userService'
import { firebaseAuthService, type OAuthProviderType } from '@/services/firebaseAuthService'
import type { UserLogin, UserRegister } from '@/types/user'
import { safeParse } from '@/utils/convert'
import { toastSuccess, toastError } from '@/utils/toastConfig'
import { useLoading } from '@/utils/startLoading'
import type { User } from 'firebase/auth'

export const useUserStore = defineStore('user', () => {
  // --------------------------
  // Variables reactives
  // --------------------------
  const user = ref<UserRegister | null>(safeParse(localStorage.getItem('user')))
  const firebaseUser = ref<User | null>(null)
  const token = ref<string | null>(safeParse(localStorage.getItem('access_token')))
  const isAuthenticated = ref(!!user.value)
  const emailVerified = ref<boolean>(safeParse(localStorage.getItem('email_verified')) ?? false)
  const loading = useLoading()
  const error = ref<string | null>(null)

  const role = computed(() => user.value?.role)

  // --------------------------
  // Mutations
  // --------------------------
  function setAuth(accessToken: string, userData: UserRegister, verified: boolean = false) {
    user.value = userData
    isAuthenticated.value = !!accessToken
    token.value = accessToken
    emailVerified.value = verified
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('access_token', JSON.stringify(accessToken))
    localStorage.setItem('email_verified', JSON.stringify(verified))
  }

  function resetAuth() {
    isAuthenticated.value = false
    emailVerified.value = false
    firebaseUser.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('email_verified')
    localStorage.removeItem('visarequestId')
    localStorage.removeItem('user_id')
    user.value = null
    token.value = null
  }

  async function redirectDashboard() {
    if (!user.value?.role) return
    const userRole = user.value.role
    const routes: Record<string, string> = {
      admin: 'admin.dashboard',
      custom: 'custom.dashboard',
      agent: 'agent.users',
    }
    await router.push({ name: routes[userRole] ?? 'auth.login' })
  }

  // --------------------------
  // Helper pour erreurs Firebase (OAuth uniquement)
  // --------------------------
  function getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/popup-closed-by-user': 'Connexion annulee.',
      'auth/cancelled-popup-request': 'Une seule fenetre de connexion est autorisee.',
      'auth/account-exists-with-different-credential': 'Un compte existe deja avec cette adresse email.',
      'auth/network-request-failed': 'Erreur reseau. Verifiez votre connexion.',
      'auth/too-many-requests': 'Trop de tentatives. Veuillez reessayer plus tard.',
      'auth/operation-not-allowed': 'Ce fournisseur de connexion n\'est pas active.',
    }
    return errorMessages[errorCode] || 'Une erreur est survenue. Veuillez reessayer.'
  }

  // --------------------------
  // Actions Inscription (OTP Email)
  // --------------------------

  // Inscription directe (l'email a deja ete verifie par OTP)
  async function register(data: UserRegister) {
    loading.startLoading('Inscription en cours...')
    try {
      const response = await userService.register(data)
      setAuth(response.access_token, response.user, true)
      await redirectDashboard()
      toastSuccess('Compte cree avec succes !')
      return response
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message || "Erreur lors de l'inscription"
      toastError(message)
      error.value = message
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  // --------------------------
  // Actions Connexion
  // --------------------------
  async function login(credentials: UserLogin) {
    loading.startLoading('Connexion en cours')
    try {
      const response = await userService.login(credentials)
      setAuth(response.access_token, response.user, true)
      emailVerified.value = true
      await redirectDashboard()
      toastSuccess('Connexion reussie')
      return response
    } catch (err) {
      loading.handleError(err, 'Echec de la connexion. Verifiez vos identifiants.')
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  async function logout() {
    loading.startLoading('Deconnexion en cours')
    try {
      // Deconnexion Firebase (si connecte via OAuth)
      if (firebaseUser.value) {
        await firebaseAuthService.logout()
      }
      // Deconnexion backend
      try {
        await userService.logout()
      } catch {
        // Ignorer l'erreur 401 si le token est deja invalide
      }
      resetAuth()
      await router.push({ name: 'auth.login' })
      toastSuccess('Deconnexion reussie')
    } catch {
      // En cas d'erreur, forcer la deconnexion locale
      resetAuth()
      await router.push({ name: 'auth.login' })
    } finally {
      loading.stopLoading()
    }
  }

  // --------------------------
  // Actions Password Reset (Laravel)
  // --------------------------
  async function sendPasswordResetLink(email: string) {
    loading.startLoading('Envoi du lien...')
    try {
      await userService.sendPasswordResetLink(email)
      toastSuccess('Email de reinitialisation envoye')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message || "Erreur lors de l'envoi du lien"
      toastError(message)
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  async function verifyResetToken(email: string, token: string) {
    try {
      const response = await userService.verifyPasswordResetToken(email, token)
      return response
    } catch (err) {
      console.error('Erreur lors de la verification du token:', err)
      throw err
    }
  }

  async function resetPassword(email: string, token: string, newPassword: string) {
    loading.startLoading('Reinitialisation en cours...')
    try {
      await userService.resetPassword(email, token, newPassword)
      toastSuccess('Mot de passe reinitialise avec succes')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message || 'Erreur lors de la reinitialisation'
      toastError(message)
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  // --------------------------
  // Actions OAuth (Firebase)
  // --------------------------
  async function loginWithOAuth(provider: OAuthProviderType) {
    loading.startLoading(`Connexion avec ${provider}...`)
    try {
      // 1. Connexion OAuth Firebase
      const userCredential = await firebaseAuthService.signInWithOAuth(provider)
      firebaseUser.value = userCredential.user

      // 2. Obtenir le token Firebase
      const firebaseToken = await userCredential.user.getIdToken()

      // 3. Enregistrer/Connecter dans le backend Laravel
      const response = await userService.loginWithFirebase({
        firebase_token: firebaseToken,
        firebase_uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        photo_url: userCredential.user.photoURL,
        provider: provider,
      })

      // 4. Mettre a jour l'etat local avec le token Sanctum (OAuth = email verifie)
      setAuth(response.access_token, response.user, true)
      emailVerified.value = true

      await redirectDashboard()
      toastSuccess(`Connexion via ${provider} reussie`)
      return response
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      if (firebaseError.code) {
        const message = getFirebaseErrorMessage(firebaseError.code)
        toastError(message)
        error.value = message
      } else {
        loading.handleError(err, 'Erreur lors de la connexion OAuth')
      }
      throw err
    } finally {
      loading.stopLoading()
    }
  }

  // --------------------------
  // Actions CRUD Users
  // --------------------------
  const createUser = async (data: UserRegister) => {
    loading.startLoading('Creation du user en cours...')
    try {
      const response = await userService.createUser(data)
      toastSuccess(response.message || 'user cree avec succes')
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la creation du user')
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
      loading.handleError(err, 'Erreur lors de la recuperation du user')
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
      loading.handleError(err, 'Erreur lors de la recuperation du user')
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
      loading.handleError(err, 'Erreur lors de la recuperation des users')
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
      loading.handleError(err, 'Erreur lors de la recuperation des clients')
    } finally {
      loading.stopLoading()
    }
  }

  const editUser = async (id: string, data: UserRegister) => {
    loading.startLoading('Mise a jour du user en cours...')
    try {
      const response = await userService.editUser(id, data)
      toastSuccess(response.message || 'user mis a jour avec succes')
      return response
    } catch (err) {
      loading.handleError(err, 'Erreur lors de la mise a jour du user')
    } finally {
      loading.stopLoading()
    }
  }

  const deleteUser = async (id: string) => {
    loading.startLoading('Suppression du user en cours...')
    try {
      const response = await userService.deleteUser(id)
      toastSuccess(response.message || 'user supprime avec succes')
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
    firebaseUser,
    isAuthenticated,
    emailVerified,
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

    // Password Reset (Laravel)
    sendPasswordResetLink,
    resetPassword,
    verifyResetToken,

    // OAuth (Firebase)
    loginWithOAuth,
  }
})
