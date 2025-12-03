<script setup lang="ts">
import { ref } from 'vue'
import { useFaqChatStore } from '@/stores/faqChatStore'
import { toastError } from '@/utils/toastConfig'
import type { FaqChat } from '@/types/faqchat'

// Import du validateur externe
import { validateForm, required, minLength, maxLength } from '@/utils/validateForm'

const faqChatStore = useFaqChatStore()

const form = ref<FaqChat>({
  question: '',
  answer: '',
  category: '',
})

const errors = ref<Partial<Record<keyof FaqChat, string[]>>>({})
const isSubmitting = ref(false)

const emit = defineEmits<{ (e: 'created'): void }>()

const handleSubmit = async () => {
  // Validation via le validateur externe
  const { isValid, errors: validationErrors } = validateForm(form.value, {
    question: [
      required('La question est obligatoire.'),
      minLength(5, 'La question doit contenir au moins 5 caractères.'),
    ],
    answer: [
      required('La réponse est obligatoire.'),
      minLength(10, 'La réponse doit contenir au moins 10 caractères.'),
    ],
    category: [
      required('La catégorie est obligatoire.'),
      maxLength(50, 'La catégorie ne doit pas dépasser 50 caractères.'),
    ],
  })

  errors.value = validationErrors

  if (!isValid) {
    toastError('Veuillez corriger les erreurs du formulaire.')
    return
  }

  isSubmitting.value = true
  try {
    await faqChatStore.createFaqChat(form.value)
    emit('created')

    // Réinitialisation
    form.value = { question: '', answer: '', category: '' }
    errors.value = {}
  } catch (e) {
    console.error('Erreur lors de la création du FaqChat :', e)
    toastError("Une erreur s'est produite lors de la création de la FAQ.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="bg-gray-50 py-12 w-full px-6">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h1 class="text-3xl font-bold text-purple-600 flex items-center gap-2 mb-6">
        <i class="fas fa-question-circle text-orange-400"></i>
        Ajouter une FAQ
      </h1>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Question -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Question</label>
          <input
            v-model="form.question"
            type="text"
            :disabled="isSubmitting"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600 border"
          />
          <p v-if="errors.question" class="text-red-600 text-sm mt-1">{{ errors.question[0] }}</p>
        </div>

        <!-- Réponse -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Réponse</label>
          <textarea
            v-model="form.answer"
            rows="4"
            :disabled="isSubmitting"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600 border resize-none"
          ></textarea>
          <p v-if="errors.answer" class="text-red-600 text-sm mt-1">{{ errors.answer[0] }}</p>
        </div>

        <!-- Catégorie -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Catégorie</label>
          <input
            v-model="form.category"
            type="text"
            :disabled="isSubmitting"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600 border"
          />
          <p v-if="errors.category" class="text-red-600 text-sm mt-1">{{ errors.category[0] }}</p>
        </div>

        <!-- Erreur générale du store -->
        <!-- <div v-if="faqChatStore.error" class="text-red-600 text-md mt-2 col-span-full">
          {{ faqChatStore.error }}
        </div> -->

        <!-- Bouton -->
        <div class="mt-4 col-span-full">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-purple-600 hover:bg-purple-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-question-circle"></i>
            <span>{{ isSubmitting ? 'Création...' : 'Créer la FAQ' }}</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
