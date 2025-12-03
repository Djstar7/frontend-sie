<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <!-- Titre de la section -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Fonctionnalites de notre plateforme
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez notre gamme complète de services pour faciliter vos démarches de visa
        </p>
      </div>

      <!-- Grid des services -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Service 1: Liste des documents -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fas fa-file-lines text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Documents requis</h3>
          <p class="text-gray-600">
            Consultez la liste dynamique des documents requis selon votre profil, type de visa et
            pays de destination.
          </p>
        </div>

        <!-- Service 2: Téléversement et suivi -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fas fa-upload text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Téléversement & Suivi</h3>
          <p class="text-gray-600">
            Téléversez vos documents et suivez en temps réel l’avancement via messages et
            suggestions de nos agents.
          </p>
        </div>

        <!-- Service 3: Notifications et rendez-vous -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fas fa-bell text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Notifications & Rendez-vous</h3>
          <p class="text-gray-600">
            Recevez des notifications instantanées pour la prise de rendez-vous et le suivi de vos
            demandes.
          </p>
        </div>

        <!-- Service 4: Paiement sécurisé -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
        >
          <div
            class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300"
          >
            <i class="fas fa-credit-card text-3xl text-blue-600 group-hover:text-white"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-3">Paiement sécurisé</h3>
          <p class="text-gray-600">
            Payez vos sous-dossiers en toute sécurité via MTN, Orange, Mastercard ou PayPal avant
            traitement final.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Tu peux remplacer cette section par une liste dynamique de services venant de l'API si besoin
</script>

<style scoped>
/* Pour un effet léger de transition des cartes */
div > .hover\:scale-105:hover {
  transition: transform 0.3s ease;
}
</style>
