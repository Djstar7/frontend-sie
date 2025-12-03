<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop with higher opacity -->
    <div class="fixed inset-0 bg-black bg-opacity-70" @click="closeModal"></div>

    <!-- Modal with higher z-index -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-50">
      <!-- Header with icon and type -->
      <div class="flex items-center p-6 rounded-t-lg bg-yellow-100">
        <div
          class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500"
        >
          <font-awesome-icon icon="exclamation-triangle" class="text-white text-xl" />
        </div>
        <h3 class="ml-4 text-xl font-semibold text-yellow-800">Confirmation</h3>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p class="text-gray-700 text-base">
          {{ message }}
        </p>
      </div>

      <!-- Footer with action buttons -->
      <div class="flex justify-end p-6 pt-0 space-x-3">
        <button
          @click="closeModal"
          class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Annuler
        </button>
        <button
          @click="confirmAction"
          class="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {{ confirmButtonText }}
        </button>
      </div>

      <!-- Close button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <font-awesome-icon icon="times" class="text-xl" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  isOpen: boolean
  message: string
  confirmButtonText?: string
}

withDefaults(defineProps<Props>(), {
  confirmButtonText: 'Confirmer',
})

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const confirmAction = () => {
  emit('confirm')
}

const closeModal = () => {
  emit('close')
}
</script>
