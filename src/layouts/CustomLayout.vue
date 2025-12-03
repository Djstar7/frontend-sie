<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import NavbarPartial from '@/components/NavbarPartial.vue'
import SidebarCustom from '@/components/SidebarCustom.vue'
import NotificationUser from '@/components/NotificationUser.vue'

const router = useRouter()

const isPanelOpen = ref(false)
const isSidebarVisible = ref(false)
const canGoBack = ref(false) // <-- système retour

const goBack = () => {
  router.back()
}

const checkCanGoBack = () => {
  canGoBack.value = window.history.length > 1
}

const isScreenSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  if (typeof window === 'undefined') return false
  const width = window.innerWidth
  if (size === 'sm') return width < 768
  if (size === 'md') return width >= 768 && width < 1024
  if (size === 'lg') return width >= 1024
  return false
}

const updateSidebarVisibility = () => {
  isSidebarVisible.value = !isScreenSize('sm')
}

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

const toggleSidebar = () => {
  if (isScreenSize('sm')) {
    isSidebarVisible.value = !isSidebarVisible.value
  }
}

onMounted(() => {
  updateSidebarVisibility()
  window.addEventListener('resize', updateSidebarVisibility)

  // Gestion retour intelligent
  checkCanGoBack()
  router.afterEach(() => checkCanGoBack())

  // Swipe mobile
  let touchStartX = 0
  let touchEndX = 0

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX

    if (isScreenSize('sm')) {
      if (touchEndX - touchStartX > 80 && touchStartX < 50) {
        isSidebarVisible.value = true
      }

      if (touchStartX - touchEndX > 80) {
        isSidebarVisible.value = false
      }
    }
  }

  window.addEventListener("touchstart", handleTouchStart)
  window.addEventListener("touchend", handleTouchEnd)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateSidebarVisibility)
    window.removeEventListener("touchstart", handleTouchStart)
    window.removeEventListener("touchend", handleTouchEnd)
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">

    <NavbarPartial class="fixed top-0 left-0 right-0 z-50" />

    <!-- bouton retour -->
    <div class="fixed top-20 left-65 z-50">
      <transition name="slide-left">
        <button
          v-if="canGoBack && router.currentRoute.value.name !== 'custom.dashboard'"
          @click="goBack"
          class="relative p-3 rounded-full bg-white text-gray-700 cursor-pointer shadow-lg hover:bg-gray-100 transition duration-200"
          title="Retour"
        >
          <i class="fas fa-arrow-left sm:text-md text-2xl"></i>
        </button>
      </transition>
    </div>

    <!-- Notifications -->
    <div class="fixed top-20 right-4 z-50" v-if="!isPanelOpen">
      <button
        @click="togglePanel"
        class="relative p-3 rounded-full bg-white text-blue-600 shadow-xl hover:bg-blue-50 transition duration-200"
      >
        <i class="fas fa-bell sm:text-md text-3xl"></i>
        <span class="absolute top-1 right-1 h-3 w-3 rounded-full ring-2 ring-white bg-red-600"></span>
      </button>
    </div>

    <!-- Chevron mobile -->
    <button
      @click="toggleSidebar"
      v-if="isScreenSize('sm') && !isSidebarVisible"
      class="fixed top-20 left-0 z-50 bg-white shadow-xl p-4 rounded-r-2xl text-blue-600 transition duration-300 flex items-center justify-center chevron-btn"
    >
      <i
        class="fas text-2xl transition-transform duration-300"
        :class="isSidebarVisible ? 'fa-chevron-left rotate-180' : 'fa-chevron-right'"
      ></i>
    </button>

    <div class="flex flex-1 pt-20">

      <transition name="slide-left">
        <SidebarCustom
          v-if="isSidebarVisible || !isScreenSize('sm')"
          class="fixed top-20 left-0 h-[calc(100vh-80px)] z-40 bg-gray-100 shadow-xl lg:shadow-none"
          :class="{ 'hidden': !isSidebarVisible && isScreenSize('sm') }"
        />
      </transition>

      <transition name="fade">
        <div
          v-if="isSidebarVisible && isScreenSize('sm')"
          @click="isSidebarVisible = false"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
        ></div>
      </transition>

      <main
        class="flex-1 transition-all duration-300 p-4"
        :class="{
          'lg:ml-64': isScreenSize('lg'),
          'md:ml-20': isScreenSize('md'),
          'ml-0': isScreenSize('sm') || !isSidebarVisible,
          'blur-sm pointer-events-none': isPanelOpen || (isSidebarVisible && isScreenSize('sm'))
        }"
      >
        <router-view />
      </main>

    </div>

    <NotificationUser
      :isOpen="isPanelOpen"
      @close="isPanelOpen = false"
      class="z-50"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform .3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.chevron-btn {
  width: 24px;
  height: 24px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
