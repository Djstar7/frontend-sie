<script setup lang="ts">
import Place from '@/assets/images/banners/place.jpeg'
</script>

<template>
  <section class="bg-white min-h-screen px-6 py-16">
    <div class="max-w-6xl mx-auto">
      <!-- Titre -->
      <h1
        class="text-4xl md:text-5xl font-extrabold text-center text-purple-600 mb-6 animate-fadeIn"
      >
        À propos de Service d'Immigration de l'Estuaire(SIE)
      </h1>
      <p class="text-center text-gray-600 mb-12 text-lg animate-fadeIn delay-200">
        Service d'Immigration de l'Estuaire est une plateforme digitale qui simplifie toutes vos
        démarches de voyage. Que ce soit pour les demandes de visa, le téléversement de documents ou
        le suivi en temps réel, SIE vous accompagne étape par étape.
      </p>

      <!-- Fonctionnalités -->
      <div class="grid md:grid-cols-2 gap-12 mb-20">
        <div class="flex flex-col justify-center animate-slideLeft">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Fonctionnalités principales</h2>
          <ul class="list-disc list-inside space-y-3 text-gray-600">
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
        <div class="flex justify-center items-center animate-slideRight">
          <img
            :src="Place"
            alt="Fonctionnalités SIE"
            class="w-80 h-80 object-cover rounded-xl shadow-xl"
          />
        </div>
      </div>

      <!-- Valeurs -->
      <div class="bg-white rounded-3xl shadow-xl p-10 mb-20 animate-fadeIn">
        <h2 class="text-2xl font-semibold text-center text-gray-800 mb-8">Nos valeurs</h2>
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div class="p-6 hover:scale-105 transition-transform">
            <i class="fas fa-shield-alt text-4xl text-purple-600 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Sécurité</h3>
            <p class="text-gray-600">
              Vos documents et vos informations sont totalement sécurisés.
            </p>
          </div>
          <div class="p-6 hover:scale-105 transition-transform">
            <i class="fas fa-bolt text-4xl text-blue-500 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Rapidité</h3>
            <p class="text-gray-600">
              Toutes les étapes de votre procédure sont optimisées pour gagner du temps.
            </p>
          </div>
          <div class="p-6 hover:scale-105 transition-transform">
            <i class="fas fa-users text-4xl text-purple-600 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Accompagnement</h3>
            <p class="text-gray-600">
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
