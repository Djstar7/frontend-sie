import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

// Création de l'instance Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8001/api',
  headers: {
    Accept: 'application/json',
  },
})

// Intercepteur pour ajouter le token automatiquement aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = useUserStore().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Intercepteur pour gérer les réponses et rediriger en cas de 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Supprime le token du store
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('visaRequestId')

      router.push({ name: 'auth.login' })
    }

    return Promise.reject(error)
  },
)

// Helper pour l'upload de fichiers
const uploadFile = (url: string, formData: FormData) => {
  return api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// Helper pour l'édition avec méthode PUT
const uploadEditFile = (url: string, formData: FormData) => {
  if (!formData.has('_method')) formData.append('_method', 'PUT')
  return api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export { api, uploadFile, uploadEditFile }
