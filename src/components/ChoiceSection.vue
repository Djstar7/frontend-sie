<template>
  <section class="py-24 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="text-center mb-16">
        <span class="text-sm font-semibold uppercase text-orange-600 tracking-wider"
          >Vos Avantages</span
        >
        <h2 class="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-4 mt-2">
          Pourquoi nous choisir ?
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Découvrez les raisons pour lesquelles des milliers de voyageurs nous font confiance.
        </p>
      </div>

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div
          class="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] border-t-4 border-orange-500 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-bolt text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Rapidité Optimale</h3>
          <p class="text-gray-600 text-sm">
            Un traitement efficace de vos documents et démarches avec un suivi en temps réel et
            rapide.
          </p>
        </div>

        <div
          class="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] border-t-4 border-orange-500 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-shield-halved text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Sécurité des Données</h3>
          <p class="text-gray-600 text-sm">
            Vos informations et documents sont protégés avec les standards de sécurité les plus
            stricts (SSL/256 bits).
          </p>
        </div>

        <div
          class="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] border-t-4 border-orange-500 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-user-tie text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Support Expert</h3>
          <p class="text-gray-600 text-sm">
            Nos agents experts vous guident étape par étape pour simplifier vos démarches complexes.
          </p>
        </div>

        <div
          class="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-[1.03] border-t-4 border-orange-500 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-credit-card text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Flexibilité de Paiement</h3>
          <p class="text-gray-600 text-sm">
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
