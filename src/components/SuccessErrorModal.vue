<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop with higher opacity -->
    <div class="fixed inset-0 bg-black bg-opacity-70" @click="closeModal"></div>

    <!-- Modal with higher z-index -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-50">
      <!-- Header with icon and type -->
      <div
        :class="[
          'flex items-center p-6 rounded-t-lg',
          type === 'success' ? 'bg-green-100' : 'bg-red-100',
        ]"
      >
        <div
          :class="[
            'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
            type === 'success' ? 'bg-green-500' : 'bg-red-500',
          ]"
        >
          <font-awesome-icon
            :icon="type === 'success' ? 'check' : 'exclamation-triangle'"
            class="text-white text-xl"
          />
        </div>
        <h3
          :class="[
            'ml-4 text-xl font-semibold',
            type === 'success' ? 'text-green-800' : 'text-red-800',
          ]"
        >
          {{ type === 'success' ? 'Succès' : 'Erreur' }}
        </h3>
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
          v-if="showCancel"
          @click="closeModal"
          class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Annuler
        </button>
        <button
          @click="confirmAction"
          :class="[
            'px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
            type === 'success'
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          ]"
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
  type: 'success' | 'error'
  message: string
  showCancel?: boolean
  confirmButtonText?: string
}

withDefaults(defineProps<Props>(), {
  showCancel: false,
  confirmButtonText: 'OK',
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
