<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Famille from '@/assets/images/banners/famille.png'
import Etudiant from '@/assets/images/banners/etudiant.png'
import Entrepreneut from '@/assets/images/banners/entrepreneut.png'
import Vielle from '@/assets/images/banners/vielle.png'

const images = [
  { src: Famille, text: 'Voyage en famille inoubliable' },
  { src: Etudiant, text: 'Séjours étudiants adaptés' },
  { src: Entrepreneut, text: 'Voyages d’affaires simplifiés' },
  { src: Vielle, text: 'Découverte pour les seniors' },
]

const currentIndex = ref(0)
const displayedText = ref('')

// Typewriter
let typeIndex = 0
const typeWriter = (text: string) => {
  displayedText.value = ''
  typeIndex = 0
  const write = () => {
    if (typeIndex < text.length) {
      displayedText.value += text[typeIndex]
      typeIndex++
      setTimeout(write, 100)
    }
  }
  write()
}

// Slider auto
const changeImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

onMounted(() => {
  typeWriter(images[currentIndex.value].text)
  setInterval(() => {
    changeImage()
  }, 8000)
})

watch(currentIndex, (newIndex) => {
  typeWriter(images[newIndex].text)
})
</script>

<template>
  <div class="top-0 left-0 w-full h-screen overflow-hidden">
    <div class="relative w-full h-full flex items-start justify-start">
      <transition-group name="slide" tag="div">
        <img
          v-for="(image, i) in images"
          v-show="i === currentIndex"
          :key="i"
          :src="image.src"
          class="absolute top-0 left-0 w-full h-full object-cover"
        />
      </transition-group>

      <!-- Texte overlay -->
      <div class="absolute w-full text-center top-1/2 transform -translate-y-1/2 px-4">
        <div
          class="typewriter text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-xl"
        >
          {{ displayedText }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Typewriter */
.typewriter {
  white-space: normal; /* permet le retour à la ligne */
  overflow: hidden;
  border-right: 2px solid white;
  word-wrap: break-word; /* coupe les mots si besoin */
  animation: blink-caret 0.7s step-end infinite;
  display: flex;
}

@keyframes blink-caret {
  50% {
    border-color: transparent;
  }
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition:
    transform 1s ease,
    opacity 1s ease;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 1;
}
</style>
