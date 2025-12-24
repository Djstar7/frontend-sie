<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { Custom } from '@/types/user'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref<Custom | null>(null)
const storedUser = localStorage.getItem('user')
if (storedUser) user.value = JSON.parse(storedUser) as Custom

const userStore = useUserStore()

const userLinks = ref([
  { label: 'Dashboard', name: 'admin.dashboard', icon: 'fas fa-tachometer-alt' },
  { label: 'Utilisateurs', name: 'admin.users', icon: 'fas fa-user' },
  { label: 'Paiement', name: 'admin.payment', icon: 'fas fa-credit-card' },
  { label: 'Pays', name: 'admin.country', icon: 'fas fa-globe' },
])

const visaLinks = ref([
  { label: 'Visa', name: 'admin.visa', icon: 'fas fa-plane' },
  { label: 'Demandes Visa', name: 'admin.visarequest', icon: 'fas fa-passport' },
  { label: 'Types de Visa', name: 'admin.visatype', icon: 'fas fa-plane' },
])

const commLinks = ref([{ label: 'Questions FAQ', name: 'admin.faq', icon: 'fas fa-comments' }])

const logout = async () => {
  userStore.logout()
}
</script>

<template>
  <nav
    class="bg-gray-50 h-full w-64 md:w-20 lg:w-64 pb-20 flex flex-col justify-between border-r border-gray-200 shadow-lg transition-all duration-300 overflow-y-auto overflow-x-hidden"
  >
    <div class="flex flex-col justify-between h-full">
      <ul class="space-y-1 sm:space-y-2 lg:space-y-3 p-2 sm:p-3 md:p-2 lg:p-4">
        <li class="text-gray-500 hidden lg:block uppercase text-xs font-bold px-3">
          Utilisateurs & Documents
        </li>
        <li v-for="link in userLinks" :key="link.name" class="group">
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
            active-class="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            :title="link.label"
          >
            <i :class="['text-base sm:text-lg md:text-xl lg:text-lg', link.icon]"></i>
            <span class="ml-3 md:hidden lg:inline-block text-sm sm:text-base truncate">{{ link.label }}</span>
          </router-link>
        </li>

        <li class="text-gray-500 hidden lg:block uppercase text-xs font-bold px-3 mt-2 lg:mt-4">
          Visa & Demandes
        </li>
        <li v-for="link in visaLinks" :key="link.name" class="group">
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-400 transition-colors duration-200 font-medium"
            active-class="bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
            :title="link.label"
          >
            <i :class="['text-base sm:text-lg md:text-xl lg:text-lg', link.icon]"></i>
            <span class="ml-3 md:hidden lg:inline-block text-sm sm:text-base truncate">{{ link.label }}</span>
          </router-link>
        </li>

        <li class="text-gray-500 hidden lg:block uppercase text-xs font-bold px-3 mt-2 lg:mt-4">
          Communication
        </li>
        <li v-for="link in commLinks" :key="link.name" class="group">
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 font-medium"
            active-class="bg-purple-600 text-white hover:bg-purple-600 hover:text-white"
            :title="link.label"
          >
            <i :class="['text-base sm:text-lg md:text-xl lg:text-lg', link.icon]"></i>
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
        class="relative text-gray-600 bg-orange-100 w-full p-2 sm:p-3 md:p-2 lg:p-4 mt-auto"
      >
        <router-link
          :to="{ name: 'admin.profil' }"
          class="flex items-center p-2 sm:p-3 md:p-2 md:justify-center lg:justify-start lg:p-3 rounded-lg font-medium transition-colors duration-200 shadow-sm group"
          :class="
            route.path.startsWith('/admin/profil')
              ? 'bg-orange-100 text-orange-400'
              : 'bg-orange-100 hover:bg-orange-200 text-gray-600'
          "
          title="Voir profil"
        >
          <i
            class="fas fa-user-shield text-lg sm:text-xl text-orange-400 group-hover:text-orange-800 transition-colors duration-200"
          ></i>
          <div class="ml-3 flex-col hidden lg:flex min-w-0">
            <span class="font-semibold text-sm truncate">{{ userStore.user?.name }}</span>
            <span class="text-xs sm:text-sm group-hover:text-orange-400 transition-colors duration-200">
              Voir profil
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </nav>
</template>
