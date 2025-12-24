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
      class="relative bg-gray-900 min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-cover bg-center opacity-30 sm:opacity-40 md:opacity-50"
        :style="backgroundStyle"
      ></div>
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-800/80"></div>

      <div class="relative container mx-auto px-3 sm:px-4 md:px-6 text-center z-10 py-12 sm:py-16 md:py-20">
        <p class="text-blue-200 uppercase tracking-widest font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">
          Simplifiez vos Voyages
        </p>
        <h1
          class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 text-white drop-shadow-lg max-w-4xl mx-auto px-2"
        >
          Votre <span class="text-orange-400">Porte d'Entrée</span> Digitale vers le Monde
        </h1>

        <p
          class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed opacity-90 px-2"
        >
          Services de visa rapides, faciles et sécurisés en ligne. Obtenez votre visa pour plus de
          15 destinations avec une expertise de confiance.
        </p>

        <div class="mt-6 sm:mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
          <router-link
            :to="{ name: 'auth.register' }"
            class="px-5 sm:px-6 md:px-8 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded-lg sm:rounded-xl shadow-2xl shadow-orange-500/30 transform hover:scale-[1.03] transition duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
          >
            <i class="fas fa-rocket"></i> <span class="hidden sm:inline">Commencer ma demande</span><span class="sm:hidden">Commencer</span>
          </router-link>

          <button
            @click="scrollToSection('services')"
            class="px-5 sm:px-6 md:px-8 py-3 sm:py-4 bg-white/10 text-white border border-white/20 hover:bg-white/20 font-semibold rounded-lg sm:rounded-xl shadow-lg transform hover:scale-[1.03] transition duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg backdrop-blur-sm"
          >
            <i class="fas fa-chevron-down"></i> <span class="hidden sm:inline">Explorer les services</span><span class="sm:hidden">Explorer</span>
          </button>
        </div>
      </div>
    </header>

    <main>
      <section id="services" class="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div class="container mx-auto px-3 sm:px-4 md:px-6">
          <div class="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4">
              Nos Services de Visa
            </h2>
            <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Obtenez votre visa pour votre destination de rêve avec notre expertise et notre
              accompagnement personnalisé.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20">
            <div
              v-for="(service, index) in visaServices"
              :key="index"
              class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-blue-50/50 rounded-bl-full transition-all duration-500 group-hover:w-full group-hover:h-full group-hover:bg-blue-50"
              ></div>

              <div class="relative z-10">
                <div
                  class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-5 shadow-lg group-hover:bg-orange-500 transition-colors duration-300"
                >
                  <i :class="['fas', service.icon]"></i>
                </div>

                <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{{ service.title }}</h3>
                <p class="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">{{ service.description }}</p>

                <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                  <span class="text-base sm:text-lg md:text-xl font-extrabold text-blue-700">{{ service.price }}</span>
                  <span class="text-gray-500 text-xs block">Frais de dossier minimum</span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mb-8 sm:mb-10 md:mb-12">
            <h3 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-3 sm:mb-4">
              Explorez nos Destinations Populaires
            </h3>
            <p class="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Plus de 15 pays pour réaliser vos projets de voyage, études ou affaires.
            </p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            <div
              v-for="(destination, index) in destinations"
              :key="index"
              v-show="activeDestinationTab === 'all'"
              class="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col items-center hover:bg-blue-50/50"
            >
              <div class="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{{ destination.flag }}</div>
              <h4 class="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">
                {{ destination.name }}
              </h4>
            </div>
          </div>
        </div>
      </section>

      <section class="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 overflow-hidden">
        <div class="container mx-auto px-3 sm:px-4 md:px-6">
          <div class="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 md:gap-16">
            <div class="lg:w-1/2 order-2 lg:order-1">
              <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-4 sm:mb-6">
                Pourquoi choisir notre Plateforme ?
              </h2>
              <p
                class="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed border-l-4 border-orange-500 pl-3 sm:pl-4 bg-white p-2 sm:p-3 rounded-lg shadow-sm"
              >
                Nous sommes votre partenaire de confiance pour toutes vos démarches de visa. Notre
                expertise et notre technologie de pointe simplifient votre expérience, de la demande
                à l'obtention.
              </p>
              <ul class="space-y-3 sm:space-y-4">
                <li class="flex items-start">
                  <span class="text-orange-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 sm:mt-1"
                    ><i class="fas fa-check-circle"></i
                  ></span>
                  <span class="text-gray-700 font-medium text-sm sm:text-base"
                    >Processus de visa
                    <strong class="text-blue-600">entièrement digitalisé</strong> et sécurisé</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-orange-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 sm:mt-1"
                    ><i class="fas fa-map-marked-alt"></i
                  ></span>
                  <span class="text-gray-700 font-medium text-sm sm:text-base"
                    >Expertise locale et connaissance des procédures complexes</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-orange-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 sm:mt-1"
                    ><i class="fas fa-clock"></i
                  ></span>
                  <span class="text-gray-700 font-medium text-sm sm:text-base"
                    >Suivi en <strong class="text-blue-600">temps réel</strong> de votre demande
                    24/7</span
                  >
                </li>
                <li class="flex items-start">
                  <span class="text-orange-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 sm:mt-1"
                    ><i class="fas fa-headset"></i
                  ></span>
                  <span class="text-gray-700 font-medium text-sm sm:text-base"
                    >Support client dédié multilingue pour vous accompagner</span
                  >
                </li>
              </ul>
            </div>

            <div class="lg:w-1/2 order-1 lg:order-2 flex justify-center p-3 sm:p-4 md:p-6">
              <div
                class="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-100 rounded-full shadow-2xl flex items-center justify-center p-4 sm:p-6 md:p-8 relative"
              >
                <div class="text-center bg-white rounded-full p-6 sm:p-8 md:p-10 shadow-inner">
                  <span class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl block mb-1 sm:mb-2 text-blue-700"
                    ><i class="fas fa-globe-americas"></i
                  ></span>
                  <p class="text-gray-600 font-semibold text-xs sm:text-sm md:text-base lg:text-lg">Votre voyage commence ici</p>
                </div>
                <div class="absolute top-6 sm:top-8 md:top-10 left-6 sm:left-8 md:left-10 text-xl sm:text-2xl md:text-3xl text-orange-500 animate-pulse">
                  <i class="fas fa-passport"></i>
                </div>
                <div
                  class="absolute bottom-6 sm:bottom-8 md:bottom-10 right-6 sm:right-8 md:right-10 text-xl sm:text-2xl md:text-3xl text-blue-500 animate-pulse delay-300"
                >
                  <i class="fas fa-file-alt"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div class="container mx-auto px-3 sm:px-4 md:px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div
              class="p-3 sm:p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-blue-700/50 transform transition duration-300 hover:scale-[1.05]"
            >
              <div class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-1 sm:mb-2 text-orange-400">98%</div>
              <p class="text-blue-200 uppercase tracking-wider text-xs sm:text-sm">Clients satisfaits</p>
            </div>

            <div
              class="p-3 sm:p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-blue-700/50 transform transition duration-300 hover:scale-[1.05]"
            >
              <div class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-1 sm:mb-2 text-orange-400">5,000+</div>
              <p class="text-blue-200 uppercase tracking-wider text-xs sm:text-sm">Dossiers traités</p>
            </div>

            <div
              class="p-3 sm:p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-blue-700/50 transform transition duration-300 hover:scale-[1.05]"
            >
              <div class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-1 sm:mb-2 text-orange-400">15+</div>
              <p class="text-blue-200 uppercase tracking-wider text-xs sm:text-sm">Pays desservis</p>
            </div>

            <div class="p-3 sm:p-4 md:p-6 transform transition duration-300 hover:scale-[1.05]">
              <div class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-1 sm:mb-2 text-orange-400">8+</div>
              <p class="text-blue-200 uppercase tracking-wider text-xs sm:text-sm">Années d'expérience</p>
            </div>
          </div>
        </div>
      </section>

      <section id="process" class="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div class="container mx-auto px-3 sm:px-4 md:px-6">
          <div class="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4">
              Notre Processus Simple en 3 Étapes
            </h2>
            <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Un processus simple et efficace, conçu pour minimiser les efforts et maximiser vos
              chances de succès.
            </p>
          </div>

          <div class="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-16">
            <div
              class="hidden md:block absolute top-1/4 left-0 right-0 h-1 border-t-2 border-dashed border-blue-200 z-0 mx-auto w-[65%] lg:w-[70%]"
            ></div>

            <div
              class="relative z-10 text-center p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-blue-100/50 border border-blue-100 transition-all duration-300 hover:shadow-blue-200"
            >
              <div
                class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl mx-auto mb-4 sm:mb-5 md:mb-6 shadow-xl shadow-orange-500/30"
              >
                <i class="fas fa-user-plus"></i>
              </div>
              <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">1. Créer un compte</h3>
              <p class="text-gray-600 text-xs sm:text-sm">
                Inscrivez-vous en quelques minutes et complétez votre profil pour personnaliser
                votre expérience.
              </p>
            </div>

            <div
              class="relative z-10 text-center p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-blue-100/50 border border-blue-100 transition-all duration-300 hover:shadow-blue-200"
            >
              <div
                class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl mx-auto mb-4 sm:mb-5 md:mb-6 shadow-xl shadow-orange-500/30"
              >
                <i class="fas fa-upload"></i>
              </div>
              <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">2. Soumettre les documents</h3>
              <p class="text-gray-600 text-xs sm:text-sm">
                Téléchargez les documents requis selon les exigences spécifiques de votre
                destination, nous vérifions tout.
              </p>
            </div>

            <div
              class="relative z-10 text-center p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-blue-100/50 border border-blue-100 transition-all duration-300 hover:shadow-blue-200"
            >
              <div
                class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl mx-auto mb-4 sm:mb-5 md:mb-6 shadow-xl shadow-orange-500/30"
              >
                <i class="fas fa-envelope-open-text"></i>
              </div>
              <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">3. Suivre et recevoir</h3>
              <p class="text-gray-600 text-xs sm:text-sm">
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
