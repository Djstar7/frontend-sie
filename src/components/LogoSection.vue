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
  <div class="mx-auto text-center">
    <div>
      <h2 class="text-2xl font-bold mb-8 mt-4 w-full">Autres options</h2>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center">
      <div
        v-for="logo in logos"
        :key="logo.name"
        class="flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-xl transition"
      >
        <img :src="logo.src" :alt="logo.name" class="h-16 w-16 object-contain" />
      </div>
    </div>
  </div>
</template>
