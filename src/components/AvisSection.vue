<script setup lang="ts">
import { computed } from 'vue'

const testimonials = [
  {
    text: 'Un service rapide, efficace et une équipe à l’écoute. Je recommande sans hésiter !',
    name: 'Jean Dupont',
    role: 'Entrepreneur',
    img: 'https://i.pravatar.cc/100?img=1',
  },
  {
    text: 'Grâce à eux, j’ai pu lancer mon projet plus rapidement que prévu. Une super expérience !',
    name: 'Amina Ndiaye',
    role: 'Designer',
    img: 'https://i.pravatar.cc/100?img=5',
  },
  {
    text: 'Une équipe professionnelle et un accompagnement personnalisé. J’ai adoré travailler avec eux !',
    name: 'Marc Talla',
    role: 'Développeur',
    img: 'https://i.pravatar.cc/100?img=12',
  },
  {
    text: 'Le suivi en temps réel est incroyable, j’ai toujours su où en était ma demande.',
    name: 'Sophie Martin',
    role: 'Étudiante',
    img: 'https://i.pravatar.cc/100?img=32',
  },
  {
    text: 'Paiement simple et service au top ! Je recommande fortement.',
    name: 'Ousmane Diallo',
    role: 'Consultant',
    img: 'https://i.pravatar.cc/100?img=45',
  },
]

const duplicatedTestimonials = computed(() => [...testimonials, ...testimonials])
</script>

<template>
  <section class="bg-gradient-to-br from-purple-600 to-blue-500 py-20">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Titre -->
      <h2 class="text-4xl md:text-5xl font-extrabold text-center text-white mb-12 tracking-tight">
        Témoignages
      </h2>

      <!-- Container slider -->
      <div class="relative overflow-hidden group">
        <!-- Liste d'avis -->
        <div class="flex animate-infinite-scroll group-hover:pause">
          <div
            v-for="(t, i) in duplicatedTestimonials"
            :key="i"
            class="min-w-full md:min-w-1/2 lg:min-w-1/3 px-4 flex"
          >
            <div
              class="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-8 w-full text-center transform transition-transform duration-300 hover:scale-105"
            >
              <p class="text-gray-700 mb-6 italic text-lg">“{{ t.text }}”</p>
              <div class="flex items-center justify-center gap-4">
                <img :src="t.img" :alt="t.name" class="w-14 h-14 rounded-full" />
                <div class="text-left">
                  <h4 class="font-semibold text-gray-900">{{ t.name }}</h4>
                  <span class="text-sm text-gray-500">{{ t.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes infinite-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-infinite-scroll {
  animation: infinite-scroll 40s linear infinite;
}

.group:hover .animate-infinite-scroll {
  animation-play-state: paused;
}
</style>
