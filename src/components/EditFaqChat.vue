<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFaqChatStore } from '@/stores/faqChatStore'
import type { FaqChat } from '@/types/faqchat'
import { toastError } from '@/utils/toastConfig'
import { validateForm, required } from '@/utils/validateForm'

const props = defineProps<{ faq: FaqChat }>()
const emit = defineEmits<{ (e: 'updated'): void }>()

const faqChatStore = useFaqChatStore()

// Copie réactive du FAQ sélectionné
const formData = reactive<FaqChat>({
  id: props.faq.id,
  question: props.faq.question,
  answer: props.faq.answer,
  category: props.faq.category,
})

// État local
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Validation
const validate = () => {
  const { isValid, errors: validationErrors } = validateForm(formData, {
    question: [required('La question est obligatoire')],
    answer: [required('La réponse est obligatoire')],
    category: [required('La catégorie est obligatoire')],
  })
  errors.value = {}
  if (!isValid) {
    for (const [key, value] of Object.entries(validationErrors)) {
      if (Array.isArray(value) && value.length > 0) errors.value[key] = value[0]
    }
  }
  return isValid
}

// Soumission
const handleSubmit = async () => {
  if (!validate()) {
    toastError('Veuillez corriger les erreurs avant de soumettre')
    return
  }

  isSubmitting.value = true
  try {
    await faqChatStore.editFaqChat(formData.id!, formData)
    emit('updated')
  } catch (e) {
    console.error(e)
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
        Modifier une FAQ
      </h1>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Question</label>
          <input
            v-model="formData.question"
            type="text"
            :disabled="isSubmitting"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600 border"
            :class="{ 'border-red-600': errors.question }"
          />
          <p v-if="errors.question" class="text-red-600 text-sm mt-1">{{ errors.question }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Réponse</label>
          <textarea
            v-model="formData.answer"
            rows="4"
            :disabled="isSubmitting"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600 border resize-none"
            :class="{ 'border-red-600': errors.answer }"
          ></textarea>
          <p v-if="errors.answer" class="text-red-600 text-sm mt-1">{{ errors.answer }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Catégorie</label>
          <input
            v-model="formData.category"
            type="text"
            :disabled="isSubmitting"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600 border"
            :class="{ 'border-red-600': errors.category }"
          />
          <p v-if="errors.category" class="text-red-600 text-sm mt-1">{{ errors.category }}</p>
        </div>

        <div class="mt-4 col-span-full">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-purple-600 hover:bg-purple-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-question-circle"></i>
            <span>{{ isSubmitting ? 'Mise à jour...' : 'Mettre à jour la FAQ' }}</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
