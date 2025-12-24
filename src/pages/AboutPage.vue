<script setup lang="ts">
import Place from '@/assets/images/banners/place.jpeg'
</script>

<template>
  <section class="bg-white min-h-screen px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
    <div class="max-w-6xl mx-auto">
      <!-- Titre -->
      <h1
        class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-purple-600 mb-4 sm:mb-6 animate-fadeIn px-2"
      >
        À propos de Service d'Immigration de l'Estuaire(SIE)
      </h1>
      <p class="text-center text-gray-600 mb-8 sm:mb-10 md:mb-12 text-sm sm:text-base md:text-lg animate-fadeIn delay-200 px-2">
        Service d'Immigration de l'Estuaire est une plateforme digitale qui simplifie toutes vos
        démarches de voyage. Que ce soit pour les demandes de visa, le téléversement de documents ou
        le suivi en temps réel, SIE vous accompagne étape par étape.
      </p>

      <!-- Fonctionnalités -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-10 sm:mb-16 md:mb-20">
        <div class="flex flex-col justify-center animate-slideLeft order-2 md:order-1">
          <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Fonctionnalités principales</h2>
          <ul class="list-disc list-inside space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
            <li>
              Liste dynamique des documents requis selon votre profil, le type de visa et le pays de
              destination.
            </li>
            <li>Téléversement sécurisé de vos documents.</li>
            <li>Suivi en temps réel via notifications.</li>
            <li>Suggestions personnalisées par un agent pour compléter votre dossier.</li>
            <li>Notification pour prise de rendez-vous en cas de succès.</li>
            <li>
              Paiement sécurisé pour le traitement du sous-dossier via MTN, red,5Mastercard ou
              Paypal.
            </li>
          </ul>
        </div>
        <div class="flex justify-center items-center animate-slideRight order-1 md:order-2">
          <img
            :src="Place"
            alt="Fonctionnalités SIE"
            class="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover rounded-xl shadow-xl"
          />
        </div>
      </div>

      <!-- Valeurs -->
      <div class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10 mb-10 sm:mb-16 md:mb-20 animate-fadeIn">
        <h2 class="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-6 sm:mb-8">Nos valeurs</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-center">
          <div class="p-4 sm:p-5 md:p-6 hover:scale-105 transition-transform">
            <i class="fas fa-shield-alt text-3xl sm:text-4xl text-purple-600 mb-3 sm:mb-4"></i>
            <h3 class="text-lg sm:text-xl font-bold text-gray-700 mb-2">Sécurité</h3>
            <p class="text-gray-600 text-sm sm:text-base">
              Vos documents et vos informations sont totalement sécurisés.
            </p>
          </div>
          <div class="p-4 sm:p-5 md:p-6 hover:scale-105 transition-transform">
            <i class="fas fa-bolt text-3xl sm:text-4xl text-blue-500 mb-3 sm:mb-4"></i>
            <h3 class="text-lg sm:text-xl font-bold text-gray-700 mb-2">Rapidité</h3>
            <p class="text-gray-600 text-sm sm:text-base">
              Toutes les étapes de votre procédure sont optimisées pour gagner du temps.
            </p>
          </div>
          <div class="p-4 sm:p-5 md:p-6 hover:scale-105 transition-transform sm:col-span-2 md:col-span-1">
            <i class="fas fa-users text-3xl sm:text-4xl text-purple-600 mb-3 sm:mb-4"></i>
            <h3 class="text-lg sm:text-xl font-bold text-gray-700 mb-2">Accompagnement</h3>
            <p class="text-gray-600 text-sm sm:text-base">
              Une assistance personnalisée par des agents qualifiés à chaque étape.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fadeIn {
  animation: fadeIn 1s ease forwards;
}

@keyframes slideLeft {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slideLeft {
  animation: slideLeft 0.8s ease forwards;
}

@keyframes slideRight {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slideRight {
  animation: slideRight 0.8s ease forwards;
}
</style>
