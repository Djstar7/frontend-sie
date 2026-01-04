<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  // Si l'utilisateur est authentifie, rediriger vers le dashboard
  if (userStore.isAuthenticated) {
    goToDashboard()
  }
})

const goToDashboard = () => {
  const routes: Record<string, string> = {
    admin: 'admin.dashboard',
    custom: 'custom.dashboard',
    agent: 'agent.users',
  }
  const role = userStore.role || 'custom'
  router.push({ name: routes[role] ?? 'auth.login' })
}

const goToLogin = () => {
  router.push({ name: 'auth.login' })
}

const goToRegister = () => {
  router.push({ name: 'auth.register' })
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto text-center">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-4 shadow">
      <i class="fas fa-envelope text-white text-2xl"></i>
    </div>

    <h2 class="text-xl font-bold text-gray-800 mb-2">Verification d'email</h2>

    <p class="text-gray-600 text-sm mb-6">
      La verification d'email se fait maintenant lors de l'inscription.
      Veuillez vous inscrire ou vous connecter.
    </p>

    <div class="flex flex-col gap-3">
      <button
        @click="goToRegister"
        class="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium shadow hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <i class="fas fa-user-plus text-sm"></i>
        S'inscrire
      </button>

      <button
        @click="goToLogin"
        class="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
      >
        <i class="fas fa-sign-in-alt text-sm"></i>
        Se connecter
      </button>
    </div>
  </div>
</template>
