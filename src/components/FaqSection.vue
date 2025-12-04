<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="text-center mb-16">
        <span class="text-sm font-semibold uppercase text-orange-600 tracking-wider"
          >Questions & Réponses</span
        >
        <h2 class="text-3xl sm:text-5xl font-extrabold text-blue-900 mb-4 mt-2">
          Foire aux Questions
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Les questions les plus fréquentes sur nos services de visa, clarifiées pour vous.
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-4">
        <div
          class="bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 group"
        >
          <div
            class="flex justify-between items-center cursor-pointer p-5 sm:p-6 bg-white hover:bg-blue-50/50"
            @click="toggleFaq(0)"
          >
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors"
            >
              Quels documents sont nécessaires pour une demande de visa ?
            </h3>
            <i
              class="fas fa-chevron-down text-blue-600 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === 0 }"
            ></i>
          </div>
          <div
            class="px-5 sm:px-6 pb-5 text-gray-700 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{
              'max-h-0 opacity-0': openIndex !== 0,
              'max-h-96 opacity-100 pt-4': openIndex === 0,
            }"
          >
            <p>
              Les documents requis varient selon le type de visa, le pays de destination, le status
              matrimonial et l'âge. Après votre inscription, **notre système vous fournira une liste
              personnalisée** en fonction de votre profil et de votre destination spécifique.
            </p>
          </div>
        </div>

        <div
          class="bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 group"
        >
          <div
            class="flex justify-between items-center cursor-pointer p-5 sm:p-6 bg-white hover:bg-blue-50/50"
            @click="toggleFaq(1)"
          >
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors"
            >
              Combien de temps prend le traitement de ma demande ?
            </h3>
            <i
              class="fas fa-chevron-down text-blue-600 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === 1 }"
            ></i>
          </div>
          <div
            class="px-5 sm:px-6 pb-5 text-gray-700 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{
              'max-h-0 opacity-0': openIndex !== 1,
              'max-h-96 opacity-100 pt-4': openIndex === 1,
            }"
          >
            <p>
              Le délai de traitement varie selon le type de visa et le pays concerné. En général, il
              faut compter entre **3 à 15 jours ouvrables** après soumission complète. Vous recevrez
              des notifications en temps réel pour suivre l'avancement.
            </p>
          </div>
        </div>

        <div
          class="bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 group"
        >
          <div
            class="flex justify-between items-center cursor-pointer p-5 sm:p-6 bg-white hover:bg-blue-50/50"
            @click="toggleFaq(2)"
          >
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors"
            >
              Puis-je suivre l'avancement de ma demande ?
            </h3>
            <i
              class="fas fa-chevron-down text-blue-600 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === 2 }"
            ></i>
          </div>
          <div
            class="px-5 sm:px-6 pb-5 text-gray-700 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{
              'max-h-0 opacity-0': openIndex !== 2,
              'max-h-96 opacity-100 pt-4': openIndex === 2,
            }"
          >
            <p>
              **Oui, absolument**. Notre plateforme vous permet de suivre en temps réel l'avancement
              de votre dossier. Vous recevrez également des notifications par e-mail et/ou SMS à
              chaque étape importante.
            </p>
          </div>
        </div>

        <div
          class="bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 group"
        >
          <div
            class="flex justify-between items-center cursor-pointer p-5 sm:p-6 bg-white hover:bg-blue-50/50"
            @click="toggleFaq(3)"
          >
            <h3
              class="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors"
            >
              Quels modes de paiement acceptez-vous ?
            </h3>
            <i
              class="fas fa-chevron-down text-blue-600 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === 3 }"
            ></i>
          </div>
          <div
            class="px-5 sm:px-6 pb-5 text-gray-700 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{
              'max-h-0 opacity-0': openIndex !== 3,
              'max-h-96 opacity-100 pt-4': openIndex === 3,
            }"
          >
            <p>
              Nous acceptons plusieurs modes de paiement sécurisés : **MTN Mobile Money, Orange
              Money, Mastercard, Visa et PayPal**. Notre système de paiement est entièrement
              sécurisé et conforme aux normes internationales.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref<number | null>(null)

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>
