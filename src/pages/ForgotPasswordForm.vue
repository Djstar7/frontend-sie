<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { validateForm, isEmail, required } from '@/utils/validateForm'

const userStore = useUserStore()
const email = ref('')
const emailSent = ref(false)
const error = ref('')
const isLoading = ref(false)
const validate = () => {
  const { isValid, errors: validationErrors } = validateForm({ email: email.value }, {
    email: [required("L'email est obligatoire"), isEmail()],
  })

  if (!isValid) {
    for (const key in validationErrors) {
      if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
        const errorMessages = validationErrors[key as keyof typeof validationErrors]
        if (errorMessages && errorMessages.length > 0) {
          error.value = errorMessages[0]
          return false
        }
      }
    }
  }

  error.value = ''
  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return
  isLoading.value = true
  try {
    await userStore.sendPasswordResetLink(email.value)
    emailSent.value = true
    error.value = ''
  } catch (err) {
    console.error('Erreur lors de l\'envoi:', err)
  }finally{
    isLoading.value  = false
  }
}


const handleResend = async () => {
  isLoading.value = true
  try {
    await userStore.sendPasswordResetLink(email.value)
  } catch (err) {
    console.error('Erreur lors du renvoi:', err)
  }finally{
    isLoading.value  = false
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h2 class="text-2xl sm:text-3xl font-bold text-center text-purple-600 mb-4 sm:mb-6">
      Mot de passe oublié
    </h2>

    <!-- État initial : formulaire -->
    <template v-if="!emailSent">
      <p class="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base text-center">
        Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
        <div class="relative">
          <label for="email" class="block text-sm sm:text-base font-medium text-gray-700">
            Email
          </label>
          <i class="fas fa-envelope absolute left-3 top-9 sm:top-10 text-gray-400 text-sm sm:text-base"></i>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="exemple@email.com"
            :class="[
              'mt-1 block w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-md shadow-md focus:outline-none',
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
            ]"
          />
        </div>

        <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center gap-2 py-2 sm:py-2.5 px-4 text-sm sm:text-base border border-transparent rounded-md shadow-md font-medium text-white bg-indigo-600 hover:bg-orange-500 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i>
              Envoi en cours...
            </span>
            <span v-else class="flex items-center gap-2">
              <i class="fas fa-paper-plane"></i>
              Envoyer le lien
            </span>
          </button>
        </div>
      </form>
    </template>

    <!-- État après envoi : confirmation -->
    <template v-else>
      <div class="text-center mt-6">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <i class="fas fa-envelope-open-text text-green-600 text-2xl"></i>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          Email envoyé !
        </h3>

        <p class="text-gray-600 text-sm sm:text-base mb-4">
          Nous avons envoyé un lien de réinitialisation à
          <span class="font-medium text-indigo-600">{{ email }}</span>.
          Vérifiez votre boîte de réception.
        </p>

        <p class="text-gray-500 text-xs sm:text-sm mb-6">
          Le lien expire dans 60 minutes.
        </p>

        <button
          @click="handleResend"
          :disabled="isLoading"
          class="text-indigo-600 hover:text-orange-500 font-medium text-sm disabled:opacity-50"
        >
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin mr-1"></i> Renvoi en cours...
          </span>
          <span v-else>
            <i class="fas fa-redo mr-1"></i> Renvoyer l'email
          </span>
        </button>
      </div>
    </template>

    <p class="mt-6 text-base sm:text-lg text-gray-600">
      <router-link
        :to="{ name: 'auth.login' }"
        class="font-medium text-indigo-600 hover:text-orange-500 flex items-center gap-1"
      >
        <i class="fas fa-arrow-left text-sm"></i> Retour à la connexion
      </router-link>
    </p>
  </div>
</template>
