<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { validateForm, isPassword, required, isSameAs } from '@/utils/validateForm'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  password: '',
  confirmPassword: '',
})
const isLoading = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const tokenValid = ref<boolean | null>(null)
const resetSuccess = ref(false)
const email = ref('')
const token = ref('')
const errors = reactive({
  password: '',
  confirmPassword: '',
})

// Recuperer le token et email depuis l'URL
const urlToken = (route.query.token as string) || ''
const urlEmail = (route.query.email as string) || ''

onMounted(async () => {
  // Verifier que le token et email sont presents
  if (!urlToken || !urlEmail) {
    tokenValid.value = false
    return
  }

  try {
    // Verifier le token aupres du backend Laravel
    const response = await userStore.verifyResetToken(urlEmail, urlToken)
    if (response.valid) {
      email.value = urlEmail
      token.value = urlToken
      tokenValid.value = true
    } else {
      tokenValid.value = false
    }
  } catch {
    tokenValid.value = false
  }
})

const validate = () => {
  const { isValid, errors: validationErrors } = validateForm(form, {
    password: [required('Le mot de passe est obligatoire'), isPassword()],
    confirmPassword: [
      required('La confirmation du mot de passe est obligatoire'),
      isSameAs(form.password, 'Les mots de passe ne correspondent pas'),
    ],
  })

  errors.password = ''
  errors.confirmPassword = ''

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
    await userStore.resetPassword(email.value, token.value, form.password)
    resetSuccess.value = true
  } catch (err) {
    console.error('Erreur lors de la reinitialisation:', err)
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push({ name: 'auth.login' })
}
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h2 class="text-2xl sm:text-3xl font-bold text-center text-purple-600 mb-4 sm:mb-6">
      Reinitialiser le mot de passe
    </h2>

    <!-- Verification du lien en cours -->
    <template v-if="tokenValid === null">
      <div class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
        <p class="text-gray-600">Verification du lien...</p>
      </div>
    </template>

    <!-- Lien invalide -->
    <template v-else-if="tokenValid === false">
      <div class="text-center py-8">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <i class="fas fa-times-circle text-red-600 text-3xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Lien invalide ou expire</h3>
        <p class="text-gray-600 text-sm mb-6">
          Ce lien de reinitialisation n'est plus valide. Veuillez demander un nouveau lien.
        </p>
        <router-link
          :to="{ name: 'auth.forgotpassword' }"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-orange-500 transition-colors"
        >
          <i class="fas fa-redo"></i>
          Demander un nouveau lien
        </router-link>
      </div>
    </template>

    <!-- Reinitialisation reussie -->
    <template v-else-if="resetSuccess">
      <div class="text-center py-8">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <i class="fas fa-check-circle text-green-600 text-3xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Mot de passe reinitialise !</h3>
        <p class="text-gray-600 text-sm mb-6">
          Votre mot de passe a ete modifie avec succes. Vous pouvez maintenant vous connecter.
        </p>
        <button
          @click="goToLogin"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-orange-500 transition-colors"
        >
          <i class="fas fa-sign-in-alt"></i>
          Se connecter
        </button>
      </div>
    </template>

    <!-- Formulaire de reinitialisation -->
    <template v-else>
      <p class="text-gray-500 text-sm text-center mb-6">
        Creez un nouveau mot de passe pour votre compte
        <span class="font-medium text-indigo-600">{{ email }}</span>
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-3">
        <!-- Password -->
        <div class="relative">
          <label for="password" class="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <i class="fas fa-lock absolute left-3 top-9 text-gray-400 text-sm"></i>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            placeholder="Votre nouveau mot de passe"
            :class="[
              'mt-1 block w-full pl-9 pr-9 py-2 text-sm border rounded-md shadow-sm focus:outline-none',
              errors.password
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
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
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
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
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
            ]"
          />
          <i
            :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-9 text-gray-600 cursor-pointer text-sm"
          ></i>
          <p v-if="errors.confirmPassword" class="text-red-600 text-xs mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Criteres du mot de passe -->
        <div class="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p class="font-medium mb-1">Le mot de passe doit contenir :</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Au moins 8 caracteres</li>
            <li>Au moins 3 des 4 criteres : minuscule, majuscule, chiffre, caractere special</li>
          </ul>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 px-4 text-sm font-medium text-white rounded-lg shadow transition-colors bg-indigo-600 hover:bg-orange-400 disabled:opacity-70"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <i class="fas fa-spinner fa-spin"></i> Reinitialisation...
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <i class="fas fa-key"></i> Reinitialiser le mot de passe
          </span>
        </button>
      </form>
    </template>

    <p class="mt-4 text-sm text-gray-600">
      <router-link
        :to="{ name: 'auth.login' }"
        class="font-medium text-indigo-600 hover:text-orange-500 flex items-center gap-1"
      >
        <i class="fas fa-arrow-left text-sm"></i> Retour a la connexion
      </router-link>
    </p>
  </div>
</template>
