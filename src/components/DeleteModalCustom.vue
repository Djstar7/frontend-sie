<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
    <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md relative shadow-xl max-h-[90vh] overflow-y-auto">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-3xl sm:text-4xl mb-3 sm:mb-4"></i>

        <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">Confirmation de suppression</h2>

        <p class="text-gray-600 text-xs sm:text-sm">Voulez-vous vraiment supprimer {{ message }} ?</p>
        <p class="text-gray-600 text-xs mb-3 sm:mb-4">
          <span class="text-black text-sm sm:text-lg font-semibold">Attention: </span> Tout message, paiement, document concernant {{ message }} sera supprimé
        </p>
        <p class="font-semibold text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">Cette action est irréversible.</p>

        <!-- POPUP CONFIRMATION INTERNE -->
        <div class="bg-gray-100 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 border border-gray-300">
          <p class="text-gray-700 mb-2 text-xs sm:text-sm">
            Pour confirmer, tapez
            <span class="font-bold text-blue-500">{{ confirmText }}</span>
          </p>
          <input
            v-model="confirmationInput"
            type="text"
            placeholder="Confirmez ici..."
            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring focus:ring-blue-400"
          />
        </div>

        <div class="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
          <button
            @click="emit('close')"
            class="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm sm:text-base"
          >
            Annuler
          </button>

          <button
            :disabled="confirmationInput !== confirmText"
            @click="emit('confirm')"
            class="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 text-sm sm:text-base"
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
