<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { UserLogin } from '@/types/user'
import { validateForm, isEmail, isPassword, required } from '@/utils/validateForm'

const isLoading = ref(false)

const form = ref<UserLogin>({
  email: '',
  password: '',
})

const showPassword = ref(false)
const userStore = useUserStore()

const validate = () => {
  const { isValid, errors } = validateForm(form.value, {
    email: [required("L'email est obligatoire"), isEmail()],
    password: [required('Le mot de passe est obligatoire'), isPassword()],
  })

  if (!isValid) {
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        const errorMessages = errors[key as keyof typeof errors]
        if (errorMessages && errorMessages.length > 0) {
          userStore.error = errorMessages[0]
          return false
        }
      }
    }
  }

  return isValid
}

const handleLogin = async () => {
  if (!validate()) return
  isLoading.value = true

  try {
    await userStore.login(form.value)
  } catch (err) {
    console.error('Erreur de connexion:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <h2 class="text-2xl sm:text-3xl font-bold text-center text-purple-600 mb-4 sm:mb-6">Connexion</h2>
  <form @submit.prevent="handleLogin" class="space-y-3 sm:space-y-4">
    <!-- Email -->
    <div class="relative">
      <label for="email" class="block text-sm sm:text-base font-medium text-gray-700">Email</label>
      <i class="fas fa-envelope absolute left-3 top-9 sm:top-10 text-gray-400 text-sm sm:text-base"></i>
      <input
        type="email"
        id="email"
        v-model="form.email"
        placeholder="exemple@email.com"
        class="mt-1 block w-full pl-9 sm:pl-10 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <!-- Password -->
    <div class="relative">
      <label for="password" class="block text-sm sm:text-base font-medium text-gray-700">Mot de passe</label>
      <i class="fas fa-lock absolute left-3 top-9 sm:top-10 text-gray-400 text-sm sm:text-base"></i>
      <input
        :type="showPassword ? 'text' : 'password'"
        id="password"
        v-model="form.password"
        placeholder="Votre mot de passe"
        class="mt-1 block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      />
      <i
        :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
        @click="showPassword = !showPassword"
        class="absolute right-3 top-9 sm:top-10 text-gray-700 cursor-pointer text-sm sm:text-base"
      ></i>
    </div>

    <!-- Forgot Password -->
    <p class="w-full flex items-end justify-end">
      <router-link
        :to="{ name: 'auth.forgotpassword' }"
        class="text-purple-600 hover:text-orange-400 text-sm sm:text-base"
      >
        Mot de passe oublié ?
      </router-link>
    </p>

    <!-- Error Message -->
    <div v-if="userStore.error" class="text-red-600 text-sm sm:text-base mt-2">
      {{ userStore.error }}
    </div>

    <!-- Submit Button -->
    <div>
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 text-sm sm:text-lg font-medium text-white rounded-lg sm:rounded-xl shadow-md transition-colors duration-300 bg-indigo-600 hover:bg-orange-400 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading" class="flex items-center gap-2">
          <i class="fas fa-spinner fa-spin"></i>
          <span class="hidden sm:inline">Connexion...</span>
          <span class="sm:hidden">...</span>
        </span>
        <span v-else class="flex items-center gap-2">
          <i class="fas fa-sign-in-alt"></i>
          Se connecter
        </span>
      </button>
    </div>
  </form>

  <!-- Register Link -->
  <p class="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 text-center">
    Pas encore de compte ?
    <router-link
      :to="{ name: 'auth.register' }"
      class="font-medium text-indigo-600 hover:text-orange-400"
    >
      S'inscrire
    </router-link>
  </p>
</template>
