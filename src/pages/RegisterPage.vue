<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { userService } from '@/services/userService'
import type { UserRegister } from '@/types/user'
import { validateForm, isEmail, isPassword, required, isSameAs } from '@/utils/validateForm'
import { toastSuccess, toastError } from '@/utils/toastConfig'

const userStore = useUserStore()

// Etapes du stepper (2 etapes)
type Step = 'form' | 'otp'
const currentStep = ref<Step>('form')

// Donnees du formulaire
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// OTP - 6 champs separes
const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const otpError = ref(false)
const otpErrorMessage = ref('')

// Etats
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Erreurs
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Timer pour le renvoi du code
const resendTimer = ref(0)
const canResend = computed(() => resendTimer.value === 0)

const startResendTimer = () => {
  resendTimer.value = 60
  const interval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

// Configuration des etapes du stepper
const steps = [
  { key: 'form', label: 'Informations', icon: 'fas fa-user' },
  { key: 'otp', label: 'Verification', icon: 'fas fa-key' },
]

const stepIndex = computed(() => {
  return steps.findIndex(s => s.key === currentStep.value)
})

// Code OTP complet
const otpCode = computed(() => otpDigits.value.join(''))
const isOtpComplete = computed(() => otpCode.value.length === 6)

// Gestion des champs OTP
const setOtpRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    otpRefs.value[index] = el
  }
}

const handleOtpInput = async (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  // Ne garder que le dernier chiffre
  if (value.length > 1) {
    otpDigits.value[index] = value.slice(-1)
  }

  // Passer au champ suivant si un chiffre est entre
  if (value && index < 5) {
    await nextTick()
    otpRefs.value[index + 1]?.focus()
  }

  // Reinitialiser l'erreur
  otpError.value = false
  otpErrorMessage.value = ''

  // Verifier automatiquement quand tous les champs sont remplis
  if (isOtpComplete.value) {
    await verifyOtpCode()
  }
}

const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
  // Retour arriere
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
  // Fleche gauche
  if (event.key === 'ArrowLeft' && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
  // Fleche droite
  if (event.key === 'ArrowRight' && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
}

const handleOtpPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  // Bloquer le coller
  toastError('Le collage n\'est pas autorise. Veuillez saisir le code manuellement.')
}

// Validation du formulaire
const validateRegisterForm = () => {
  const { isValid, errors: validationErrors } = validateForm(form, {
    name: [required('Le pseudo est obligatoire')],
    email: [required("L'email est obligatoire"), isEmail()],
    password: [required('Le mot de passe est obligatoire'), isPassword()],
    confirmPassword: [
      required('La confirmation est obligatoire'),
      isSameAs(form.password, 'Les mots de passe ne correspondent pas'),
    ],
  })

  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!isValid) {
    for (const key in validationErrors) {
      const errorMessages = validationErrors[key as keyof typeof validationErrors]
      if (errorMessages && errorMessages.length > 0) {
        errors[key as keyof typeof errors] = errorMessages[0]
      }
    }
  }

  return isValid
}

// Etape 1: Envoyer le formulaire et le code OTP
const handleSubmitForm = async () => {
  if (!validateRegisterForm()) return

  isLoading.value = true
  try {
    await userService.sendEmailCode(form.email)
    toastSuccess('Code de verification envoye a votre email')
    currentStep.value = 'otp'
    startResendTimer()
    // Focus sur le premier champ OTP
    await nextTick()
    otpRefs.value[0]?.focus()
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } }
    const message = axiosError.response?.data?.message || "Erreur lors de l'envoi du code"
    toastError(message)
    errors.email = message
  } finally {
    isLoading.value = false
  }
}

// Verifier le code OTP et creer le compte
const verifyOtpCode = async () => {
  isLoading.value = true
  otpError.value = false
  otpErrorMessage.value = ''

  try {
    // 1. Verifier le code OTP
    await userService.verifyEmailCode(form.email, otpCode.value)

    // 2. Creer le compte
    const userData: UserRegister = {
      name: form.name,
      email: form.email,
      password: form.password,
    }
    await userStore.register(userData)
    // La redirection est geree dans le store
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } }
    const message = axiosError.response?.data?.message || 'Code invalide ou expire'
    otpError.value = true
    otpErrorMessage.value = message
    toastError(message)
    // Vider les champs OTP
    otpDigits.value = ['', '', '', '', '', '']
    await nextTick()
    otpRefs.value[0]?.focus()
  } finally {
    isLoading.value = false
  }
}

// Renvoyer le code
const handleResendCode = async () => {
  if (!canResend.value) return

  isLoading.value = true
  try {
    await userService.resendEmailCode(form.email)
    toastSuccess('Nouveau code envoye')
    startResendTimer()
    otpDigits.value = ['', '', '', '', '', '']
    otpError.value = false
    otpErrorMessage.value = ''
    await nextTick()
    otpRefs.value[0]?.focus()
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } }
    toastError(axiosError.response?.data?.message || 'Erreur lors du renvoi')
  } finally {
    isLoading.value = false
  }
}

// Retour a l'etape precedente
const goBack = () => {
  currentStep.value = 'form'
  otpDigits.value = ['', '', '', '', '', '']
  otpError.value = false
  otpErrorMessage.value = ''
}

</script>

<template>
  <div class="w-full">
    <h2 class="text-xl sm:text-2xl font-bold text-center text-purple-600 mb-4">Inscription</h2>

    <!-- Stepper -->
    <div class="flex items-center justify-center mb-6">
      <div v-for="(step, index) in steps" :key="step.key" class="flex items-center">
        <div class="flex flex-col items-center">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
              index <= stepIndex
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-500'
            ]"
          >
            <i v-if="index < stepIndex" class="fas fa-check"></i>
            <i v-else :class="step.icon"></i>
          </div>
          <span class="text-xs mt-1 text-gray-600">{{ step.label }}</span>
        </div>
        <div
          v-if="index < steps.length - 1"
          :class="[
            'w-12 sm:w-20 h-0.5 mx-2',
            index < stepIndex ? 'bg-indigo-600' : 'bg-gray-200'
          ]"
        ></div>
      </div>
    </div>

    <!-- Etape 1: Formulaire complet -->
    <form v-if="currentStep === 'form'" @submit.prevent="handleSubmitForm" class="space-y-3">
      <!-- Pseudo -->
      <div class="relative">
        <label for="name" class="block text-sm font-medium text-gray-700">Pseudo</label>
        <i class="fas fa-user absolute left-3 top-9 text-gray-400 text-sm"></i>
        <input
          type="text"
          id="name"
          v-model="form.name"
          placeholder="Votre pseudo"
          :class="[
            'mt-1 block w-full pl-9 px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none',
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          ]"
        />
        <p v-if="errors.name" class="text-red-600 text-xs mt-1">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div class="relative">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <i class="fas fa-envelope absolute left-3 top-9 text-gray-400 text-sm"></i>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="exemple@email.com"
          :class="[
            'mt-1 block w-full pl-9 px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none',
            errors.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          ]"
        />
        <p v-if="errors.email" class="text-red-600 text-xs mt-1">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div class="relative">
        <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
        <i class="fas fa-lock absolute left-3 top-9 text-gray-400 text-sm"></i>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="form.password"
          placeholder="Votre mot de passe"
          :class="[
            'mt-1 block w-full pl-9 pr-9 py-2 text-sm border rounded-md shadow-sm focus:outline-none',
            errors.password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          ]"
        />
        <i
          :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-9 text-gray-600 cursor-pointer text-sm"
        ></i>
        <p v-if="errors.password" class="text-red-600 text-xs mt-1">{{ errors.password }}</p>
      </div>

      <!-- Confirm Password -->
      <div class="relative">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer</label>
        <i class="fas fa-lock absolute left-3 top-9 text-gray-400 text-sm"></i>
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          id="confirmPassword"
          v-model="form.confirmPassword"
          placeholder="Confirmez le mot de passe"
          :class="[
            'mt-1 block w-full pl-9 pr-9 py-2 text-sm border rounded-md shadow-sm focus:outline-none',
            errors.confirmPassword
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          ]"
        />
        <i
          :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute right-3 top-9 text-gray-600 cursor-pointer text-sm"
        ></i>
        <p v-if="errors.confirmPassword" class="text-red-600 text-xs mt-1">{{ errors.confirmPassword }}</p>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-2.5 px-4 text-sm font-medium text-white rounded-lg shadow transition-colors bg-indigo-600 hover:bg-orange-400 disabled:opacity-70"
      >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <i class="fas fa-spinner fa-spin"></i> Envoi du code...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <i class="fas fa-paper-plane"></i> Continuer
        </span>
      </button>
    </form>

    <!-- Etape 2: Code OTP -->
    <div v-else-if="currentStep === 'otp'" class="space-y-4">
      <div class="text-center mb-4">
        <p class="text-sm text-gray-600">
          Un code a ete envoye a <strong class="text-indigo-600">{{ form.email }}</strong>
        </p>
        <p class="text-xs text-gray-500 mt-1">Verifiez aussi votre dossier spam</p>
      </div>

      <!-- Champs OTP separes -->
      <div class="flex justify-center gap-2 sm:gap-3">
        <input
          v-for="(digit, index) in otpDigits"
          :key="index"
          :ref="(el) => setOtpRef(el as HTMLInputElement, index)"
          type="text"
          inputmode="numeric"
          maxlength="1"
          v-model="otpDigits[index]"
          @input="handleOtpInput(index, $event)"
          @keydown="handleOtpKeydown(index, $event)"
          @paste="handleOtpPaste"
          :class="[
            'w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border-2 focus:outline-none transition-all',
            otpError
              ? 'border-red-500 bg-red-50 text-red-600 focus:border-red-600'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
          ]"
        />
      </div>

      <!-- Message d'erreur OTP -->
      <p v-if="otpError" class="text-red-600 text-sm text-center">
        <i class="fas fa-exclamation-circle mr-1"></i>
        {{ otpErrorMessage }}
      </p>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="text-center">
        <i class="fas fa-spinner fa-spin text-indigo-600 text-2xl"></i>
        <p class="text-sm text-gray-600 mt-2">Verification en cours...</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between text-sm mt-4">
        <button
          type="button"
          @click="goBack"
          class="text-gray-500 hover:text-indigo-600 flex items-center gap-1"
        >
          <i class="fas fa-arrow-left text-xs"></i> Retour
        </button>
        <button
          type="button"
          @click="handleResendCode"
          :disabled="!canResend || isLoading"
          class="text-indigo-600 hover:text-orange-400 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="!canResend">Renvoyer ({{ resendTimer }}s)</span>
          <span v-else>Renvoyer le code</span>
        </button>
      </div>
    </div>

    <p class="mt-4 text-sm text-gray-600 text-center">
      Deja un compte ?
      <router-link :to="{ name: 'auth.login' }" class="font-medium text-purple-500 hover:text-orange-400">
        Se connecter
      </router-link>
    </p>
  </div>
</template>
