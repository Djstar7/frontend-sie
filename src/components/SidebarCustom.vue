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
    class="bg-gray-100 w-64 md:w-20 lg:w-64 flex flex-col justify-between pb-20 border-r border-gray-200 h-full transition-all duration-300"
  >
    <div class="flex flex-col justify-between h-full">
      <ul class="space-y-2 relative p-4">
        <li v-for="link in menuLinks" :key="link.name" class="group">
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-3 text-gray-700 font-medium rounded-lg transition-colors duration-200 hover:bg-gray-200"
            active-class="bg-blue-500 text-white hover:bg-blue-600"
          >
            <i :class="['text-lg mr-3', link.icon]"></i>

            <span class="block md:hidden lg:block">
              {{ link.label }}
            </span>
          </router-link>
        </li>

        <li>
          <button
            @click="logout"
            class="w-full flex items-center p-3 text-red-500 font-medium rounded-lg transition-colors duration-200 hover:bg-red-100"
          >
            <i class="fas fa-sign-out-alt text-lg mr-3"></i>

            <span class="block md:hidden lg:block"> Déconnexion </span>
          </button>
        </li>
      </ul>

      <div class="relative text-gray-600 bg-blue-100 w-full p-4 mt-auto">
        <router-link
          :to="{ name: 'custom.profil' }"
          class="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition duration-200 shadow-sm group"
        >
          <i class="fas fa-user mr-3 text-xl text-blue-500"></i>

          <div class="flex-col md:hidden lg:flex">
            <span class="font-semibold text-gray-600">{{ userName }}</span>
            <span class="text-sm group-hover:text-blue-600">Voir profil</span>
          </div>
        </router-link>
      </div>
    </div>
  </nav>
</template>
