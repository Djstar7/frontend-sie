<template>
  <footer class="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16">
    <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Logo + présentation -->
      <div>
        <h2 class="text-2xl font-bold text-white mb-4">Service Immigration de l'Estuaire</h2>
        <p class="text-gray-300 leading-relaxed mb-6">
          Nous simplifions vos démarches de visa en centralisant : documents requis, téléversement
          sécurisé, suivi en temps réel et notifications personnalisées.
        </p>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-300 hover:text-white text-xl transition-colors duration-300">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" class="text-gray-300 hover:text-white text-xl transition-colors duration-300">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#" class="text-gray-300 hover:text-white text-xl transition-colors duration-300">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="text-gray-300 hover:text-white text-xl transition-colors duration-300">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      <!-- Liens utiles -->
      <div>
        <h3 class="text-white font-semibold mb-6 text-xl">Liens utiles</h3>
        <ul class="space-y-3">
          <li>
            <router-link
              :to="{ name: 'home' }"
              class="text-gray-300 hover:text-white transition-colors duration-300 flex items-start"
            >
              <i class="fas fa-home mr-3 mt-1 text-blue-300"></i>
              Accueil
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'about' }"
              class="text-gray-300 hover:text-white transition-colors duration-300 flex items-start"
            >
              <i class="fas fa-info-circle mr-3 mt-1 text-blue-300"></i>
              À propos
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'home' }"
              class="text-gray-300 hover:text-white transition-colors duration-300 flex items-start"
            >
              <i class="fas fa-briefcase mr-3 mt-1 text-blue-300"></i>
              Nos services
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'contact' }"
              class="text-gray-300 hover:text-white transition-colors duration-300 flex items-start"
            >
              <i class="fas fa-envelope mr-3 mt-1 text-blue-300"></i>
              Contact
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Services -->
      <div>
        <h3 class="text-white font-semibold mb-6 text-xl">Fonctionnalités</h3>
        <ul class="space-y-3">
          <li class="flex items-start">
            <i class="fas fa-file-alt mr-3 mt-1 text-blue-300"></i>
            <span class="text-gray-300">Liste dynamique des documents</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-cloud-upload-alt mr-3 mt-1 text-blue-300"></i>
            <span class="text-gray-300">Téléversement sécurisé</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-bell mr-3 mt-1 text-blue-300"></i>
            <span class="text-gray-300">Suivi & notifications en temps réel</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-calendar-check mr-3 mt-1 text-blue-300"></i>
            <span class="text-gray-300">Prise de rendez-vous</span>
          </li>
        </ul>
      </div>

      <!-- Paiements & Contact -->
      <div>
        <h3 class="text-white font-semibold mb-6 text-xl">Paiement sécurisé</h3>
        <div class="flex flex-wrap gap-3 mb-6">
          <div class="bg-white/10 px-3 py-1 rounded-full flex items-center">
            <i class="fab fa-cc-mastercard mr-2 text-white"></i>
            <span class="text-sm">Mastercard</span>
          </div>
          <div class="bg-white/10 px-3 py-1 rounded-full flex items-center">
            <i class="fab fa-cc-paypal mr-2 text-white"></i>
            <span class="text-sm">PayPal</span>
          </div>
          <div class="bg-orange-500 px-3 py-1 rounded-full text-sm font-medium">Orange</div>
          <div class="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium">MTN</div>
        </div>

        <h3 class="text-white font-semibold mb-6 text-xl">Nous contacter</h3>
        <ul class="space-y-3">
          <li class="flex items-start">
            <i class="fas fa-map-marker-alt mr-3 mt-1 text-blue-300"></i>
            <span class="text-gray-300">Douala, Cameroun</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-phone-alt mr-3 mt-1 text-blue-300"></i>
            <span class="text-gray-300">+237 674 69 36 25</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-envelope mr-3 mt-1 text-blue-300"></i>
            <span class="text-gray-300">support@sie.com</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Ligne séparation -->
    <div class="border-t border-blue-700 mt-12 pt-8 text-center text-gray-400">
      © 2025 SIE. Tous droits réservés.
    </div>
  </footer>
</template>
