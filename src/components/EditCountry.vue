<script setup lang="ts">
import { useCountryStore } from '@/stores/countryStore'
import { toastError } from '@/utils/toastConfig'
import type { Country } from '@/types/country'
import { ref } from 'vue'
import { validateForm, required } from '@/utils/validateForm'

const countryStore = useCountryStore()

// Props et événement
const { country } = defineProps<{ country: Country }>()
const loading = ref(false)
const emit = defineEmits<{ (e: 'update'): void }>()

// Stocke les erreurs de validation
const errors = ref<Record<string, string>>({})

// Validation du formulaire
const validate = () => {
  const { isValid, errors: validationErrors } = validateForm(country, {
    name: [required('Le nom du pays est obligatoire')],
    iso_code: [required('Le code ISO est obligatoire')],
    phone_code: [required("L'indicatif téléphonique est obligatoire")],
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
    await countryStore.editCountry(country.id!, country!)
    emit('update')
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
      <h1 class="text-3xl font-bold text-indigo-700 flex items-center gap-2 mb-6">
        <i class="fas fa-flag text-orange-400"></i>
        Ajouter un pays
      </h1>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nom du pays -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom du pays</label>
          <input
            v-model="country.name!"
            type="text"
            :disabled="loading"
            :class="[
              'mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border',
              errors.name ? 'border-red-600' : '',
            ]"
          />
          <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <!-- Code ISO -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Code ISO</label>
          <input
            v-model="country.iso_code!"
            type="text"
            required
            :disabled="loading"
            :class="[
              'mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border',
              errors.iso_code ? 'border-red-600' : '',
            ]"
          />
          <p v-if="errors.iso_code" class="text-red-600 text-sm mt-1">{{ errors.iso_code }}</p>
        </div>

        <!-- Indicatif téléphonique -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Indicatif téléphonique</label>
          <input
            v-model="country.phone_code!"
            type="text"
            :disabled="loading"
            :class="[
              'mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border',
              errors.phone_code ? 'border-red-600' : '',
            ]"
          />
          <p v-if="errors.phone_code" class="text-red-600 text-sm mt-1">{{ errors.phone_code }}</p>
        </div>

        <!-- Erreur serveur -->
        <!-- <div v-if="error" class="text-red-600 text-md mt-2 col-span-full">
          {{ error }}
        </div> -->

        <!-- Bouton -->
        <div class="mt-4 col-span-full">
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-indigo-600 hover:bg-orange-400 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-flag"></i>
            <span>{{ loading ? 'Mise a jour...' : 'Modifier le pays' }}</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
