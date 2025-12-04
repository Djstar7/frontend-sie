<template>
  <section class="py-24 bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="text-center mb-16">
        <span
          class="text-sm font-semibold uppercase text-orange-600 tracking-wider flex items-center justify-center gap-2 mb-2"
        >
          <i class="fa-solid fa-plane-departure"></i> Partenaires
        </span>
        <h2 class="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-4 mt-2">
          Voyagez avec la compagnie de votre choix
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Liberté de choisir la compagnie aérienne qui vous convient le mieux.
        </p>
      </div>

      <div class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-6 max-w-6xl mx-auto">
        <div
          v-for="(airline, index) in airlines"
          :key="index"
          class="bg-white p-4 rounded-xl shadow-md flex items-center justify-center h-20 transition-all duration-300 hover:shadow-lg"
        >
          <img
            :src="airline.logo"
            :alt="airline.name"
            class="max-h-12 w-auto opacity-70 hover:opacity-100 transition duration-300 grayscale hover:grayscale-0"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Données des compagnies aériennes
const airlines = [
  {
    name: 'Air France',
    logo: 'https://estuairevisa.com/asset/images/airline/6856f45dd08211750529117.jpg',
  },
  {
    name: 'British Airways',
    logo: 'https://estuairevisa.com/asset/images/airline/6856f455c233a1750529109.jpg',
  },
  {
    name: 'Emirates',
    logo: 'https://estuairevisa.com/asset/images/airline/6856f455c233a1750529109.jpg',
  },
  {
    name: 'Qatar Airways',
    logo: 'https://estuairevisa.com/asset/images/airline/6856f41e813391750529054.jpg',
  },
  {
    name: 'Turkish Airlines',
    logo: 'https://estuairevisa.com/asset/images/airline/6856f4167cc211750529046.jpg',
  },
  {
    name: 'Lufthansa',
    logo: 'https://estuairevisa.com/asset/images/airline/6856f4085405e1750529032.jpg',
  },
  {
    name: 'Air Canada',
    logo: 'https://estuairevisa.com/asset/images/airline/6856f40155f251750529025.jpg',
  },
  {
    name: 'Autre',
    logo: 'https://estuairevisa.com/asset/images/airline/6856f45dd08211750529117.jpg',
  },
]
</script>

<style scoped>
/*
@keyframes scroll-logos {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.animate-scroll-logos {
    animation: scroll-logos 30s linear infinite;
    display: flex;
}
*/
</style>
