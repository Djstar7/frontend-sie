<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { userService } from '@/services/userService'
import { validateForm, isEmail, required } from '@/utils/validateForm'
import { toastSuccess, toastError } from '@/utils/toastConfig'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const isLoading = ref(false)
const requestSent = ref(false)

const form = reactive({
  email: '',
  reason: '',
})

const errors = reactive({
  email: '',
})

// Pré-remplir l'email au montage du composant
onMounted(() => {
  if (userStore.user?.email) {
    form.email = userStore.user.email
  }
})

const validate = () => {
  const { isValid, errors: validationErrors } = validateForm(form, {
    email: [required("L'email est obligatoire"), isEmail()],
  })

  errors.email = ''

  if (!isValid) {
    for (const key in validationErrors) {
      if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
        const errorMessages = validationErrors[key as keyof typeof validationErrors]
        if (errorMessages && errorMessages.length > 0) {
          errors[key as keyof typeof errors] = errorMessages[0]
        }
      }
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isLoading.value = true
  try {
    await userService.requestAccountDeletion(form.email, form.reason)
    requestSent.value = true
    toastSuccess('Demande de suppression envoyée')
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { message?: string } } }
    const message = axiosError.response?.data?.message || 'Erreur lors de la demande'
    toastError(message)
    errors.email = message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-user-slash text-red-600 text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Suppression de compte</h1>
          <p class="text-gray-600 text-sm">
            Conformément au RGPD et aux politiques de confidentialité, vous pouvez demander la suppression de vos données personnelles.
          </p>
        </div>

        <template v-if="requestSent">
          <div class="text-center py-8">
            <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i class="fas fa-check-circle text-green-600 text-3xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Demande reçue !</h3>
            <p class="text-gray-600 text-sm mb-4">
              Votre demande de suppression de compte a été enregistrée. Notre équipe traitera votre demande dans un délai de 30 jours.
            </p>
            <p class="text-gray-500 text-xs">
              Vous recevrez une confirmation par email une fois la suppression effectuée.
            </p>
          </div>
        </template>

        <template v-else>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-3">
              <i class="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
              <div class="text-sm text-yellow-800">
                <p class="font-medium mb-1">Attention</p>
                <p>La suppression de votre compte entraînera :</p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>La suppression définitive de toutes vos données personnelles</li>
                  <li>La perte de l'accès à vos services en cours</li>
                  <li>La suppression de votre historique de documents</li>
                </ul>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="relative">
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email du compte à supprimer
              </label>
              <div class="relative mt-1">
                <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm"></i>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  disabled
                  placeholder="votre@email.com"
                  class="block w-full pl-9 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed text-blue-700 focus:outline-none"
                />
              </div>
              <p v-if="errors.email" class="text-red-600 text-xs mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label for="reason" class="block text-sm font-medium text-gray-700">
                Raison de la suppression (optionnel)
              </label>
              <textarea
                id="reason"
                v-model="form.reason"
                rows="3"
                placeholder="Dites-nous pourquoi vous souhaitez supprimer votre compte..."
                class="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-2.5 px-4 text-sm font-medium text-white rounded-lg shadow transition-colors bg-red-600 hover:bg-red-700 disabled:opacity-70"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <i class="fas fa-spinner fa-spin"></i> Envoi en cours...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <i class="fas fa-trash-alt"></i> Demander la suppression
              </span>
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-800 mb-3">Autres options</h3>
            <div class="space-y-3 text-sm text-gray-600">
              <p>
                <i class="fas fa-envelope mr-2 text-indigo-500"></i>
                Contactez-nous par email : <a href="mailto:support@votre-domaine.com" class="text-indigo-600 hover:underline">support@votre-domaine.com</a>
              </p>
              <p>
                <i class="fas fa-clock mr-2 text-indigo-500"></i>
                Délai de traitement : 30 jours maximum
              </p>
            </div>
          </div>
        </template>

        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <router-link
            :to="{ name: 'home' }"
            class="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            <i class="fas fa-arrow-left mr-1"></i> Retour à l'accueil
          </router-link>
        </div>
      </div>

      <div class="mt-6 text-center text-xs text-gray-500">
        <p>Cette page est conforme aux exigences du RGPD et des politiques de confidentialité de Meta/Google.</p>
      </div>
    </div>
  </div>
</template>
