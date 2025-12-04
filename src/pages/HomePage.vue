<script setup lang="ts">
import ChoiceSection from '@/components/ChoiceSection.vue'
import AvisSection from '@/components/AvisSection.vue'
import PartnersSection from '@/components/PartnersSection.vue'
import CtaSection from '@/components/CtaSection.vue'
import FaqSection from '@/components/FaqSection.vue'
// Assumons que cette image est haute résolution et sert de fond immersif
import Travel from '@/assets/images/banners/travelvect.png'
import { ref } from 'vue'
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Style de fond ajusté pour une meilleure immersion/lisibilité
const backgroundStyle = {
  backgroundImage: `url('${Travel}')`,
}

// Visa services data (icônes changées pour un style FontAwesome/moderne si possible)
const visaServices = [
  {
    title: 'Tourisme',
    description: 'Obtenez votre visa pour vos séjours touristiques',
    price: '20,000 FCFA',
    icon: 'fa-plane-departure', // Icône FontAwesome
  },
  {
    title: 'Études',
    description: "Facilité d'accès pour vos études à l'étranger",
    price: '20,000 FCFA',
    icon: 'fa-graduation-cap', // Icône FontAwesome
  },
  {
    title: 'Travail',
    description: 'Procédure simplifiée pour votre visa de travail',
    price: '20,000 FCFA',
    icon: 'fa-briefcase', // Icône FontAwesome
  },
  {
    title: 'Affaires',
    description: "Services express pour les voyageurs d'affaires",
    price: '20,000 FCFA',
    icon: 'fa-building', // Icône FontAwesome
  },
]

// Destinations data (Gardons les drapeaux emoji pour un rendu coloré)
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

const activeDestinationTab = ref('all') // Non utilisé dans le template final, mais gardé
</script>

<template>
  <div class="bg-white text-gray-900 min-h-screen">
    <header
      class="relative bg-gray-900 min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-cover bg-center opacity-40 md:opacity-50"
        :style="backgroundStyle"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-800/80"></div>

      <div class="relative container mx-auto px-4 sm:px-6 text-center z-10 py-20">
        <p class="text-blue-200 uppercase tracking-widest font-semibold mb-3 text-sm">
          Simplifiez vos Voyages
        </p>
        <h1
          class="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-white drop-shadow-lg max-w-4xl mx-auto"
        >
          Votre <span class="text-orange-400">Porte d'Entrée</span> Digitale vers le Monde
        </h1>

        <p
          class="mt-4 text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed opacity-90"
        >
          Services de visa rapides, faciles et sécurisés en ligne. Obtenez votre visa pour plus de
          15 destinations avec une expertise de confiance.
        </p>

        <div class="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <router-link
            :to="{ name: 'auth.register' }"
            class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded-xl shadow-2xl shadow-orange-500/30 transform hover:scale-[1.03] transition duration-300 inline-flex items-center justify-center gap-2 text-lg"
          >
            <i class="fas fa-rocket"></i> Commencer ma demande
          </router-link>

          <button
            @click="scrollToSection('services')"
            class="px-8 py-4 bg-white/10 text-white border border-white/20 hover:bg-white/20 font-semibold rounded-xl shadow-lg transform hover:scale-[1.03] transition duration-300 inline-flex items-center justify-center gap-2 text-lg backdrop-blur-sm"
          >
            <i class="fas fa-chevron-down"></i> Explorer les services
          </button>
        </div>
      </div>
    </header>

    <main>
      <section id="services" class="py-24 bg-white">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-4">
              Nos Services de Visa
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Obtenez votre visa pour votre destination de rêve avec notre expertise et notre
              accompagnement personnalisé.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div
              v-for="(service, index) in visaServices"
              :key="index"
              class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full transition-all duration-500 group-hover:w-full group-hover:h-full group-hover:bg-blue-50"
              ></div>

              <div class="relative z-10">
                <div
                  class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:bg-orange-500 transition-colors duration-300"
                >
                  <i :class="['fas', service.icon]"></i>
                </div>

                <h3 class="text-xl font-bold text-gray-800 mb-2">{{ service.title }}</h3>
                <p class="text-gray-600 mb-4 text-sm">{{ service.description }}</p>

                <div class="mt-4 pt-4 border-t border-gray-100">
                  <span class="text-xl font-extrabold text-blue-700">{{ service.price }}</span>
                  <span class="text-gray-500 text-xs block">Frais de dossier minimum</span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mb-12">
            <h3 class="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
              Explorez nos Destinations Populaires
            </h3>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Plus de 15 pays pour réaliser vos projets de voyage, études ou affaires.
            </p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            <div
              v-for="(destination, index) in destinations"
              :key="index"
              v-show="activeDestinationTab === 'all'"
              class="bg-gray-50 rounded-xl p-4 sm:p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col items-center hover:bg-blue-50/50"
            >
              <div class="text-3xl sm:text-4xl mb-2">{{ destination.flag }}</div>
              <h4 class="font-semibold text-gray-800 text-sm sm:text-base">
                {{ destination.name }}
              </h4>
            </div>
          </div>
        </div>
      </section>

      <section class="py-24 bg-gray-50 overflow-hidden">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="flex flex-col lg:flex-row items-center gap-16">
            <div class="lg:w-1/2 order-2 lg:order-1">
              <h2 class="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-6">
                Pourquoi choisir notre Plateforme ?
              </h2>
              <p
                class="text-lg text-gray-700 mb-8 leading-relaxed border-l-4 border-orange-500 pl-4 bg-white p-3 rounded-lg shadow-sm"
              >
                Nous sommes votre partenaire de confiance pour toutes vos démarches de visa. Notre
                expertise et notre technologie de pointe simplifient votre expérience, de la demande
                à l'obtention.
              </p>
              <ul class="space-y-4">
                <li class="flex items-start">
                  <span class="text-orange-500 text-xl mr-3 mt-1"
                    ><i class="fas fa-check-circle"></i
                  ></span>
                  <span class="text-gray-700 font-medium"
                    >Processus de visa
                    <strong class="text-blue-600">entièrement digitalisé</strong> et sécurisé</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-orange-500 text-xl mr-3 mt-1"
                    ><i class="fas fa-map-marked-alt"></i
                  ></span>
                  <span class="text-gray-700 font-medium"
                    >Expertise locale et connaissance des procédures complexes</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-orange-500 text-xl mr-3 mt-1"
                    ><i class="fas fa-clock"></i
                  ></span>
                  <span class="text-gray-700 font-medium"
                    >Suivi en <strong class="text-blue-600">temps réel</strong> de votre demande
                    24/7</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-orange-500 text-xl mr-3 mt-1"
                    ><i class="fas fa-headset"></i
                  ></span>
                  <span class="text-gray-700 font-medium"
                    >Support client dédié multilingue pour vous accompagner</span
                  >
                </li>
              </ul>
            </div>

            <div class="lg:w-1/2 order-1 lg:order-2 flex justify-center p-6">
              <div
                class="w-80 h-80 sm:w-96 sm:h-96 bg-blue-100 rounded-full shadow-2xl flex items-center justify-center p-8 relative"
              >
                <div class="text-center bg-white rounded-full p-10 shadow-inner">
                  <span class="text-7xl block mb-2 text-blue-700"
                    ><i class="fas fa-globe-americas"></i
                  ></span>
                  <p class="text-gray-600 font-semibold text-lg">Votre voyage commence ici</p>
                </div>
                <div class="absolute top-10 left-10 text-3xl text-orange-500 animate-pulse">
                  <i class="fas fa-passport"></i>
                </div>
                <div
                  class="absolute bottom-10 right-10 text-3xl text-blue-500 animate-pulse delay-300"
                >
                  <i class="fas fa-file-alt"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div
              class="p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-blue-700/50 transform transition duration-300 hover:scale-[1.05]"
            >
              <div class="text-4xl md:text-6xl font-extrabold mb-2 text-orange-400">98%</div>
              <p class="text-blue-200 uppercase tracking-wider text-sm">Clients satisfaits</p>
            </div>

            <div
              class="p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-blue-700/50 transform transition duration-300 hover:scale-[1.05]"
            >
              <div class="text-4xl md:text-6xl font-extrabold mb-2 text-orange-400">5,000+</div>
              <p class="text-blue-200 uppercase tracking-wider text-sm">Dossiers traités</p>
            </div>

            <div
              class="p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-blue-700/50 transform transition duration-300 hover:scale-[1.05]"
            >
              <div class="text-4xl md:text-6xl font-extrabold mb-2 text-orange-400">15+</div>
              <p class="text-blue-200 uppercase tracking-wider text-sm">Pays desservis</p>
            </div>

            <div class="p-4 md:p-6 transform transition duration-300 hover:scale-[1.05]">
              <div class="text-4xl md:text-6xl font-extrabold mb-2 text-orange-400">8+</div>
              <p class="text-blue-200 uppercase tracking-wider text-sm">Années d'expérience</p>
            </div>
          </div>
        </div>
      </section>

      <section id="process" class="py-24 bg-white">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-4">
              Notre Processus Simple en 3 Étapes
            </h2>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
              Un processus simple et efficace, conçu pour minimiser les efforts et maximiser vos
              chances de succès.
            </p>
          </div>

          <div class="relative grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            <div
              class="hidden md:block absolute top-1/4 left-0 right-0 h-1 border-t-2 border-dashed border-blue-200 z-0 mx-auto w-[65%] lg:w-[70%]"
            ></div>

            <div
              class="relative z-10 text-center p-8 rounded-3xl bg-white shadow-2xl shadow-blue-100/50 border border-blue-100 transition-all duration-300 hover:shadow-blue-200"
            >
              <div
                class="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-orange-500/30"
              >
                <i class="fas fa-user-plus"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">1. Créer un compte</h3>
              <p class="text-gray-600 text-sm">
                Inscrivez-vous en quelques minutes et complétez votre profil pour personnaliser
                votre expérience.
              </p>
            </div>

            <div
              class="relative z-10 text-center p-8 rounded-3xl bg-white shadow-2xl shadow-blue-100/50 border border-blue-100 transition-all duration-300 hover:shadow-blue-200"
            >
              <div
                class="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-orange-500/30"
              >
                <i class="fas fa-upload"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">2. Soumettre les documents</h3>
              <p class="text-gray-600 text-sm">
                Téléchargez les documents requis selon les exigences spécifiques de votre
                destination, nous vérifions tout.
              </p>
            </div>

            <div
              class="relative z-10 text-center p-8 rounded-3xl bg-white shadow-2xl shadow-blue-100/50 border border-blue-100 transition-all duration-300 hover:shadow-blue-200"
            >
              <div
                class="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-orange-500/30"
              >
                <i class="fas fa-envelope-open-text"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">3. Suivre et recevoir</h3>
              <p class="text-gray-600 text-sm">
                Suivez l'avancement de votre demande et recevez votre visa en toute sécurité via
                notre plateforme.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChoiceSection />

      <FaqSection />

      <CtaSection />

      <AvisSection />

      <PartnersSection />
    </main>
  </div>
</template>

<style scoped>
/* Ajout d'une animation simple pour les icônes flottantes */
@keyframes pulse-fade {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}
.animate-pulse {
  animation: pulse-fade 2s infinite ease-in-out;
}
.delay-300 {
  animation-delay: 0.3s;
}

/* Style spécifique pour la section Hero pour garantir la hauteur */
header {
  /* min-height: 90vh; */
  height: 90vh; /* S'assurer que le héros prend 90% de la vue */
}
</style>
