<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavbarPartial from '@/components/NavbarPartial.vue'
import SidebarCustom from '@/components/SidebarCustom.vue'
import NotificationUser from '@/components/NotificationUser.vue'

const router = useRouter()

const isPanelOpen = ref(false)
const isMobileSidebarOpen = ref(false)
const canGoBack = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const isMobile = computed(() => windowWidth.value < 768)
const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)
const isDesktop = computed(() => windowWidth.value >= 1024)

const goBack = () => {
  router.back()
}

const checkCanGoBack = () => {
  canGoBack.value = window.history.length > 1
}

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (!isMobile.value) {
    isMobileSidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  checkCanGoBack()
  router.afterEach(() => checkCanGoBack())

  let touchStartX = 0
  let touchEndX = 0

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX

    if (isMobile.value) {
      if (touchEndX - touchStartX > 80 && touchStartX < 50) {
        isMobileSidebarOpen.value = true
      }
      if (touchStartX - touchEndX > 80 && isMobileSidebarOpen.value) {
        isMobileSidebarOpen.value = false
      }
    }
  }

  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('touchend', handleTouchEnd)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchend', handleTouchEnd)
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <NavbarPartial class="fixed top-0 left-0 right-0 z-50" />

    <!-- Bouton retour - positionné différemment selon la taille d'écran -->
    <div class="fixed top-[88px] hidden md:left-24 lg:left-72 z-40">
      <transition name="slide-left">
        <button
          v-if="canGoBack && router.currentRoute.value.name !== 'custom.dashboard'"
          @click="goBack"
          class="p-2 sm:p-3 rounded-full bg-white text-gray-700 cursor-pointer shadow-lg hover:bg-gray-100 transition duration-200"
          title="Retour"
        >
          <i class="fas fa-arrow-left text-lg sm:text-xl"></i>
        </button>
      </transition>
    </div>

    <!-- Bouton Notifications -->
    <div class="fixed top-[88px] right-3 sm:right-4 z-40" v-if="!isPanelOpen">
      <button
        @click="togglePanel"
        class="relative p-2 sm:p-3 rounded-full bg-white text-blue-600 shadow-xl hover:bg-blue-50 transition duration-200"
      >
        <i class="fas fa-bell text-xl sm:text-2xl"></i>
        <span
          class="absolute top-0 right-0 sm:top-1 sm:right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full ring-2 ring-white bg-red-600"
        ></span>
      </button>
    </div>

    <!-- Bouton hamburger mobile pour sidebar -->
    <button
      v-if="isMobile && !isMobileSidebarOpen"
      @click="toggleMobileSidebar"
      class="fixed top-[88px] left-0 z-50 bg-white shadow-lg py-3 px-2 rounded-r-xl text-blue-600 transition duration-300"
    >
      <i class="fas fa-chevron-right text-lg"></i>
    </button>

    <div class="flex flex-1 pt-20">
      <!-- Sidebar Desktop/Tablet - toujours visible sur md+ -->
      <SidebarCustom
        class="hidden md:flex fixed top-20 left-0 h-[calc(100vh-80px)] z-40 bg-gray-100"
      />

      <!-- Sidebar Mobile - overlay -->
      <transition name="slide-left">
        <SidebarCustom
          v-if="isMobile && isMobileSidebarOpen"
          class="fixed top-20 left-0 h-[calc(100vh-80px)] z-50 bg-gray-100 shadow-2xl w-64"
        />
      </transition>

      <!-- Overlay mobile -->
      <transition name="fade">
        <div
          v-if="isMobile && isMobileSidebarOpen"
          @click="closeMobileSidebar"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        ></div>
      </transition>

      <!-- Contenu principal -->
      <main
        class="flex-1 transition-all duration-300 p-3 sm:p-4 md:p-6 w-full md:ml-20 lg:ml-64"
        :class="{
          'blur-sm pointer-events-none': isPanelOpen || (isMobile && isMobileSidebarOpen),
        }"
      >
        <router-view />
      </main>
    </div>

    <NotificationUser :isOpen="isPanelOpen" @close="isPanelOpen = false" class="z-50" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
