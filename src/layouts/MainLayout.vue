<script setup lang="ts">
import { ref } from 'vue'
import ChatbotButton from '@/components/ChatbotButton.vue'
import ChatButton from '@/components/ChatButton.vue'
import FooterPartial from '@/components/FooterPartial.vue'
import NavbarPartial from '@/components/NavbarPartial.vue'

const isOpenChabot = ref(false)
</script>

<template>
  <div>
    <NavbarPartial />
    <router-view class="mt-20" />
    <ChatButton @toggle="isOpenChabot = !isOpenChabot" :isOpenChabotSection="isOpenChabot" />
    <ChatbotButton v-if="isOpenChabot" />
    <FooterPartial />
  </div>
</template>
