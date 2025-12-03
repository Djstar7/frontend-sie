<template>
  <button
    @click="$emit('toggle')"
    class="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
  >
    <i class="fas fa-comments fa-2x"></i>
  </button>
</template>
