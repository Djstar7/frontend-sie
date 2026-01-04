// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

// ======================
// Filtrer les logs Pinia 🍍
if (import.meta.env.DEV) {
  const originalLog = console.log
  console.log = (...args: string[]) => {
    if (!args.some((arg) => typeof arg === 'string' && arg.includes('🍍'))) {
      originalLog(...args)
    }
  }
}
// ======================

app.use(pinia)
app.use(router)

app.use(Vue3Toastify, {
  autoClose: 5000,
  pauseOnHover: true,
  hideProgressBar: false,
  draggable: true,
  position: 'top-center',
})

const toggleBackground = () => {
  const root = document.documentElement
  const currentBg = getComputedStyle(root).getPropertyValue('--color-bg').trim()

  if (currentBg === '#ffffff') {
    root.style.setProperty('--color-bg', '#000000') // noir
  } else {
    root.style.setProperty('--color-bg', '#ffffff') // blanc
  }
}
toggleBackground()

app.mount('#app')
