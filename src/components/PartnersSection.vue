<script setup lang="ts">
// Définition d'un type pour les logos
interface Logo {
  name: string
  src: string
}
import Facebook from '@/assets/images/banners/facebook.png'
import Google from '@/assets/images/banners/google.png'
import Apple from '@/assets/images/banners/apple.png'
import Microsoft from '@/assets/images/banners/microsoft.jpg'

// Tableau de logos (tu peux ajouter autant que tu veux)
const logos: Logo[] = [
  { name: 'Google', src: Google },
  { name: 'Facebook', src: Facebook },
  { name: 'Apple', src: Apple },
  { name: 'Microsoft', src: Microsoft },
]
</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-6 text-center">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Nos Partenaires</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Nous collaborons avec les meilleures entreprises pour vous offrir des services de qualité
        </p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-items-center">
        <div
          v-for="logo in logos"
          :key="logo.name"
          class="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <img
            :src="logo.src"
            :alt="logo.name"
            class="h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  </section>
</template>
