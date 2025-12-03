<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
  documents: string[]
}>()

const selectedDoc = ref('')
const file = ref<File | null>(null)
const error = ref('')

const validate = () => {
  error.value = ''

  if (!selectedDoc.value) {
    error.value = 'Veuillez sélectionner un type de document.'
    return false
  }
  if (!file.value) {
    error.value = 'Veuillez uploader un fichier.'
    return false
  }
  if (file.value.size > 5 * 1024 * 1024) {
    error.value = 'Le fichier ne doit pas dépasser 5 Mo.'
    return false
  }
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.value.type)) {
    error.value = 'Format non supporté (PDF, JPEG, PNG uniquement).'
    return false
  }
  return true
}

const handleSubmit = () => {
  if (!validate()) return

  // 🔗 Ici, l’envoi se fera via Axios vers Laravel (API /documents/upload)
  console.log('Document validé et prêt à l’envoi :', selectedDoc.value, file.value)
}
</script>

<template>
  <div
    class="w-full max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 border-t-4 border-blue-500"
  >
    <h2 class="text-xl font-semibold text-purple-600 mb-4">{{ title }}</h2>

    <!-- Sélecteur de document -->
    <label class="block mb-2 font-medium">Type de document</label>
    <select
      v-model="selectedDoc"
      class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 mb-4"
    >
      <option value="">-- Choisir --</option>
      <option v-for="doc in documents" :key="doc" :value="doc">{{ doc }}</option>
    </select>

    <!-- Upload fichier -->
    <label class="block mb-2 font-medium">Fichier</label>
    <input
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      @change="(e) => (file = (e.target as HTMLInputElement).files?.[0] || null)"
      class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 mb-4"
    />

    <!-- Erreurs -->
    <p v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</p>

    <!-- Bouton -->
    <button
      @click="handleSubmit"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
    >
      Valider le document
    </button>
  </div>
</template>
