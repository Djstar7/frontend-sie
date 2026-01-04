<script setup lang="ts">
import { ref } from 'vue'
import { contactService } from '@/services/contactService'
import { toastSuccess, toastError } from '@/utils/toastConfig'

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const isSubmitting = ref(false)
const submitted = ref(false)
const errors = ref<Record<string, string>>({})

const validateForm = (): boolean => {
  errors.value = {}

  if (!name.value.trim()) {
    errors.value.name = 'Le nom est obligatoire'
  }

  if (!email.value.trim()) {
    errors.value.email = "L'email est obligatoire"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = "L'email n'est pas valide"
  }

  if (!subject.value.trim()) {
    errors.value.subject = "L'objet est obligatoire"
  }

  if (!message.value.trim()) {
    errors.value.message = 'Le message est obligatoire'
  } else if (message.value.length < 10) {
    errors.value.message = 'Le message doit contenir au moins 10 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const response = await contactService.send({
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value,
    })

    toastSuccess(response.message)
    submitted.value = true

    // Reset form
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
    errors.value = {}

    setTimeout(() => (submitted.value = false), 5000)
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    toastError(error.response?.data?.message || "Une erreur est survenue lors de l'envoi du message")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="bg-white min-h-screen py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Titre -->
      <h1
        class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-orange-400 mb-3 sm:mb-4 animate-fadeIn"
      >
        Contactez-nous
      </h1>
      <p class="text-center text-gray-600 mb-6 sm:mb-8 md:mb-12 text-sm sm:text-base md:text-lg animate-fadeIn delay-200 px-2">
        Vous avez une question ou besoin d'assistance ? Remplissez le formulaire ci-dessous ou
        contactez-nous directement.
      </p>

      <!-- Container -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
        <!-- Formulaire -->
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 animate-slideLeft">
          <form @submit.prevent="submitForm" class="space-y-4 sm:space-y-5 md:space-y-6">
            <div>
              <label class="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Nom</label>
              <input
                v-model="name"
                type="text"
                placeholder="Votre nom"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                :class="errors.name ? 'border-red-500' : 'border-gray-300'"
              />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="Votre email"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                :class="errors.email ? 'border-red-500' : 'border-gray-300'"
              />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Objet</label>
              <input
                v-model="subject"
                type="text"
                placeholder="Objet du message"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                :class="errors.subject ? 'border-red-500' : 'border-gray-300'"
              />
              <p v-if="errors.subject" class="text-red-500 text-xs mt-1">{{ errors.subject }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Message</label>
              <textarea
                v-model="message"
                rows="4"
                placeholder="Votre message"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none text-sm sm:text-base"
                :class="errors.message ? 'border-red-500' : 'border-gray-300'"
              ></textarea>
              <p v-if="errors.message" class="text-red-500 text-xs mt-1">{{ errors.message }}</p>
            </div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-transform hover:scale-105 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer' }}
            </button>
            <p v-if="submitted" class="text-green-500 mt-2 text-center font-semibold text-sm sm:text-base">
              Votre message a été envoyé avec succès !
            </p>
          </form>
        </div>

        <!-- Infos contact + Map -->
        <div class="flex flex-col justify-center animate-slideRight space-y-3 sm:space-y-4 md:space-y-6">
          <div
            class="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4 hover:scale-105 transition-transform"
          >
            <i class="fas fa-envelope text-2xl sm:text-3xl text-purple-600"></i>
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-gray-800 text-sm sm:text-base">Email</h3>
              <p class="text-gray-600 text-sm sm:text-base truncate">support@sie.com</p>
            </div>
          </div>
          <div
            class="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4 hover:scale-105 transition-transform"
          >
            <i class="fas fa-phone-alt text-2xl sm:text-3xl text-blue-500"></i>
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-gray-800 text-sm sm:text-base">Téléphone</h3>
              <p class="text-gray-600 text-sm sm:text-base">+237 674 69 36 25</p>
            </div>
          </div>
          <div
            class="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4 hover:scale-105 transition-transform"
          >
            <i class="fas fa-map-marker-alt text-2xl sm:text-3xl text-orange-400 flex-shrink-0"></i>
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-gray-800 text-sm sm:text-base">Adresse</h3>
              <p class="text-gray-600 text-sm sm:text-base">Immeuble Belle Vue, PK9 Douala, Cameroun</p>
            </div>
          </div>

          <!-- Google Maps -->
          <div class="w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg mt-2 sm:mt-4">
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
