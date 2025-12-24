<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h2 class="text-2xl sm:text-3xl font-bold text-center text-purple-600 mb-4 sm:mb-6">Restauration</h2>
    <p class="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base">
      Pour nous ressurer que vous etes bien le proprietaire du compte, nous vous demandons de
      rensigner votre email
    </p>
    <form @submit.prevent="handleLogin" class="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
      <div>
        <label for="email" class="block text-sm sm:text-base font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          class="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div v-if="userStore.error" class="text-red-600 text-sm sm:text-base mt-2">
        {{ userStore.error }}
      </div>
      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 sm:py-2.5 px-4 text-sm sm:text-base border border-transparent rounded-md shadow-md font-medium text-white bg-indigo-600 hover:bg-orange-500 cursor-pointer"
        >
          <span v-if="userStore.loading">Chargement...</span>
          <span v-else>Continuer</span>
        </button>
      </div>
    </form>
    <p class="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600">
      <router-link
        :to="{ name: 'auth.login' }"
        class="font-medium text-indigo-600 hover:text-orange-500 flex items-center gap-1"
      >
        <i class="fas fa-arrow-left text-sm"></i> Retour
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const form = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await userStore.login(form.value)
    // La redirection est gérée dans le store après succès
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    // L'erreur est déjà stockée dans userStore.error
  }
}
</script>
