<template>
  <section class="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
    <div class="container mx-auto px-3 sm:px-4 md:px-6">
      <!-- Header with animation -->
      <div class="text-center mb-10 sm:mb-14 md:mb-16">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4 animate-fade-in"
        >
          <i class="fa-solid fa-plane-departure text-orange-600 animate-bounce-slow"></i>
          <span class="text-xs sm:text-sm font-semibold uppercase text-orange-600 tracking-wider">
            Nos Partenaires
          </span>
        </div>
        <h2
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4"
        >
          Voyagez avec la compagnie de votre choix
        </h2>
        <p class="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
          Nous collaborons avec les meilleures compagnies aériennes mondiales pour vous offrir
          une expérience de voyage exceptionnelle.
        </p>
      </div>

      <!-- Infinite scrolling logos - Row 1 (left to right) -->
      <div class="relative mb-6 sm:mb-8">
        <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

        <div class="flex overflow-hidden">
          <div class="flex animate-scroll-left">
            <div
              v-for="(airline, index) in [...airlines, ...airlines]"
              :key="'row1-' + index"
              class="flex-shrink-0 mx-3 sm:mx-4"
            >
              <div
                class="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 flex items-center justify-center h-20 sm:h-24 md:h-28 w-32 sm:w-40 md:w-48 group border border-gray-100 hover:border-blue-200"
              >
                <img
                  :src="airline.logo"
                  :alt="airline.name"
                  class="max-h-10 sm:max-h-12 md:max-h-14 w-auto opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Infinite scrolling logos - Row 2 (right to left) -->
      <div class="relative">
        <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

        <div class="flex overflow-hidden">
          <div class="flex animate-scroll-right">
            <div
              v-for="(airline, index) in [...airlinesReversed, ...airlinesReversed]"
              :key="'row2-' + index"
              class="flex-shrink-0 mx-3 sm:mx-4"
            >
              <div
                class="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 flex items-center justify-center h-20 sm:h-24 md:h-28 w-32 sm:w-40 md:w-48 group border border-gray-100 hover:border-orange-200"
              >
                <img
                  :src="airline.logo"
                  :alt="airline.name"
                  class="max-h-10 sm:max-h-12 md:max-h-14 w-auto opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust badges -->
      <div class="mt-12 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
        <div
          v-for="(badge, index) in trustBadges"
          :key="index"
          class="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
        >
          <div
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-300"
            :class="badge.bgColor"
          >
            <i :class="[badge.icon, badge.iconColor, 'text-sm sm:text-base']"></i>
          </div>
          <span class="text-xs sm:text-sm font-semibold text-gray-700">{{ badge.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Import des logos des compagnies aériennes
import AirFranceLogo from '@/assets/images/airlines/air-france.jpg'
import BritishAirwaysLogo from '@/assets/images/airlines/british-airways.jpg'
import EmiratesLogo from '@/assets/images/airlines/emirates.png'
import QatarAirwaysLogo from '@/assets/images/airlines/qatar-airways.jpg'
import TurkishAirlinesLogo from '@/assets/images/airlines/turkish-airlines.jpg'
import LufthansaLogo from '@/assets/images/airlines/lufthansa.jpg'
import AirCanadaLogo from '@/assets/images/airlines/air-canada.jpg'
import KlmLogo from '@/assets/images/airlines/klm.png'

// Données des compagnies aériennes
const airlines = [
  {
    name: 'Air France',
    logo: AirFranceLogo,
  },
  {
    name: 'British Airways',
    logo: BritishAirwaysLogo,
  },
  {
    name: 'Emirates',
    logo: EmiratesLogo,
  },
  {
    name: 'Qatar Airways',
    logo: QatarAirwaysLogo,
  },
  {
    name: 'Turkish Airlines',
    logo: TurkishAirlinesLogo,
  },
  {
    name: 'Lufthansa',
    logo: LufthansaLogo,
  },
  {
    name: 'Air Canada',
    logo: AirCanadaLogo,
  },
  {
    name: 'KLM',
    logo: KlmLogo,
  },
]

const airlinesReversed = computed(() => [...airlines].reverse())

// Trust badges
const trustBadges = [
  {
    icon: 'fas fa-shield-alt',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100 group-hover:bg-green-200',
    text: 'Paiement Sécurisé',
  },
  {
    icon: 'fas fa-certificate',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100 group-hover:bg-blue-200',
    text: 'Agence Accréditée',
  },
  {
    icon: 'fas fa-headset',
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-100 group-hover:bg-orange-200',
    text: 'Support 24/7',
  },
  {
    icon: 'fas fa-star',
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100 group-hover:bg-yellow-200',
    text: '98% Satisfaction',
  },
]
</script>

<style scoped>
/* Scroll animation left to right */
@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll-left {
  animation: scroll-left 25s linear infinite;
}

.animate-scroll-left:hover {
  animation-play-state: paused;
}

/* Scroll animation right to left */
@keyframes scroll-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-scroll-right {
  animation: scroll-right 25s linear infinite;
}

.animate-scroll-right:hover {
  animation-play-state: paused;
}

/* Fade in animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

/* Slow bounce for icon */
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
