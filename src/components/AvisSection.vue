<template>
  <div class="bg-white">
    <section class="py-24 bg-gray-50 overflow-hidden">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="lg:w-1/2">
            <span
              class="text-sm font-semibold uppercase text-orange-600 tracking-wider flex items-center gap-2 mb-2"
            >
              <i class="fa-solid fa-plane-departure"></i> Certification
            </span>
            <h2 class="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-4 mt-2">
              Agence Légalement Accréditée
            </h2>
            <p class="text-lg text-gray-700 leading-relaxed">
              **Immigration de l'Estuaire** est une agence agréée et certifiée pour le traitement
              des demandes de visa. Nous respectons toutes les réglementations en vigueur et
              travaillons en étroite collaboration avec les ambassades et consulats du monde entier.
            </p>
          </div>

          <div class="lg:w-1/2 ps-xxl-5">
            <div
              class="grid grid-cols-3 gap-4 sm:gap-6 p-4 bg-white rounded-xl shadow-2xl border border-blue-100"
            >
              <div class="p-3 bg-white rounded-lg shadow-inner flex justify-center items-center">
                <img
                  src="https://estuairevisa.com/asset/frontend/img/pagebuilder/6838c59bbc0c0.jpg"
                  alt="Logo de Certification 1"
                  class="max-h-20 w-auto opacity-70 hover:opacity-100 transition duration-300"
                />
              </div>
              <div class="p-3 bg-white rounded-lg shadow-inner flex justify-center items-center">
                <img
                  src="https://estuairevisa.com/asset/frontend/img/pagebuilder/6838c5a123a39.jpg"
                  alt="Logo de Certification 2"
                  class="max-h-20 w-auto opacity-70 hover:opacity-100 transition duration-300"
                />
              </div>
              <div class="p-3 bg-white rounded-lg shadow-inner flex justify-center items-center">
                <img
                  src="https://estuairevisa.com/asset/frontend/img/pagebuilder/6838c5a5dfb41.jpg"
                  alt="Logo de Certification 3"
                  class="max-h-20 w-auto opacity-70 hover:opacity-100 transition duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-white">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <span
            class="text-sm font-semibold uppercase text-orange-600 tracking-wider flex items-center justify-center gap-2 mb-2"
          >
            <i class="fa-solid fa-star"></i> Testimonials
          </span>
          <h2 class="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-4 mt-2">
            Ce que disent nos clients
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Travailler avec cette équipe a été un plaisir absolu. Ils ont dépassé nos attentes.
            Hautement recommandé !
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            v-for="(review, index) in testimonials"
            :key="index"
            class="bg-gray-50 rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition duration-300"
          >
            <span class="text-4xl text-blue-600 block mb-4">
              <i class="fas fa-quote-left"></i>
            </span>
            <p class="text-gray-700 mb-6 italic">"{{ review.details }}"</p>

            <div class="flex items-center pt-4 border-t border-blue-100">
              <img
                :src="review.image"
                :alt="'Photo de ' + review.name"
                class="w-12 h-12 rounded-full object-cover mr-4 border-2 border-orange-500"
              />
              <div class="content">
                <h3 class="name font-bold text-gray-800">{{ review.name }}</h3>
                <div class="text-orange-500 text-sm">
                  <i
                    v-for="n in 5"
                    :key="n"
                    :class="['fas fa-star', { 'text-gray-300': n > review.rating }]"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Données des témoignages pour la simulation en grille
const testimonials = [
  {
    name: 'Ruth',
    details:
      "Service exceptionnel ! J'ai obtenu mon visa pour Dubaï en seulement 48 heures. L'équipe était très professionnelle et disponible pour répondre à toutes mes questions. Je recommande vivement Immigration de l'Estuaire.",
    image:
      'https://estuairevisa.com/asset/images/testimonial/image-42b28fb5-ea4c-411f-9182-558017eee634.jpg',
    rating: 5,
  },
  {
    name: 'Precieuse',
    details:
      "Service rapide et efficace. Mon visa pour l'Arabie Saoudite a été approuvé en moins de 3 jours. Communication claire et suivi régulier. Très satisfaite de mon expérience avec Immigration de l'Estuaire.",
    image:
      'https://estuairevisa.com/asset/images/testimonial/image-48dbb889-c1bf-478a-9749-a8ab2e9613f9.jpeg',
    rating: 5,
  },
  // On peut ajouter les autres si nécessaire
]
</script>
