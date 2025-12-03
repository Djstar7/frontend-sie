<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <!-- Titre -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Pourquoi nous choisir ?</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez les avantages qui font de nous votre partenaire de confiance pour vos démarches
          de visa
        </p>
      </div>

      <!-- Grid des raisons -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Raison 1: Rapidité -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-bolt text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Rapidité</h3>
          <p class="text-gray-600">
            Un traitement efficace de vos documents et démarches avec un suivi en temps réel.
          </p>
        </div>

        <!-- Raison 2: Sécurité -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-shield-halved text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Sécurité</h3>
          <p class="text-gray-600">
            Vos informations et documents sont protégés avec les standards de sécurité les plus
            stricts.
          </p>
        </div>

        <!-- Raison 3: Assistance personnalisée -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-user-tie text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Assistance personnalisée</h3>
          <p class="text-gray-600">
            Nos agents experts vous guident étape par étape pour simplifier vos démarches.
          </p>
        </div>

        <!-- Raison 4: Paiement facile -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fa-solid fa-credit-card text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Paiement facile</h3>
          <p class="text-gray-600">
            Payez vos sous-dossiers de manière simple et sécurisée via MTN, Orange, Mastercard ou
            PayPal.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Tu peux remplacer par une liste dynamique si tu veux générer les cartes via v-for
</script>

<style scoped>
/* Effet hover léger sur les cartes */
div > .hover\:scale-105:hover {
  transition: transform 0.3s ease;
}
</style>
