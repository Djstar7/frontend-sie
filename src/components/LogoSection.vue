<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { OAuthProviderType } from '@/services/firebaseAuthService'
import Facebook from '@/assets/images/banners/facebook.png'
import Google from '@/assets/images/banners/google.png'
import Apple from '@/assets/images/banners/apple.png'
import Microsoft from '@/assets/images/banners/microsoft.jpg'

const userStore = useUserStore()
const oauthLoading = ref<OAuthProviderType | null>(null)

interface OAuthProvider {
  name: OAuthProviderType
  label: string
  src: string
}

const oauthProviders: OAuthProvider[] = [
  { name: 'google', label: 'Google', src: Google },
  { name: 'facebook', label: 'Facebook', src: Facebook },
  { name: 'apple', label: 'Apple', src: Apple },
  { name: 'microsoft', label: 'Microsoft', src: Microsoft },
]

const handleOAuthLogin = async (provider: OAuthProviderType) => {
  oauthLoading.value = provider
  try {
    await userStore.loginWithOAuth(provider)
  } finally {
    oauthLoading.value = null
  }
}
</script>

<template>
  <div class="mx-auto text-center">
    <div>
      <h2 class="text-2xl font-bold mb-8 mt-4 w-full">Autres options</h2>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center">
      <button
        v-for="provider in oauthProviders"
        :key="provider.name"
        @click="handleOAuthLogin(provider.name)"
        :disabled="oauthLoading !== null"
        class="flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative"
      >
        <img :src="provider.src" :alt="provider.label" class="h-16 w-16 object-contain" />
        <div
          v-if="oauthLoading === provider.name"
          class="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full"
        >
          <i class="fas fa-spinner fa-spin text-indigo-600 text-xl"></i>
        </div>
      </button>
    </div>
  </div>
</template>
