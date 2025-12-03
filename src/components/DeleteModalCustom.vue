<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-xl">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>

        <h2 class="text-2xl font-bold text-gray-800 mb-2">Confirmation de suppression</h2>

        <p class="text-gray-600 text-sm">Voulez-vous vraiment supprimer {{ message }} ?</p>
        <p class="text-gray-600 text-xs mb-4">
          <span class="text-black text-lg">Attention: </span> Tout message, paiement, document
          concernant {{ message }} sera supprimer
        </p>
        <p class="font-semibold text-red-600 mb-6">Cette action est irréversible.</p>

        <!-- POPUP CONFIRMATION INTERNE -->
        <div class="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-300">
          <p class="text-gray-700 mb-2">
            Pour confirmer la suppression, tapez
            <span class="text-bold text-blue-500">{{ confirmText }}</span>
          </p>
          <input
            v-model="confirmationInput"
            type="text"
            placeholder="Confirmez ici..."
            class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-400"
          />
        </div>

        <div class="flex justify-between gap-4">
          <button
            @click="emit('close')"
            class="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Annuler
          </button>

          <button
            :disabled="confirmationInput !== confirmText"
            @click="emit('confirm')"
            class="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  message: string
  confirmText: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()
const confirmationInput = ref('')
</script>
