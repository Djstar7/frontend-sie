<script setup lang="ts">
import { ref } from 'vue'
import { useVisaTypeStore } from '@/stores/visaTypeStore' // Assure-toi d'avoir ce store
import { toastError } from '@/utils/toastConfig'
import type { VisaType } from '@/types/visa'
import { validateForm, required } from '@/utils/validateForm'

const visaTypeStore = useVisaTypeStore()

// Props et événement
const { visa } = defineProps<{ visa: VisaType }>()
const emit = defineEmits<{ (e: 'updated'): void }>()
const loading = ref(false)

// Stocke les erreurs de validation
const errors = ref<Record<string, string>>({})

// Validation du formulaire
const validate = () => {
  const { isValid, errors: validationErrors } = validateForm(visa, {
    name: [required('Le nom du type de visa est obligatoire')],
    description: [required('La description est obligatoire')],
  })

  errors.value = {}
  if (!isValid) {
    for (const key in validationErrors) {
      if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
        const errorMessages = validationErrors[key as keyof typeof validationErrors]
        if (errorMessages && errorMessages.length > 0) {
          errors.value[key] = errorMessages[0]
        }
      }
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) {
    toastError('Veuillez corriger les erreurs avant de soumettre')
    return
  }
  loading.value = true
  try {
    await visaTypeStore.editVisaType(visa.id!, visa!)
    emit('updated')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="bg-gray-50 py-12 w-full px-6">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <!-- Titre -->
      <h1 class="text-3xl font-bold text-orange-400 flex items-center gap-2 mb-6">
        <i class="fas fa-passport text-orange-400"></i>
        Modifier un type de visa
      </h1>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nom -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            v-model="visa.name!"
            type="text"
            :disabled="loading"
            :class="[
              'mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 border',
              errors.name ? 'border-red-600' : '',
            ]"
          />
          <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <!-- Description -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="visa.description!"
            rows="4"
            :disabled="loading"
            :class="[
              'mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-orange-400 focus:border-orange-400 border resize-none',
              errors.description ? 'border-red-600' : '',
            ]"
          ></textarea>
          <p v-if="errors.description" class="text-red-600 text-sm mt-1">
            {{ errors.description }}
          </p>
        </div>

        <!-- Erreur serveur -->
        <div v-if="visaTypeStore.error" class="text-red-600 text-md mt-2 col-span-full">
          {{ visaTypeStore.error }}
        </div>

        <!-- Bouton -->
        <div class="mt-4 col-span-full">
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-orange-400 hover:bg-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i class="fas fa-passport"></i>
            <span>{{ loading ? 'Mise à jour...' : 'Mettre à jour le type de visa' }}</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
