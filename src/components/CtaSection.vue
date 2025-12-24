<template>
  <section class="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-12 sm:py-16 md:py-20 lg:py-24">
    <div class="container mx-auto px-3 sm:px-4 md:px-6 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6">
          Prêt à <span class="text-orange-400">Commencer</span> Votre Voyage ?
        </h2>
        <p class="text-sm sm:text-base md:text-lg text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-2">
          Rejoignez des milliers de voyageurs satisfaits et laissez nos experts vous guider vers
          votre prochaine destination.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
          <router-link
            :to="{ name: 'auth.register' }"
            class="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded-lg sm:rounded-xl shadow-2xl shadow-orange-500/30 transform hover:scale-[1.05] transition duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
          >
            <i class="fas fa-edit"></i> <span class="hidden sm:inline">Démarrer ma demande</span><span class="sm:hidden">Démarrer</span>
          </router-link>
          <router-link
            :to="{ name: 'auth.login' }"
            class="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white/20 text-white hover:bg-white/30 font-semibold rounded-lg sm:rounded-xl border border-white/30 transform hover:scale-[1.05] transition duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
          >
            <i class="fas fa-sign-in-alt"></i> <span class="hidden sm:inline">J'ai déjà un compte</span><span class="sm:hidden">Connexion</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
