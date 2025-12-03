<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCountryStore } from '@/stores/countryStore'
import type { Country } from '@/types/country'

// Import du validateur externe
import { validateForm, required, minLength, matchesPattern } from '@/utils/validateForm'

const countryStore = useCountryStore()

// Données du formulaire
const form = reactive<Country>({
  name: '',
  iso_code: '',
  phone_code: '',
})

const loading = ref(false)
const errors = ref<Partial<Record<keyof Country, string[]>>>({})
const emit = defineEmits<{ (e: 'create'): void }>()

/**
 * Soumission du formulaire avec validation externe
 */
const handleSubmit = async () => {
  const { isValid, errors: validationErrors } = validateForm(form, {
    name: [required('Country name is required'), minLength(3)],
    iso_code: [
      required('ISO code is required'),
      matchesPattern(/^[A-Z]{2,3}$/, 'Must be 2–3 uppercase letters'),
    ],
    phone_code: [
      required('Phone code is required'),
      matchesPattern(/^\+\d{1,4}$/, 'Must start with + and contain digits only'),
    ],
  })

  errors.value = validationErrors

  if (!isValid) return

  loading.value = true
  try {
    await countryStore.createCountry(form)
    emit('create')

    form.name = ''
    form.iso_code = ''
    form.phone_code = ''
    errors.value = {}
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
      <h1 class="text-3xl font-bold text-indigo-700 flex items-center gap-2 mb-6">
        <i class="fas fa-flag text-orange-400"></i>
        Ajouter un Nouveau Pays
      </h1>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Country Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom </label>
          <input
            v-model="form.name"
            type="text"
            :disabled="loading"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
          <p v-for="(err, i) in errors.name" :key="i" class="text-red-600 text-sm mt-1">
            {{ err }}
          </p>
        </div>

        <!-- ISO Code -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Code ISO</label>
          <input
            v-model="form.iso_code"
            type="text"
            :disabled="loading"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
          <p v-for="(err, i) in errors.iso_code" :key="i" class="text-red-600 text-sm mt-1">
            {{ err }}
          </p>
        </div>

        <!-- Phone Code -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Indicatif téléphonique</label>
          <input
            v-model="form.phone_code"
            type="text"
            :disabled="loading"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
          <p v-for="(err, i) in errors.phone_code" :key="i" class="text-red-600 text-sm mt-1">
            {{ err }}
          </p>
        </div>

        <!-- Bouton -->
        <div class="mt-4 col-span-full">
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-indigo-600 hover:bg-orange-400 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-flag"></i>
            <span>{{ loading ? 'Création...' : 'Créer le pays' }}</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
