<template>
  <section class="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-24">
    <div class="container mx-auto px-4 sm:px-6 text-center">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-5xl font-extrabold mb-6">
          Prêt à <span class="text-orange-400">Commencer</span> Votre Voyage ?
        </h2>
        <p class="text-lg text-blue-100 mb-10 max-w-3xl mx-auto">
          Rejoignez des milliers de voyageurs satisfaits et laissez nos experts vous guider vers
          votre prochaine destination.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link
            :to="{ name: 'auth.register' }"
            class="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded-xl shadow-2xl shadow-orange-500/30 transform hover:scale-[1.05] transition duration-300 inline-flex items-center justify-center gap-2 text-lg"
          >
            <i class="fas fa-edit"></i> Démarrer ma demande
          </router-link>
          <router-link
            :to="{ name: 'auth.login' }"
            class="px-10 py-4 bg-white/20 text-white hover:bg-white/30 font-semibold rounded-xl border border-white/30 transform hover:scale-[1.05] transition duration-300 inline-flex items-center justify-center gap-2 text-lg"
          >
            <i class="fas fa-sign-in-alt"></i> J'ai déjà un compte
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
