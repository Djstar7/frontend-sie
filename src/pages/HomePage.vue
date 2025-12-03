<script setup lang="ts">
import ChoiceSection from '@/components/ChoiceSection.vue'
import AvisSection from '@/components/AvisSection.vue'
import PartnersSection from '@/components/PartnersSection.vue'
import CtaSection from '@/components/CtaSection.vue'
import FaqSection from '@/components/FaqSection.vue'
import Travel from '@/assets/images/banners/travelvect.png'
import { ref } from 'vue'

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
const backgroundStyle = {
  backgroundImage: `url('${Travel}')`,
}

// Visa services data
const visaServices = [
  {
    title: 'Tourisme',
    description: 'Obtenez votre visa pour vos séjours touristiques',
    price: '20,000 FCFA',
    icon: '✈️',
  },
  {
    title: 'Études',
    description: "Facilité d'accès pour vos études à l'étranger",
    price: '20,000 FCFA',
    icon: '📚',
  },
  {
    title: 'Travail',
    description: 'Procédure simplifiée pour votre visa de travail',
    price: '20,000 FCFA',
    icon: '💼',
  },
  {
    title: 'Affaires',
    description: "Services express pour les voyageurs d'affaires",
    price: '20,000 FCFA',
    icon: '🏢',
  },
]

// Destinations data
const destinations = [
  { name: 'France', flag: '🇫🇷' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'États-Unis', flag: '🇺🇸' },
  { name: 'Royaume-Uni', flag: '🇬🇧' },
  { name: 'Allemagne', flag: '🇩🇪' },
  { name: 'Italie', flag: '🇮🇹' },
  { name: 'Espagne', flag: '🇪🇸' },
  { name: 'Pays-Bas', flag: '🇳🇱' },
  { name: 'Japon', flag: '🇯🇵' },
  { name: 'Australie', flag: '🇦🇺' },
  { name: 'Singapour', flag: '🇸🇬' },
  { name: 'Corée du Sud', flag: '🇰🇷' },
]

const activeDestinationTab = ref('all')
</script>

<template>
  <div class="bg-gray-50 text-gray-800">
    <!-- HERO SECTION -->
    <header
      class="relative bg-cover bg-center text-white min-h-screen flex items-center justify-center"
      :style="backgroundStyle"
    >
      <div class="relative container mx-auto px-4 sm:px-6 text-center z-10">
        <h1
          class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black drop-shadow-lg"
        >
          Votre porte d'entrée vers le monde
        </h1>

        <p
          class="mt-4 text-lg sm:text-xl text-gray-900 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
        >
          Services de visa rapides, faciles et sécurisés en ligne. Obtenez votre visa pour plus de
          15 destinations avec une expertise de confiance.
        </p>

        <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <router-link
            :to="{ name: 'auth.register' }"
            class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-300 inline-block"
          >
            Commencer ma demande
          </router-link>

          <button
            @click="scrollToSection('services')"
            class="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-300 inline-block"
          >
            Explorer les services
          </button>
        </div>
      </div>
    </header>

    <main>
      <!-- SERVICES SECTION -->
      <section id="services" class="py-20 bg-white">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Services de Visa
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Obtenez votre visa pour votre destination de rêve avec notre expertise et notre
              accompagnement personnalisé
            </p>
          </div>

          <!-- Visa Services Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div
              v-for="(service, index) in visaServices"
              :key="index"
              class="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div class="text-4xl mb-4">{{ service.icon }}</div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ service.title }}</h3>
              <p class="text-gray-600 mb-4">{{ service.description }}</p>
              <div class="mt-4">
                <span class="text-lg font-bold text-blue-600">{{ service.price }}</span>
                <span class="text-gray-500 text-sm block">Frais de dossier</span>
              </div>
            </div>
          </div>

          <!-- Destinations Section -->
          <div class="text-center mb-12">
            <h3 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Destinations Populaires
            </h3>
            <p class="text-gray-600 max-w-2xl mx-auto">Plus de 15 destinations disponibles.</p>
          </div>
          <!-- Destinations Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div
              v-for="(destination, index) in destinations"
              :key="index"
              v-show="activeDestinationTab === 'all'"
              class="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col items-center"
            >
              <div class="text-4xl mb-2">{{ destination.flag }}</div>
              <h4 class="font-semibold text-gray-800">{{ destination.name }}</h4>
            </div>
          </div>
        </div>
      </section>

      <!-- ABOUT SECTION -->
      <section class="py-20 bg-gray-100">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="flex flex-col lg:flex-row items-center gap-12">
            <div class="lg:w-1/2">
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Pourquoi nous choisir ?
              </h2>
              <p class="text-lg text-gray-600 mb-8">
                Nous sommes votre partenaire de confiance pour toutes vos démarches de visa. Notre
                expertise et notre technologie de pointe simplifient votre expérience.
              </p>
              <ul class="space-y-4">
                <li class="flex items-start">
                  <span class="text-blue-600 text-2xl mr-3">✓</span>
                  <span class="text-gray-700"
                    >Processus de visa entièrement digitalisé et sécurisé</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 text-2xl mr-3">✓</span>
                  <span class="text-gray-700">Expertise locale et connaissance des procédures</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 text-2xl mr-3">✓</span>
                  <span class="text-gray-700">Suivi en temps réel de votre demande</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 text-2xl mr-3">✓</span>
                  <span class="text-gray-700">Support client multilingue 24/7</span>
                </li>
              </ul>
            </div>
            <div class="lg:w-1/2">
              <div class="bg-white rounded-2xl shadow-xl p-8">
                <div
                  class="aspect-w-16 aspect-h-12 bg-gray-200 rounded-xl flex items-center justify-center"
                >
                  <div class="text-center">
                    <span class="text-6xl block mb-4">🌍</span>
                    <p class="text-gray-600">Votre voyage commence ici</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- STATISTICS SECTION -->
      <section class="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <!-- Clients Satisfaits -->
            <div class="p-6 transform transition duration-300 hover:scale-105">
              <div class="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <p class="text-blue-200">Clients satisfaits</p>
            </div>

            <!-- Dossiers traités -->
            <div class="p-6 transform transition duration-300 hover:scale-105">
              <div class="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
              <p class="text-blue-200">Dossiers traités</p>
            </div>

            <!-- Pays desservis -->
            <div class="p-6 transform transition duration-300 hover:scale-105">
              <div class="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <p class="text-blue-200">Pays desservis</p>
            </div>

            <!-- Années d'expérience -->
            <div class="p-6 transform transition duration-300 hover:scale-105">
              <div class="text-4xl md:text-5xl font-bold mb-2">8+</div>
              <p class="text-blue-200">Années d'expérience</p>
            </div>
          </div>
        </div>
      </section>

      <!-- PROCESS SECTION -->
      <section class="py-20 bg-white">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Notre Processus en 3 Étapes
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Un processus simple et efficace pour obtenir votre visa sans tracas
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div
              class="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100"
            >
              <div
                class="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl mx-auto mb-6"
              >
                1
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">Créer un compte</h3>
              <p class="text-gray-600">
                Inscrivez-vous en quelques minutes et complétez votre profil pour personnaliser
                votre expérience.
              </p>
            </div>

            <!-- Step 2 -->
            <div
              class="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100"
            >
              <div
                class="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl mx-auto mb-6"
              >
                2
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">Soumettre les documents</h3>
              <p class="text-gray-600">
                Téléchargez les documents requis selon les exigences spécifiques de votre
                destination.
              </p>
            </div>

            <!-- Step 3 -->
            <div
              class="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100"
            >
              <div
                class="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl mx-auto mb-6"
              >
                3
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">Suivre et recevoir</h3>
              <p class="text-gray-600">
                Suivez l'avancement de votre demande et recevez votre visa en toute sécurité.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CHOICE SECTION -->
      <ChoiceSection />

      <!-- FAQ SECTION -->
      <FaqSection />

      <!-- CTA SECTION -->
      <CtaSection />

      <!-- TESTIMONIALS SECTION -->
      <AvisSection />

      <!-- PARTNERS SECTION -->
      <PartnersSection />
    </main>
  </div>
</template>
