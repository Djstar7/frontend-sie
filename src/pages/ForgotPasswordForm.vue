<template>
  <div class="p-8">
    <h2 class="text-3xl font-bold text-center text-purple-600 mb-6">Restauration</h2>
    <p class="text-gray-500 mt-4">
      Pour nous ressurer que vous etes bien le proprietaire du compte, nous vous demandons de
      rensigner votre email
    </p>
    <form @submit.prevent="handleLogin" class="mt-6 space-y-4">
      <div>
        <label for="email" class="block text-md font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          class="mt-1 block w-full px-4 text-xl py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
        />
      </div>
      <div v-if="userStore.error" class="text-red-600 text-md mt-2">
        {{ userStore.error }}
      </div>
      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 text-xl border border-transparent rounded-md shadow-md text-md font-medium text-white bg-indigo-600 hover:bg-orange-500 cursor-pointer"
        >
          <span v-if="userStore.loading">Chargement...</span>
          <span v-else>Continuer</span>
        </button>
      </div>
    </form>
    <p class="mt-6 text-2xl text-gray-600">
      <router-link
        :to="{ name: 'auth.login' }"
        class="font-medium text-indigo-600 hover:text-orange-500"
      >
        ←Retour
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
