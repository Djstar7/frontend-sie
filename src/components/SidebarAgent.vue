<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import type { UserRegister } from '@/types/user'

const route = useRoute()

// Récupération utilisateur stocké
const agent = ref<UserRegister | null>(null)
const storedUser = localStorage.getItem('user')
if (storedUser) {
  agent.value = JSON.parse(storedUser) as UserRegister
}

const userStore = useUserStore()

// Nom utilisateur
const userName = computed(() => {
  return userStore.user?.name || 'Invité'
})

// Déconnexion
const logout = () => {
  userStore.logout()
}
</script>

<template>
  <nav
    class="bg-gray-50 w-64 md:w-20 lg:w-64 flex flex-col justify-between pb-20 border-r border-gray-200 h-full shadow-lg transition-all duration-300 overflow-y-auto overflow-x-hidden"
  >
    <div class="flex flex-col flex-grow justify-between h-full">
      <ul class="space-y-1 sm:space-y-2 lg:space-y-3 p-2 sm:p-3 md:p-2 lg:p-4">
        <li
          v-for="link in [
            {
              name: 'agent.users',
              label: 'Demande Visa',
              icon: 'fas fa-clipboard-check',
              activePrefix: '/agent/users',
              activeClass: 'bg-indigo-600 text-white shadow-md',
              hoverClass: 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600',
            },
            {
              name: 'agent.appoitment',
              label: 'Rendez-vous',
              icon: 'fas fa-calendar-check',
              activePrefix: '/agent/appoitment',
              activeClass: 'bg-green-600 text-white shadow-md',
              hoverClass: 'text-gray-700 hover:bg-green-50 hover:text-green-600',
            },
            {
              name: 'agent.chat',
              label: 'Chat Clients',
              icon: 'fas fa-comments',
              activePrefix: '/agent/chat',
              activeClass: 'bg-purple-600 text-white shadow-md',
              hoverClass: 'text-gray-700 hover:bg-purple-50 hover:text-purple-600',
            },
          ]"
          :key="link.name"
        >
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 rounded-xl font-medium transition-colors duration-200"
            :class="route.path.startsWith(link.activePrefix) ? link.activeClass : link.hoverClass"
            :title="link.label"
          >
            <i :class="[link.icon, 'text-base sm:text-lg md:text-xl lg:text-lg']"></i>
            <span class="ml-3 md:hidden lg:inline-block text-sm sm:text-base truncate">{{ link.label }}</span>
          </router-link>
        </li>

        <li>
          <button
            @click="logout"
            class="w-full flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 cursor-pointer rounded-xl font-medium text-red-500 hover:bg-red-100 transition-colors duration-200"
            title="Déconnexion"
          >
            <i class="fas fa-sign-out-alt text-base sm:text-lg md:text-xl lg:text-lg"></i>
            <span class="ml-3 md:hidden lg:inline-block text-sm sm:text-base">Déconnexion</span>
          </button>
        </li>
      </ul>

      <div
        class="relative text-gray-600 bg-purple-100 w-full p-2 sm:p-3 md:p-2 lg:p-4 mt-auto"
      >
        <router-link
          :to="{ name: 'agent.profil' }"
          class="flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 rounded-lg font-medium transition-colors duration-200 shadow-sm group"
          :class="
            route.path.startsWith('/agent/profil')
              ? 'bg-purple-100 text-purple-600'
              : 'bg-purple-100 hover:bg-purple-200 text-gray-600'
          "
          title="Voir profil"
        >
          <i
            class="fas fa-user-shield text-lg sm:text-xl text-purple-600 group-hover:text-purple-800 transition-colors duration-200"
          ></i>
          <div class="ml-3 hidden lg:flex flex-col min-w-0">
            <span class="font-semibold text-sm truncate">{{ userName }}</span>
            <span class="text-xs sm:text-sm group-hover:text-purple-600 transition-colors duration-200">
              Voir profil
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </nav>
</template>
