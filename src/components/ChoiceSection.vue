<template>
  <section class="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
    <div class="container mx-auto px-3 sm:px-4 md:px-6">
      <div class="text-center mb-8 sm:mb-12 md:mb-16">
        <span class="text-xs sm:text-sm font-semibold uppercase text-orange-600 tracking-wider"
          >Vos Avantages</span
        >
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4 mt-2">
          Pourquoi nous choisir ?
        </h2>
        <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
          Découvrez les raisons pour lesquelles des milliers de voyageurs nous font confiance.
        </p>
      </div>

      <div class="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div
          class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] border-t-4 border-orange-500 group"
        >
          <div
            class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-bolt text-xl sm:text-2xl md:text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Rapidité Optimale</h3>
          <p class="text-gray-600 text-xs sm:text-sm">
            Un traitement efficace de vos documents et démarches avec un suivi en temps réel et
            rapide.
          </p>
        </div>

        <div
          class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] border-t-4 border-orange-500 group"
        >
          <div
            class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-shield-halved text-xl sm:text-2xl md:text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Sécurité des Données</h3>
          <p class="text-gray-600 text-xs sm:text-sm">
            Vos informations et documents sont protégés avec les standards de sécurité les plus
            stricts (SSL/256 bits).
          </p>
        </div>

        <div
          class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] border-t-4 border-orange-500 group"
        >
          <div
            class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-user-tie text-xl sm:text-2xl md:text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Support Expert</h3>
          <p class="text-gray-600 text-xs sm:text-sm">
            Nos agents experts vous guident étape par étape pour simplifier vos démarches complexes.
          </p>
        </div>

        <div
          class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] border-t-4 border-orange-500 group sm:col-span-2 lg:col-span-1"
        >
          <div
            class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-credit-card text-xl sm:text-2xl md:text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Flexibilité de Paiement</h3>
          <p class="text-gray-600 text-xs sm:text-sm">
            Payez vos frais facilement et sécurisé via Mobile Money (MTN, Orange), Visa, ou PayPal.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Tu peux remplacer par une liste dynamique si tu veux générer les cartes via v-for
</script>
