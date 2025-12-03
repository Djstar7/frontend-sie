<!-- src/layouts/AuthLayout.vue -->
<script setup lang="ts">
import LogoSection from '@/components/LogoSection.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col md:grid md:grid-cols-2">
    <!-- Section gauche -->
    <div
      class="h-[30vh] md:h-auto bg-gradient-to-br from-blue-600 via-purple-600 to-red-500 flex items-center justify-center md:p-8 famille"
    >
      <div class="text-center text-white max-w-lg fixed">
        <h1 class="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
          Service Immigration de l'Estuaire
        </h1>
        <p class="text-sm md:text-lg opacity-90">
          Simplifiez vos démarches de voyage avec notre plateforme intuitive et rapide.
        </p>
      </div>
    </div>

    <!-- Section droite -->
    <div class="flex-1 h-[70vh] md:h-auto rounded-t-3xl md:rounded-none flex flex-col items-center">
      <img src="@/assets/images/logo.png" alt="Logo" class="h-50 w-50 mx-auto drop-shadow-lg" />
      <!-- Contenu dynamique -->
      <div class="flex-1 w-full flex justify-center items-start mt-2 md:mt-5 px-6 sm:px-3">
        <div class="w-full md:w-3/4 lg:w-2/3">
          <router-view />
          <LogoSection />
          <div class="text-red-500 text-2xl w-full mt-10">
            <router-link :to="{ name: 'home' }">
              <i class="fa-solid fa-house"></i>Retour a l'accueil
            </router-link>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="py-4 md:py-6 text-center text-gray-400 text-sm">
        &copy; 2025 Service Immigration Estuaire. Tous droits réservés.
      </footer>
    </div>
  </div>
</template>
<style>
.famille {
  background: url('@/assets/images/banners/famille.png') 0% no-repeat fixed;
  background-size: contain;
}
</style>
