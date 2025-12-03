import { ref } from 'vue'
import { toastError } from './toastConfig'

// Type pour une erreur venant de l'API
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export const useLoading = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const startLoading = (message: string) => {
    // toastInfo(message)
    loading.value = true
    error.value = null
  }

  const stopLoading = () => {
    loading.value = false
  }

  const handleError = (err: unknown, defaultMsg: string): string => {
    const apiErr = err as ApiError
    const message: string = apiErr.response?.data?.message ?? defaultMsg
    error.value = message
    toastError(message)
    return message
  }

  return { startLoading, stopLoading, handleError }
}
