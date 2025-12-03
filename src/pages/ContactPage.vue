<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const submitted = ref(false)

const submitForm = () => {
  console.log({
    name: name.value,
    email: email.value,
    subject: subject.value,
    message: message.value,
  })
  submitted.value = true
  name.value = ''
  email.value = ''
  subject.value = ''
  message.value = ''
  setTimeout(() => (submitted.value = false), 5000)
}
</script>

<template>
  <section class="bg-white min-h-screen py-16 px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Titre -->
      <h1
        class="text-4xl md:text-5xl font-extrabold text-center text-orange-400 mb-4 animate-fadeIn"
      >
        Contactez-nous
      </h1>
      <p class="text-center text-gray-600 mb-12 md:text-lg animate-fadeIn delay-200">
        Vous avez une question ou besoin d’assistance ? Remplissez le formulaire ci-dessous ou
        contactez-nous directement.
      </p>

      <!-- Container -->
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Formulaire -->
        <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-slideLeft">
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Nom</label>
              <input
                v-model="name"
                type="text"
                required
                placeholder="Votre nom"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="Votre email"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Objet</label>
              <input
                v-model="subject"
                type="text"
                required
                placeholder="Objet du message"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                v-model="message"
                rows="5"
                required
                placeholder="Votre message"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              class="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-transform hover:scale-105"
            >
              Envoyer
            </button>
            <p v-if="submitted" class="text-green-500 mt-2 text-center font-semibold">
              Votre message a été envoyé avec succès !
            </p>
          </form>
        </div>

        <!-- Infos contact + Map -->
        <div class="flex flex-col justify-center animate-slideRight space-y-6">
          <div
            class="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4 hover:scale-105 transition-transform"
          >
            <i class="fas fa-envelope text-3xl text-purple-600"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Email</h3>
              <p class="text-gray-600">support@sie.com</p>
            </div>
          </div>
          <div
            class="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4 hover:scale-105 transition-transform"
          >
            <i class="fas fa-phone-alt text-3xl text-blue-500"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Téléphone</h3>
              <p class="text-gray-600">+237 674 69 36 25</p>
            </div>
          </div>
          <div
            class="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4 hover:scale-105 transition-transform"
          >
            <i class="fas fa-map-marker-alt text-3xl text-orange-400"></i>
            <div>
              <h3 class="font-semibold text-gray-800">Adresse</h3>
              <p class="text-gray-600">Immeuble Belle Vue, PK9 Douala, Cameroun</p>
            </div>
          </div>

          <!-- Google Maps -->
          <div class="w-full h-80 md:h-96 rounded-3xl overflow-hidden shadow-lg mt-4">
            <iframe
              class="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.468098749079!2d9.718019815332694!3d4.045381943480751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x105d7b6480c0f123%3A0xabcdef1234567890!2sImmeuble%20Belle%20Vue%2C%20PK9%2C%20Douala!5e0!3m2!1sfr!2scm!4v1692530000000!5m2!1sfr!2scm"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fadeIn {
  animation: fadeIn 1s ease forwards;
}

@keyframes slideLeft {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slideLeft {
  animation: slideLeft 0.8s ease forwards;
}

@keyframes slideRight {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slideRight {
  animation: slideRight 0.8s ease forwards;
}
</style>
