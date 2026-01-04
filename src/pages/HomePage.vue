<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow } from 'swiper/modules'
import CountUp from 'vue-countup-v3'
import ChoiceSection from '@/components/ChoiceSection.vue'
import AvisSection from '@/components/AvisSection.vue'
import PartnersSection from '@/components/PartnersSection.vue'
import CtaSection from '@/components/CtaSection.vue'
import FaqSection from '@/components/FaqSection.vue'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import 'swiper/css/effect-coverflow'

// Images de fond pour le hero slider
import Hero1 from '@/assets/images/hero/hero1.jpg'
import Hero2 from '@/assets/images/hero/hero2.jpg'
import Hero3 from '@/assets/images/hero/hero3.jpg'
import Hero4 from '@/assets/images/hero/hero4.jpg'

// Images pour les services
import TourismImg from '@/assets/images/services/tourism.jpg'
import StudiesImg from '@/assets/images/services/studies.jpg'
import WorkImg from '@/assets/images/services/work.jpg'
import BusinessImg from '@/assets/images/services/business.jpg'

// Images pour les destinations
import FranceImg from '@/assets/images/destinations/france.jpg'
import CanadaImg from '@/assets/images/destinations/canada.jpg'
import UsaImg from '@/assets/images/destinations/usa.jpg'
import UkImg from '@/assets/images/destinations/uk.jpg'
import JapanImg from '@/assets/images/destinations/japan.jpg'
import GermanyImg from '@/assets/images/destinations/germany.jpg'
import ItalyImg from '@/assets/images/destinations/italy.jpg'
import SpainImg from '@/assets/images/destinations/spain.jpg'
import NetherlandsImg from '@/assets/images/destinations/netherlands.jpg'
import AustraliaImg from '@/assets/images/destinations/australia.jpg'
import SingaporeImg from '@/assets/images/destinations/singapore.jpg'
import SouthKoreaImg from '@/assets/images/destinations/south-korea.jpg'

const swiperModules = [Autoplay, Pagination, Navigation, EffectFade, EffectCoverflow]

// Hero backgrounds
const heroSlides = [
  {
    image: Hero1,
    title: 'Votre <span class="text-orange-400">Porte d\'Entrée</span> Digitale vers le Monde',
    subtitle: 'Services de visa rapides, faciles et sécurisés en ligne.',
  },
  {
    image: Hero2,
    title: 'Voyagez <span class="text-orange-400">Sans Souci</span> avec Nous',
    subtitle: 'Plus de 15 destinations disponibles avec expertise de confiance.',
  },
  {
    image: Hero3,
    title: 'Explorez le <span class="text-orange-400">Monde</span> Sans Limite',
    subtitle: 'Des centaines de voyageurs nous font confiance chaque jour.',
  },
  {
    image: Hero4,
    title: 'Obtenez votre <span class="text-orange-400">Visa</span> en Quelques Clics',
    subtitle: 'Processus simplifié et suivi en temps réel de votre demande.',
  },
]

// Typing effect - synchronisé avec le slider (5 secondes par slide)
const typingTexts = ['Tourisme', 'Études', 'Travail', 'Affaires']
const currentTypingIndex = ref(0)
const displayedText = ref('')

// Scroll animations
const isStatsVisible = ref(false)
const animatedElements = ref<Set<Element>>(new Set())

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Visa services data
const visaServices = [
  {
    title: 'Tourisme',
    description: 'Obtenez votre visa pour vos séjours touristiques',
    price: '20,000 FCFA',
    icon: 'fa-plane-departure',
    color: 'blue',
    image: TourismImg,
  },
  {
    title: 'Études',
    description: "Facilité d'accès pour vos études à l'étranger",
    price: '20,000 FCFA',
    icon: 'fa-graduation-cap',
    color: 'purple',
    image: StudiesImg,
  },
  {
    title: 'Travail',
    description: 'Procédure simplifiée pour votre visa de travail',
    price: '20,000 FCFA',
    icon: 'fa-briefcase',
    color: 'green',
    image: WorkImg,
  },
  {
    title: 'Affaires',
    description: "Services express pour les voyageurs d'affaires",
    price: '20,000 FCFA',
    icon: 'fa-building',
    color: 'orange',
    image: BusinessImg,
  },
]

// Destinations data
const destinations = [
  { name: 'France', flag: '🇫🇷', popular: true, image: FranceImg },
  { name: 'Canada', flag: '🇨🇦', popular: true, image: CanadaImg },
  { name: 'États-Unis', flag: '🇺🇸', popular: true, image: UsaImg },
  { name: 'Royaume-Uni', flag: '🇬🇧', popular: true, image: UkImg },
  { name: 'Allemagne', flag: '🇩🇪', popular: false, image: GermanyImg },
  { name: 'Italie', flag: '🇮🇹', popular: false, image: ItalyImg },
  { name: 'Espagne', flag: '🇪🇸', popular: false, image: SpainImg },
  { name: 'Pays-Bas', flag: '🇳🇱', popular: false, image: NetherlandsImg },
  { name: 'Japon', flag: '🇯🇵', popular: true, image: JapanImg },
  { name: 'Australie', flag: '🇦🇺', popular: false, image: AustraliaImg },
  { name: 'Singapour', flag: '🇸🇬', popular: false, image: SingaporeImg },
  { name: 'Corée du Sud', flag: '🇰🇷', popular: false, image: SouthKoreaImg },
]

// Stats data
const stats = [
  { value: 98, suffix: '%', label: 'Clients satisfaits' },
  { value: 5000, suffix: '+', label: 'Dossiers traités' },
  { value: 15, suffix: '+', label: 'Pays desservis' },
  { value: 8, suffix: '+', label: "Années d'expérience" },
]

// Process steps
const processSteps = [
  {
    icon: 'fa-user-plus',
    title: 'Créer un compte',
    description: 'Inscrivez-vous en quelques minutes et complétez votre profil.',
  },
  {
    icon: 'fa-upload',
    title: 'Soumettre les documents',
    description: 'Téléchargez les documents requis selon votre destination.',
  },
  {
    icon: 'fa-envelope-open-text',
    title: 'Suivre et recevoir',
    description: "Suivez l'avancement et recevez votre visa en sécurité.",
  },
]

// Destination filter
const destinationFilter = ref<'all' | 'popular'>('all')
const filteredDestinations = computed(() => {
  if (destinationFilter.value === 'popular') {
    return destinations.filter((d) => d.popular)
  }
  return destinations
})

// Typing effect logic - synchronisé avec le slider (5 secondes = 5000ms)
const SLIDE_DURATION = 5000 // Durée d'une slide en ms
let typingTimeout: ReturnType<typeof setTimeout> | null = null
let isDeleting = false

const typeText = () => {
  const currentText = typingTexts[currentTypingIndex.value]
  const textLength = currentText.length

  // Calcul des durées pour synchroniser avec le slider
  // On veut: frappe + pause + effacement + pause = 5000ms
  // Répartition: frappe (30%), pause au milieu (40%), effacement (20%), pause fin (10%)
  const typeTime = (SLIDE_DURATION * 0.3) / textLength // temps par caractère pour la frappe
  const deleteTime = (SLIDE_DURATION * 0.2) / textLength // temps par caractère pour l'effacement
  const pauseMiddle = SLIDE_DURATION * 0.4 // pause quand le mot est complet
  const pauseEnd = SLIDE_DURATION * 0.1 // pause avant le prochain mot

  if (!isDeleting) {
    displayedText.value = currentText.substring(0, displayedText.value.length + 1)

    if (displayedText.value === currentText) {
      // Pause avant de commencer à effacer
      typingTimeout = setTimeout(() => {
        isDeleting = true
        typeText()
      }, pauseMiddle)
      return
    }
    // Vitesse de frappe
    typingTimeout = setTimeout(typeText, typeTime)
  } else {
    displayedText.value = currentText.substring(0, displayedText.value.length - 1)

    if (displayedText.value === '') {
      isDeleting = false
      currentTypingIndex.value = (currentTypingIndex.value + 1) % typingTexts.length
      // Petite pause avant le prochain mot
      typingTimeout = setTimeout(typeText, pauseEnd)
      return
    }
    // Vitesse d'effacement
    typingTimeout = setTimeout(typeText, deleteTime)
  }
}

// Intersection Observer for scroll animations
let observer: IntersectionObserver | null = null

const setupScrollAnimations = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          animatedElements.value.add(entry.target)

          // Stats section visibility
          if (entry.target.id === 'stats-section') {
            isStatsVisible.value = true
          }
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  // Observe all animated elements
  setTimeout(() => {
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer?.observe(el)
    })
  }, 100)
}

onMounted(() => {
  setupScrollAnimations()

  // Start typing effect
  typeText()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})
</script>

<template>
  <div class="bg-white text-gray-900 min-h-screen overflow-x-hidden">
    <!-- Hero Section with Slider -->
    <header class="relative min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] overflow-hidden">
      <Swiper
        :modules="swiperModules"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :effect="'fade'"
        :pagination="{ clickable: true }"
        class="h-full absolute inset-0"
      >
        <SwiperSlide v-for="(slide, index) in heroSlides" :key="index">
          <div class="relative h-full min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh]">
            <!-- Image de fond en pleine qualité -->
            <div
              class="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-105"
              :style="{ backgroundImage: `url('${slide.image}')` }"
            ></div>
            <!-- Overlay léger pour lisibilité du texte -->
            <div
              class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
            ></div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Hero Content (overlay) -->
      <div
        class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      >
        <div class="container mx-auto px-3 sm:px-4 md:px-6 text-center py-12 sm:py-16 md:py-20">
          <p
            class="text-white/90 uppercase tracking-widest font-semibold mb-2 sm:mb-3 text-xs sm:text-sm animate-fade-in-down drop-shadow-md"
          >
            Simplifiez vos Voyages
          </p>

          <h1
            class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 text-white drop-shadow-xl max-w-4xl mx-auto px-2"
          >
            Votre <span class="text-orange-400 drop-shadow-lg">Porte d'Entrée</span> Digitale vers le Monde
          </h1>

          <!-- Typing Effect -->
          <div class="h-12 sm:h-14 md:h-16 flex items-center justify-center mb-4">
            <span class="text-xl sm:text-2xl md:text-3xl text-orange-400 font-bold drop-shadow-lg">
              Visa
              <span class="text-white border-r-2 border-white pr-1 animate-blink drop-shadow-md">{{
                displayedText
              }}</span>
            </span>
          </div>

          <p
            class="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-2 drop-shadow-md"
          >
            Services de visa rapides, faciles et sécurisés en ligne. Obtenez votre visa pour
            plus de 15 destinations avec une expertise de confiance.
          </p>

          <div
            class="mt-6 sm:mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2 pointer-events-auto"
          >
            <router-link
              :to="{ name: 'auth.register' }"
              class="group px-5 sm:px-6 md:px-8 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded-lg sm:rounded-xl shadow-2xl shadow-orange-500/30 transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg"
            >
              <i class="fas fa-rocket group-hover:animate-bounce"></i>
              <span class="hidden sm:inline">Commencer ma demande</span>
              <span class="sm:hidden">Commencer</span>
            </router-link>

            <button
              @click="scrollToSection('services')"
              class="group px-5 sm:px-6 md:px-8 py-3 sm:py-4 bg-white/10 text-white border border-white/20 hover:bg-white/20 font-semibold rounded-lg sm:rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg backdrop-blur-sm"
            >
              <i class="fas fa-chevron-down group-hover:animate-bounce"></i>
              <span class="hidden sm:inline">Explorer les services</span>
              <span class="sm:hidden">Explorer</span>
            </button>
          </div>

          <!-- Scroll indicator -->
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <div
              class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center cursor-pointer hover:border-white transition-colors"
              @click="scrollToSection('services')"
            >
              <div class="w-1 h-3 bg-white/70 rounded-full mt-2 animate-scroll-down"></div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main>
      <!-- Services Section -->
      <section id="services" class="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div class="container mx-auto px-3 sm:px-4 md:px-6">
          <div class="text-center mb-8 sm:mb-12 md:mb-16 scroll-animate opacity-0">
            <h2
              class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4"
            >
              Nos Services de Visa
            </h2>
            <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Obtenez votre visa pour votre destination de rêve avec notre expertise et notre
              accompagnement personnalisé.
            </p>
          </div>

          <!-- Services Cards with Images (Animation only, not clickable) -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20"
          >
            <div
              v-for="(service, index) in visaServices"
              :key="index"
              class="scroll-animate opacity-0 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden h-[320px] sm:h-[360px] md:h-[400px] select-none"
              :style="{ transitionDelay: `${index * 100}ms` }"
            >
              <!-- Background Image with Ken Burns effect -->
              <div
                class="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out group-hover:scale-110 animate-ken-burns"
                :style="{ backgroundImage: `url('${service.image}')`, animationDelay: `${index * 2}s` }"
              ></div>

              <!-- Overlay gradient -->
              <div
                class="absolute inset-0 transition-all duration-500 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              ></div>

              <!-- Animated shine effect -->
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              <!-- Content -->
              <div class="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 md:p-6 z-10">
                <!-- Icon badge with pulse animation -->
                <div
                  class="absolute top-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg transition-all duration-500 group-hover:scale-110 backdrop-blur-sm animate-pulse-slow"
                  :class="{
                    'bg-blue-500/90 text-white': service.color === 'blue',
                    'bg-purple-500/90 text-white': service.color === 'purple',
                    'bg-green-500/90 text-white': service.color === 'green',
                    'bg-orange-500/90 text-white': service.color === 'orange',
                  }"
                >
                  <i :class="['fas', service.icon]"></i>
                </div>

                <h3 class="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {{ service.title }}
                </h3>
                <p class="text-white/90 mb-3 text-sm leading-relaxed">
                  {{ service.description }}
                </p>

                <div class="flex items-center justify-between pt-3 border-t border-white/30">
                  <div>
                    <span class="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
                      {{ service.price }}
                    </span>
                    <span class="text-white/70 text-xs block">Frais de dossier</span>
                  </div>

                  <!-- Decorative icon -->
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm"
                  >
                    <i class="fas fa-passport text-white/80"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Destinations Section with Swiper -->
          <div class="scroll-animate opacity-0">
            <div class="text-center mb-8 sm:mb-10 md:mb-12">
              <h3
                class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-3 sm:mb-4"
              >
                Explorez nos Destinations Populaires
              </h3>
              <p class="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2 mb-6">
                Plus de 15 pays pour réaliser vos projets de voyage, études ou affaires.
              </p>

              <!-- Filter tabs -->
              <div class="flex justify-center gap-2 mb-8">
                <button
                  @click="destinationFilter = 'all'"
                  class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  :class="
                    destinationFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  "
                >
                  Toutes
                </button>
                <button
                  @click="destinationFilter = 'popular'"
                  class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  :class="
                    destinationFilter === 'popular'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  "
                >
                  <i class="fas fa-star text-yellow-500 mr-1"></i> Populaires
                </button>
              </div>
            </div>

            <!-- Destinations Carousel -->
            <Swiper
              :modules="swiperModules"
              :slides-per-view="2"
              :space-between="16"
              :loop="true"
              :autoplay="{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }"
              :pagination="{ clickable: true }"
              :navigation="true"
              :breakpoints="{
                640: { slidesPerView: 3, spaceBetween: 20 },
                768: { slidesPerView: 4, spaceBetween: 24 },
                1024: { slidesPerView: 6, spaceBetween: 24 },
              }"
              class="destinations-swiper pb-12"
            >
              <SwiperSlide
                v-for="destination in filteredDestinations"
                :key="destination.name"
              >
                <div
                  class="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group h-[140px] sm:h-[160px] md:h-[180px] select-none"
                >
                  <!-- Background Image or Gradient with Ken Burns -->
                  <div
                    v-if="destination.image"
                    class="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out group-hover:scale-110 animate-ken-burns-slow"
                    :style="{ backgroundImage: `url('${destination.image}')` }"
                  ></div>
                  <div
                    v-else
                    class="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"
                  ></div>

                  <!-- Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  ></div>

                  <!-- Content -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center p-3 z-10">
                    <div
                      class="text-3xl sm:text-4xl md:text-5xl mb-1 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-lg animate-float-subtle"
                    >
                      {{ destination.flag }}
                    </div>
                    <h4 class="font-bold text-white text-sm sm:text-base drop-shadow-md">
                      {{ destination.name }}
                    </h4>
                    <span
                      v-if="destination.popular"
                      class="mt-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full font-medium shadow-md animate-pulse-slow"
                    >
                      <i class="fas fa-star mr-1"></i>Populaire
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 overflow-hidden">
        <div class="container mx-auto px-3 sm:px-4 md:px-6">
          <div class="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 md:gap-16">
            <div class="lg:w-1/2 order-2 lg:order-1 scroll-animate opacity-0">
              <h2
                class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-4 sm:mb-6"
              >
                Pourquoi choisir notre Plateforme ?
              </h2>
              <p
                class="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed border-l-4 border-orange-500 pl-3 sm:pl-4 bg-white p-2 sm:p-3 rounded-lg shadow-sm"
              >
                Nous sommes votre partenaire de confiance pour toutes vos démarches de visa.
                Notre expertise et notre technologie de pointe simplifient votre expérience.
              </p>

              <ul class="space-y-4">
                <li
                  v-for="(item, index) in [
                    {
                      icon: 'fa-check-circle',
                      text: 'Processus de visa <strong class=\'text-blue-600\'>entièrement digitalisé</strong> et sécurisé',
                    },
                    {
                      icon: 'fa-map-marked-alt',
                      text: 'Expertise locale et connaissance des procédures complexes',
                    },
                    {
                      icon: 'fa-clock',
                      text: 'Suivi en <strong class=\'text-blue-600\'>temps réel</strong> de votre demande 24/7',
                    },
                    {
                      icon: 'fa-headset',
                      text: 'Support client dédié multilingue pour vous accompagner',
                    },
                  ]"
                  :key="index"
                  class="flex items-start group scroll-animate opacity-0"
                  :style="{ transitionDelay: `${index * 150}ms` }"
                >
                  <span
                    class="text-orange-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 sm:mt-1 transform group-hover:scale-110 transition-transform duration-300"
                  >
                    <i :class="['fas', item.icon]"></i>
                  </span>
                  <span
                    class="text-gray-700 font-medium text-sm sm:text-base"
                    v-html="item.text"
                  ></span>
                </li>
              </ul>
            </div>

            <div
              class="lg:w-1/2 order-1 lg:order-2 flex justify-center p-3 sm:p-4 md:p-6 scroll-animate opacity-0"
            >
              <div
                class="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-100 rounded-full shadow-2xl flex items-center justify-center p-4 sm:p-6 md:p-8 relative animate-pulse-slow"
              >
                <div
                  class="text-center bg-white rounded-full p-6 sm:p-8 md:p-10 shadow-inner hover:shadow-lg transition-shadow duration-300"
                >
                  <span
                    class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl block mb-1 sm:mb-2 text-blue-700"
                  >
                    <i class="fas fa-globe-americas animate-spin-slow"></i>
                  </span>
                  <p class="text-gray-600 font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
                    Votre voyage commence ici
                  </p>
                </div>

                <!-- Floating icons -->
                <div
                  class="absolute top-6 sm:top-8 md:top-10 left-6 sm:left-8 md:left-10 text-xl sm:text-2xl md:text-3xl text-orange-500 animate-float"
                >
                  <i class="fas fa-passport"></i>
                </div>
                <div
                  class="absolute bottom-6 sm:bottom-8 md:bottom-10 right-6 sm:right-8 md:right-10 text-xl sm:text-2xl md:text-3xl text-blue-500 animate-float-delayed"
                >
                  <i class="fas fa-file-alt"></i>
                </div>
                <div
                  class="absolute top-1/2 right-0 text-lg sm:text-xl md:text-2xl text-green-500 animate-float"
                  style="animation-delay: 0.5s"
                >
                  <i class="fas fa-plane"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section with Animated Counters -->
      <section
        id="stats-section"
        class="py-10 sm:py-12 md:py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white scroll-animate opacity-0"
      >
        <div class="container mx-auto px-3 sm:px-4 md:px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div
              v-for="(stat, index) in stats"
              :key="index"
              class="p-3 sm:p-4 md:p-6 transform transition duration-500 hover:scale-110"
              :class="{
                'border-b-2 md:border-b-0 md:border-r-2 border-blue-700/50': index < 3,
              }"
            >
              <div
                class="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold mb-1 sm:mb-2 text-orange-400"
              >
                <template v-if="isStatsVisible">
                  <CountUp :end-val="stat.value" :duration="2.5" :options="{ separator: ',' }" />
                </template>
                <template v-else>0</template>
                {{ stat.suffix }}
              </div>
              <p class="text-blue-200 uppercase tracking-wider text-xs sm:text-sm">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Process Section -->
      <section id="process" class="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div class="container mx-auto px-3 sm:px-4 md:px-6">
          <div class="text-center mb-8 sm:mb-12 md:mb-16 scroll-animate opacity-0">
            <h2
              class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4"
            >
              Notre Processus Simple en 3 Étapes
            </h2>
            <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
              Un processus simple et efficace, conçu pour minimiser les efforts et maximiser
              vos chances de succès.
            </p>
          </div>

          <div class="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-16">
            <!-- Connection line -->
            <div
              class="hidden md:block absolute top-1/4 left-0 right-0 h-1 border-t-2 border-dashed border-blue-200 z-0 mx-auto w-[65%] lg:w-[70%]"
            ></div>

            <div
              v-for="(step, index) in processSteps"
              :key="index"
              class="relative z-10 text-center p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-blue-100/50 border border-blue-100 transition-all duration-500 hover:shadow-blue-200 scroll-animate opacity-0 group cursor-pointer"
              :style="{ transitionDelay: `${index * 200}ms` }"
            >
              <div
                class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl mx-auto mb-4 sm:mb-5 md:mb-6 shadow-xl shadow-orange-500/30 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
              >
                <i :class="['fas', step.icon]"></i>
              </div>

              <!-- Step number badge -->
              <div
                class="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
              >
                {{ index + 1 }}
              </div>

              <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                {{ step.title }}
              </h3>
              <p class="text-gray-600 text-xs sm:text-sm">{{ step.description }}</p>
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
/* Typing cursor blink */
@keyframes blink {
  0%,
  50% {
    border-color: transparent;
  }
  51%,
  100% {
    border-color: white;
  }
}
.animate-blink {
  animation: blink 1s infinite;
}

/* Scroll down indicator */
@keyframes scroll-down {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(8px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-scroll-down {
  animation: scroll-down 1.5s infinite ease-in-out;
}

/* Float animation */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-float {
  animation: float 3s infinite ease-in-out;
}
.animate-float-delayed {
  animation: float 3s infinite ease-in-out 0.5s;
}

/* Slow spin for globe */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

/* Slow pulse */
@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 4s infinite ease-in-out;
}

/* Fade in animations */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

/* Scroll animate class */
.scroll-animate {
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
  transform: translateY(30px);
}
.scroll-animate.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Swiper customizations */
:deep(.swiper-pagination-bullet) {
  background: #3b82f6;
  opacity: 0.5;
}
:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #f97316;
}
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #3b82f6;
  background: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 16px;
  font-weight: bold;
}
:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: #3b82f6;
  color: white;
}

.destinations-swiper {
  padding: 10px 5px 50px 5px;
}

/* Ken Burns effect for images */
@keyframes ken-burns {
  0% {
    transform: scale(1) translate(0, 0);
  }
  50% {
    transform: scale(1.1) translate(-1%, -1%);
  }
  100% {
    transform: scale(1) translate(0, 0);
  }
}
.animate-ken-burns {
  animation: ken-burns 20s ease-in-out infinite;
}

@keyframes ken-burns-slow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
}
.animate-ken-burns-slow {
  animation: ken-burns-slow 15s ease-in-out infinite;
}

/* Subtle float for flags */
@keyframes float-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
.animate-float-subtle {
  animation: float-subtle 3s ease-in-out infinite;
}
</style>
