<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Foire aux questions</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Les questions les plus fréquentes sur nos services de visa
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Question 1 -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
          @click="toggleFaq(0)"
        >
          <div class="flex justify-between items-center cursor-pointer">
            <h3 class="text-xl font-semibold text-gray-800">
              Quels documents sont nécessaires pour une demande de visa ?
            </h3>
            <i
              class="fas fa-chevron-down text-gray-500 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === 0 }"
            ></i>
          </div>
          <div
            class="mt-4 text-gray-600 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{
              'max-h-0 opacity-0': openIndex !== 0,
              'max-h-96 opacity-100': openIndex === 0,
            }"
          >
            <p>
              Les documents requis varient selon le type de visa, le pays de destination, le status
              matrimonial et de l'age . Après votre inscription, notre système vous fournira une
              liste personnalisée en fonction de votre profil, le type de visa choisis et de votre
              destination spécifique.
            </p>
          </div>
        </div>

        <!-- Question 2 -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
          @click="toggleFaq(1)"
        >
          <div class="flex justify-between items-center cursor-pointer">
            <h3 class="text-xl font-semibold text-gray-800">
              Combien de temps prend le traitement de ma demande ?
            </h3>
            <i
              class="fas fa-chevron-down text-gray-500 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === 1 }"
            ></i>
          </div>
          <div
            class="mt-4 text-gray-600 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{
              'max-h-0 opacity-0': openIndex !== 1,
              'max-h-96 opacity-100': openIndex === 1,
            }"
          >
            <p>
              Le délai de traitement varie selon le type de visa et le pays concerné. En général, il
              faut compter entre 3 à 15 jours ouvrables. Vous recevrez des notifications en temps
              réel pour suivre l'avancement de votre demande.
            </p>
          </div>
        </div>

        <!-- Question 3 -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
          @click="toggleFaq(2)"
        >
          <div class="flex justify-between items-center cursor-pointer">
            <h3 class="text-xl font-semibold text-gray-800">
              Puis-je suivre l'avancement de ma demande ?
            </h3>
            <i
              class="fas fa-chevron-down text-gray-500 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === 2 }"
            ></i>
          </div>
          <div
            class="mt-4 text-gray-600 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{
              'max-h-0 opacity-0': openIndex !== 2,
              'max-h-96 opacity-100': openIndex === 2,
            }"
          >
            <p>
              Oui, notre plateforme vous permet de suivre en temps réel l'avancement de votre
              dossier. Vous recevrez également des notifications par e-mail et SMS à chaque étape
              importante de votre demande.
            </p>
          </div>
        </div>

        <!-- Question 4 -->
        <div
          class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
          @click="toggleFaq(3)"
        >
          <div class="flex justify-between items-center cursor-pointer">
            <h3 class="text-xl font-semibold text-gray-800">
              Quels modes de paiement acceptez-vous ?
            </h3>
            <i
              class="fas fa-chevron-down text-gray-500 transition-transform duration-300"
              :class="{ 'rotate-180': openIndex === 3 }"
            ></i>
          </div>
          <div
            class="mt-4 text-gray-600 overflow-hidden transition-all duration-500 ease-in-out"
            :class="{
              'max-h-0 opacity-0': openIndex !== 3,
              'max-h-96 opacity-100': openIndex === 3,
            }"
          >
            <p>
              Nous acceptons plusieurs modes de paiement sécurisés : MTN Mobile Money, Orange Money,
              Mastercard, Visa et PayPal. Notre système de paiement est entièrement sécurisé et
              conforme aux normes internationales.
            </p>
          </div>
        </div>
      </div>

      <!-- <div class="text-center mt-12">
        <button class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition duration-300">
          Voir plus de questions
        </button>
      </div> -->
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
