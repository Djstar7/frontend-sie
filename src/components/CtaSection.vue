<template>
  <section class="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
    <div class="container mx-auto px-6 text-center">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">Prêt à commencer votre voyage ?</h2>
        <p class="text-lg mb-10 max-w-2xl mx-auto">
          Rejoignez des milliers de voyageurs satisfaits et laissez-nous vous guider vers votre
          prochaine destination.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link
            :to="{ name: 'auth.register' }"
            class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition duration-300 inline-block"
          >
            Créer un compte
          </router-link>
          <router-link
            :to="{ name: 'auth.login' }"
            class="px-8 py-4 bg-white text-blue-700 hover:bg-gray-100 font-semibold rounded-full shadow-lg transform hover:scale-105 transition duration-300 inline-block"
          >
            Se connecter
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
