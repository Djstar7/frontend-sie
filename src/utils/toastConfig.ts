// toastConfig.ts
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

type ToastType = 'info' | 'success' | 'error' | 'warning' | 'loading' | 'default'
type ToastTheme = 'auto' | 'light' | 'dark' | 'colored'

// Mapping pour border-left en fonction du type de toast
const borderColors: Record<ToastType, string> = {
  success: 'border-l-4 border-green-600',
  error: 'border-l-4 border-red-500',
  warning: 'border-l-4 border-yellow-500',
  info: 'border-l-4 border-blue-500',
  loading: 'border-l-4 border-orange-400',
  default: 'border-l-4 border-gray-700',
}

// Options communes
const commonOptions = {
  hideProgressBar: false,
  pauseOnHover: true,
  closeOnClick: true,
  theme: 'light' as ToastTheme,
  toastClassName:
    'rounded-lg shadow-lg px-4 py-2 text-sm font-medium backdrop-blur-md flex items-center',
  bodyClassName: 'flex items-center',
  progressClassName: 'bg-white/50',
  position: 'top-center' as const, // Tous les toasts seront en top-center
}

// Fonction principale
export function showToast(message: string, type: ToastType = 'default', autoClose = 4000) {
  toast(message, {
    ...commonOptions,
    type,
    autoClose,
    toastClassName: `${commonOptions.toastClassName} ${borderColors[type]}`,
  })
}

// Fonctions pratiques
export const toastInfo = (msg: string) => showToast(msg, 'info')
export const toastSuccess = (msg: string) => showToast(msg, 'success')
export const toastWarning = (msg: string) => showToast(msg, 'warning')
export const toastError = (msg: string) => showToast(msg, 'error')
export const toastLoading = (msg: string) => showToast(msg, 'loading')
