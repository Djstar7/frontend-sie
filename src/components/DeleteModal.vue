<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
    <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md relative shadow-xl">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-red-500 text-3xl sm:text-4xl mb-3 sm:mb-4"></i>

        <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">Confirmation de suppression</h2>

        <p class="text-gray-600 text-sm sm:text-base">
          Es-tu sûr de vouloir supprimer
          <span class="font-semibold">{{ val }}</span> ?
        </p>
        <p class="font-semibold text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Cette action est irréversible.</p>

        <!-- BUTTONS -->
        <div class="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
          <button
            @click="$emit('close')"
            class="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm sm:text-base"
          >
            Annuler
          </button>

          <button
            @click="$emit('confirm')"
            class="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  val: string
}>()
</script>
