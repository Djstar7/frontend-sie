<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const open = ref(false)

const isConnect = computed(() => !!userStore.user)

const routeName = computed(() => router.currentRoute.value.name?.toString() || '')

const isName = computed(() =>
  ['custom', 'admin', 'agent'].some((p) => routeName.value.startsWith(p)),
)
</script>

<template>
  <header class="bg-white/80 backdrop-blur-md fixed w-full shadow-md top-0 z-50 transition-all">
    <div
      class="w-full mx-auto px-4 relative sm:px-6 lg:px-10 flex items-center justify-between h-20"
    >
      <div class="flex items-center space-x-3">
        <img src="@/assets/images/logo.png" alt="Logo" class="h-24 w-24 object-cover" />
      </div>

      <nav class="hidden md:flex space-x-8 items-center font-medium">
        <router-link
          :to="{ name: 'home' }"
          class="relative md:text-sm group text-gray-700 lg:text-xl flex items-center gap-2"
        >
          <i class="fas fa-house text-blue-600"></i> Accueil
          <span
            class="absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300"
            :class="{ 'w-full': routeName === 'home', 'w-0 group-hover:w-full': true }"
          ></span>
        </router-link>

        <router-link
          :to="{ name: 'contact' }"
          class="relative md:text-sm group text-gray-700 lg:text-xl flex items-center gap-2"
        >
          <i class="fas fa-phone text-orange-400"></i> Contact
          <span
            class="absolute left-0 -bottom-1 h-[2px] bg-orange-400 transition-all"
            :class="{ 'w-full': routeName === 'contact', 'w-0 group-hover:w-full': true }"
          ></span>
        </router-link>

        <router-link
          :to="{ name: 'about' }"
          class="relative md:text-sm group text-gray-700 lg:text-xl flex items-center gap-2"
        >
          <i class="fas fa-info-circle mr-2 text-purple-600"></i> À propos
          <span
            class="absolute left-0 -bottom-1 h-[2px] bg-purple-600 transition-all"
            :class="{ 'w-full': routeName === 'about', 'w-0 group-hover:w-full': true }"
          ></span>
        </router-link>

        <div v-if="!isName">
          <router-link
            :to="{ name: 'custom.dashboard' }"
            class="ml-6 px-6 py-2 text-white lg:text-xl font-semibold bg-blue-600 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all"
          >
            {{ isConnect ? 'Tableau de bord' : 'Commencer le suivi' }}
          </router-link>
        </div>
      </nav>

      <div class="md:hidden">
        <button @click="open = !open" class="focus:outline-none text-2xl text-gray-800">
          <i v-if="!open" class="fas fa-bars"></i>
          <i v-else class="fas fa-xmark"></i>
        </button>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-show="open" class="md:hidden bg-white border-t border-gray-200 shadow-lg">
        <router-link
          :to="{ name: 'home' }"
          class="block px-6 py-3 text-gray-700 text-lg hover:text-blue-600"
        >
          <i class="fas fa-house"></i> Accueil
        </router-link>

        <router-link
          :to="{ name: 'contact' }"
          class="block px-6 py-3 text-gray-700 text-lg hover:text-orange-400"
        >
          <i class="fas fa-envelope"></i> Contact
        </router-link>

        <router-link
          :to="{ name: 'about' }"
          class="block px-6 py-3 text-gray-700 text-lg hover:text-purple-600"
        >
          <i class="fas fa-info-circle"></i> À propos
        </router-link>

        <div v-if="!isName" class="flex flex-col px-6 py-4 gap-3">
          <router-link
            :to="{ name: 'custom.dashboard' }"
            class="w-full px-6 py-3 bg-blue-600 text-white rounded-full hover:scale-105 transition-all"
          >
            {{ isConnect ? 'Tableau de bord' : 'Commencer le suivi' }}
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-x 4s ease infinite;
}
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
