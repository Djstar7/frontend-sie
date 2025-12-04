<template>
  <footer class="bg-gradient-to-t from-blue-900 to-blue-800 text-white py-20">
    <div
      class="container mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
    >
      <div>
        <h2 class="text-3xl font-extrabold text-orange-400 mb-4 tracking-wider">SIE</h2>
        <p class="text-blue-200 leading-relaxed text-sm mb-6">
          Nous simplifions vos démarches de visa en centralisant : documents requis, téléversement
          sécurisé, suivi en temps réel et notifications personnalisées.
        </p>
        <div class="flex space-x-4">
          <a
            href="#"
            class="text-blue-200 hover:text-orange-400 text-xl transition-colors duration-300 transform hover:scale-110"
          >
            <i class="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            class="text-blue-200 hover:text-orange-400 text-xl transition-colors duration-300 transform hover:scale-110"
          >
            <i class="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            class="text-blue-200 hover:text-orange-400 text-xl transition-colors duration-300 transform hover:scale-110"
          >
            <i class="fab fa-instagram"></i>
          </a>
          <a
            href="#"
            class="text-blue-200 hover:text-orange-400 text-xl transition-colors duration-300 transform hover:scale-110"
          >
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      <div>
        <h3 class="text-white font-bold mb-6 text-xl border-l-4 border-orange-500 pl-3">
          Liens Rapides
        </h3>
        <ul class="space-y-4">
          <li>
            <router-link
              :to="{ name: 'home' }"
              class="text-blue-200 hover:text-orange-400 transition-colors duration-300 flex items-center group"
            >
              <i
                class="fas fa-home mr-3 text-lg text-orange-500 group-hover:text-white transition-colors"
              ></i>
              Accueil
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'about' }"
              class="text-blue-200 hover:text-orange-400 transition-colors duration-300 flex items-center group"
            >
              <i
                class="fas fa-info-circle mr-3 text-lg text-orange-500 group-hover:text-white transition-colors"
              ></i>
              À propos
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'contact' }"
              class="text-blue-200 hover:text-orange-400 transition-colors duration-300 flex items-center group"
            >
              <i
                class="fas fa-envelope mr-3 text-lg text-orange-500 group-hover:text-white transition-colors"
              ></i>
              Contact
            </router-link>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-white font-bold mb-6 text-xl border-l-4 border-orange-500 pl-3">
          Fonctionnalités
        </h3>
        <ul class="space-y-4">
          <li class="flex items-start">
            <i class="fas fa-file-alt mr-3 mt-1 text-blue-300 text-lg"></i>
            <span class="text-blue-200">Liste dynamique des documents</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-cloud-upload-alt mr-3 mt-1 text-blue-300 text-lg"></i>
            <span class="text-blue-200">Téléversement sécurisé</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-bell mr-3 mt-1 text-blue-300 text-lg"></i>
            <span class="text-blue-200">Suivi & notifications en temps réel</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-calendar-check mr-3 mt-1 text-blue-300 text-lg"></i>
            <span class="text-blue-200">Prise de rendez-vous</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-white font-bold mb-6 text-xl border-l-4 border-orange-500 pl-3">
          Modes de Paiement
        </h3>
        <div class="flex flex-wrap gap-2 mb-8">
          <div
            class="bg-blue-700/50 border border-blue-700 px-3 py-1 rounded-full flex items-center text-sm"
          >
            <i class="fab fa-cc-mastercard mr-2 text-orange-500"></i>
            <span class="text-blue-100">Mastercard</span>
          </div>
          <div
            class="bg-blue-700/50 border border-blue-700 px-3 py-1 rounded-full flex items-center text-sm"
          >
            <i class="fab fa-cc-paypal mr-2 text-orange-500"></i>
            <span class="text-blue-100">PayPal</span>
          </div>
          <div
            class="bg-orange-600/70 border border-orange-600 px-3 py-1 rounded-full text-sm font-medium"
          >
            Orange Money
          </div>
          <div
            class="bg-purple-700/70 border border-purple-700 px-3 py-1 rounded-full text-sm font-medium"
          >
            MTN MoMo
          </div>
        </div>

        <h3 class="text-white font-bold mb-6 text-xl border-l-4 border-orange-500 pl-3">
          Nous Contacter
        </h3>
        <ul class="space-y-4">
          <li class="flex items-start">
            <i class="fas fa-map-marker-alt mr-3 mt-1 text-orange-500 text-lg"></i>
            <span class="text-blue-200">Douala, Cameroun</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-phone-alt mr-3 mt-1 text-orange-500 text-lg"></i>
            <span class="text-blue-200">+237 674 69 36 25</span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-envelope mr-3 mt-1 text-orange-500 text-lg"></i>
            <span class="text-blue-200">support@sie.com</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-blue-700 mt-16 pt-8 text-center text-blue-400 text-sm">
      <p>
        © {{ new Date().getFullYear() }} Service Immigration de l'Estuaire (SIE). Tous droits
        réservés.
        <span class="hidden sm:inline-block"
          >| Politique de Confidentialité | Conditions d'Utilisation</span
        >
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Le composant footer est simple et ne nécessite pas de script setup complexe
</script>
