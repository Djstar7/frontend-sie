<script setup lang="ts">
import ChatbotButton from '@/components/ChatbotButton.vue'
import FooterPartial from '@/components/FooterPartial.vue'
import NavbarPartial from '@/components/NavbarPartial.vue'
</script>

<template>
  <div>
    <NavbarPartial />
    <router-view class="mt-20" />
    <ChatbotButton />
    <FooterPartial />
  </div>
</template>
