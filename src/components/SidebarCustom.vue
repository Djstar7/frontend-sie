<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const userName = computed(() => userStore.user?.name ?? 'Invité')

const menuLinks = ref([
  { label: 'Dashboard', name: 'custom.dashboard', icon: 'fas fa-tachometer-alt' },
  { label: 'Paiement', name: 'custom.payment', icon: 'fas fa-credit-card' },
  { label: 'Demande Visa', name: 'custom.visarequest.get', icon: 'fas fa-plane' },
  { label: 'Message', name: 'custom.chat', icon: 'fas fa-comment' },
  { label: 'Rendez-vous', name: 'custom.appoitment', icon: 'fas fa-calendar-check' },
])

const logout = () => {
  userStore.logout()
}
</script>

<template>
  <nav
    class="bg-gray-100 w-64 md:w-20 lg:w-64 flex flex-col justify-between pb-20 border-r border-gray-200 h-full transition-all duration-300 overflow-y-auto overflow-x-hidden"
  >
    <div class="flex flex-col justify-between h-full">
      <ul class="space-y-1 sm:space-y-2 relative p-2 sm:p-3 md:p-2 lg:p-4">
        <li v-for="link in menuLinks" :key="link.name" class="group">
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 text-gray-700 font-medium rounded-lg transition-colors duration-200 hover:bg-gray-200"
            active-class="bg-blue-500 text-white hover:bg-blue-600"
          >
            <i :class="['text-base sm:text-lg md:text-xl lg:text-lg', link.icon]" :title="link.label"></i>
            <span class="ml-3 md:hidden lg:inline-block text-sm sm:text-base truncate">
              {{ link.label }}
            </span>
          </router-link>
        </li>

        <li>
          <button
            @click="logout"
            class="w-full flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 text-red-500 font-medium rounded-lg transition-colors duration-200 hover:bg-red-100"
            title="Déconnexion"
          >
            <i class="fas fa-sign-out-alt text-base sm:text-lg md:text-xl lg:text-lg"></i>
            <span class="ml-3 md:hidden lg:inline-block text-sm sm:text-base">Déconnexion</span>
          </button>
        </li>
      </ul>

      <div class="relative text-gray-600 bg-blue-100 w-full p-2 sm:p-3 md:p-2 lg:p-4 mt-auto">
        <router-link
          :to="{ name: 'custom.profil' }"
          class="flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition duration-200 shadow-sm group"
          title="Voir profil"
        >
          <i class="fas fa-user text-lg sm:text-xl text-blue-500"></i>
          <div class="ml-3 flex-col hidden md:hidden lg:flex min-w-0">
            <span class="font-semibold text-gray-600 text-sm truncate">{{ userName }}</span>
            <span class="text-xs sm:text-sm group-hover:text-blue-600">Voir profil</span>
          </div>
        </router-link>
      </div>
    </div>
  </nav>
</template>
