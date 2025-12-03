<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toastError } from '@/utils/toastConfig'
import type { Country } from '@/types/country'
import type { Visa, VisaType } from '@/types/visa'
import { useVisaTypeStore } from '@/stores/visaTypeStore'
import { useCountryStore } from '@/stores/countryStore'
import { useVisaStore } from '@/stores/visaStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { vOnClickOutside } from '@vueuse/components'
import CreateProfilCustom from './CreateProfilCustom.vue'

// --- State ---
const step = ref(1)
const completedSteps = ref<number[]>([])

const countrys = ref<Country[]>([])
const visaTypes = ref<VisaType[]>([])
const selectedVisaType = ref<VisaType | null>(null)

// --- Stores & Utils ---
const visatypeStore = useVisaTypeStore()
const countryStore = useCountryStore()
const visaStore = useVisaStore()
const userStore = useUserStore()
const router = useRouter()
const { id } = userStore.user! as { id: string }

// --- Data Fetching ---
const loadData = async () => {
  try {
    localStorage.removeItem('visaRequestId')
    const resVisaType = await visatypeStore.getVisaTypes()
    const resCountry = await countryStore.getCountrys()
    // Exclure 'Cameroun' (pour la destination)
    countrys.value = resCountry?.data.filter((c) => c.name !== 'Cameroun') || []
    visaTypes.value = resVisaType?.data || []
  } catch (error) {
    console.error(error)
  }
}
onMounted(loadData)

// --- Step Management ---
const isCompleted = (n: number) => completedSteps.value.includes(n)
const nextStep = () => {
  if (step.value === 1 && !isCompleted(1)) {
    // La complétion de l'étape 1 est gérée par le composant enfant (@created)
    // On l'ajoute ici au cas où l'utilisateur revient en arrière et avance.
    completedSteps.value.push(1)
  } else if (!isCompleted(step.value)) {
    completedSteps.value.push(step.value)
  }
  step.value++
}
const prevStep = () => step.value--
const selectVisa = (visa: VisaType) => {
  selectedVisaType.value = visa
  nextStep()
}

// --- Country Selection Logic ---
const isCountryOpen = ref(false)
const searchCountry = ref('')
const selectedCountry = ref<Country | null>(null)

const filteredCountries = computed(() => {
  if (!searchCountry.value) return countrys.value
  return countrys.value.filter((c) =>
    c.name.toLowerCase().includes(searchCountry.value.toLowerCase()),
  )
})

function selectCountry(country: Country) {
  selectedCountry.value = country
  searchCountry.value = country.name
  isCountryOpen.value = false
}
function closeCountryDropdown() {
  isCountryOpen.value = false
  if (selectedCountry.value) searchCountry.value = selectedCountry.value.name
}

// --- Submission ---
const submit = async () => {
  if (!selectedCountry.value || !selectedVisaType.value)
    return toastError('Veuillez sélectionner un pays et un type de visa')

  if (!isCompleted(step.value)) completedSteps.value.push(step.value)

  const payload: Visa = {
    user_id: id,
    country_dest_name: selectedCountry.value.name,
    visa_type_name: selectedVisaType.value.name,
  }

  try {
    await visaStore.createStoreVisa(payload)
    router.push({ name: 'custom.visarequest.create.view', params: { visaRequestId: id } })
  } catch (error) {
    toastError('Échec de la soumission. Veuillez réessayer.')
    console.error(error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-1 px-4 md:px-8 lg:px-16">
    <div class="max-w-5xl mx-auto mb-8 text-center">
      <h1 class="text-4xl font-extrabold text-blue-600 tracking-tight">Nouvelle Demande de Visa</h1>
      <p class="text-lg text-gray-500 mt-2">
        Suivez ces 3 étapes simples pour démarrer votre procédure.
      </p>
    </div>

    <div class="relative max-w-3xl mx-auto mb-20">
      <div
        class="absolute top-1/3 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2"
      ></div>
      <div
        class="absolute top-1/4 left-0 h-1 bg-blue-600 rounded-full -translate-y-1/2 transition-all duration-700 ease-out"
        :style="{ width: `${((step - 1) / 2) * 100}%` }"
      ></div>

      <div class="flex justify-between">
        <div
          v-for="n in 3"
          :key="n"
          class="relative z-10 w-16 h-16 flex flex-col items-center justify-center rounded-full font-bold shadow-xl transition-all duration-500 ease-in-out bg-white/95 backdrop-blur-sm"
          :class="{
            // Completed
            'border-4 border-blue-600 text-blue-600 shadow-blue-300/60': isCompleted(n),
            // Current
            'border-4 border-blue-400 text-gray-800 bg-blue-50 shadow-indigo-200/50 scale-105':
              step === n && !isCompleted(n),
            // Default
            'border-4 border-gray-300 text-gray-400': !isCompleted(n) && step !== n,
          }"
        >
          <i v-if="isCompleted(n)" class="fas fa-check text-xl"></i>
          <span v-else class="text-2xl">{{ n }}</span>

          <span
            class="absolute top-[calc(100%+10px)] text-xs font-semibold whitespace-nowrap"
            :class="{
              'text-blue-600': step === n,
              'text-gray-500': step !== n,
            }"
          >
            {{ n === 1 ? 'Profil' : n === 2 ? 'Type de Visa' : 'Destination' }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100"
    >
      <transition name="fade" mode="out-in">
        <section v-if="step === 1" key="step1">
          <h2 class="text-3xl font-bold text-gray-700 mb-6 flex items-center justify-center">
            <i class="fas fa-user-circle text-blue-600 mr-3 text-2xl"></i>
            Création ou Mise à Jour du Profil
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto mb-10 text-center">
            Veuillez compléter ou vérifier vos informations personnelles.
          </p>
          <CreateProfilCustom @created="nextStep" />
          <router-link
            :to="{
              name:
                userStore.role === 'agent'
                  ? 'agent.users.show.visarequest'
                  : 'custom.visarequest.get',
            }"
            class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mt-6 pt-4 border-t border-gray-200 w-fit"
          >
            <i class="fas fa-arrow-left text-xl"></i>
            <span class="font-medium">Retour à la liste des demandes</span>
          </router-link>
        </section>
      </transition>

      <transition name="fade" mode="out-in">
        <section v-if="step === 2" key="step2" class="text-center">
          <h2 class="text-3xl font-bold text-gray-700 mb-10">
            <i class="fas fa-passport text-blue-600 mr-2 text-2xl"></i>
            Sélectionnez votre Type de VISA
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="visa in visaTypes"
              :key="visa.id"
              @click="selectVisa(visa)"
              class="cursor-pointer p-6 rounded-xl transition transform hover:-translate-y-1 hover:shadow-xl shadow-lg bg-white border border-gray-200 hover:border-blue-500/70"
            >
              <h3 class="font-bold text-xl text-blue-600 mb-2">{{ visa.name }}</h3>
              <p class="text-gray-500 text-sm line-clamp-3">{{ visa.description }}</p>
              <button
                class="mt-4 text-sm font-semibold text-blue-500 hover:text-blue-700 transition"
              >
                Choisir <i class="fas fa-arrow-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>

          <button
            @click="prevStep"
            class="mt-12 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center mx-auto shadow-md font-medium"
          >
            <i class="fas fa-arrow-left mr-2"></i> Étape précédente
          </button>
        </section>
      </transition>

      <transition name="fade" mode="out-in">
        <section v-if="step === 3" key="step3" class="text-center">
          <h2 class="text-3xl font-bold text-gray-700 mb-10">
            <i class="fas fa-globe text-blue-600 mr-2 text-2xl"></i>
            Où souhaitez-vous aller ?
          </h2>

          <div class="relative w-full max-w-lg mx-auto" v-on-click-outside="closeCountryDropdown">
            <input
              type="text"
              v-model="searchCountry"
              @focus="isCountryOpen = true"
              placeholder="Rechercher un pays de destination..."
              class="w-full border-2 border-gray-300 rounded-xl pl-12 pr-6 py-3.5 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-500 font-medium"
            />
            <i
              class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>

            <ul
              v-if="isCountryOpen"
              class="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-gray-100 transition-opacity duration-300"
            >
              <li
                v-if="filteredCountries.length === 0"
                class="px-4 py-3 text-gray-500 text-sm italic"
              >
                Aucun pays trouvé
              </li>
              <li
                v-for="country in filteredCountries"
                :key="country.id"
                @click="selectCountry(country)"
                class="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 text-sm transition font-medium flex items-center justify-between"
              >
                {{ country.name }}
                <i
                  v-if="selectedCountry?.id === country.id"
                  class="fas fa-check text-blue-500 ml-2"
                ></i>
              </li>
            </ul>
          </div>
          <div v-if="selectedCountry" class="mt-4 text-md font-semibold text-gray-800">
            Destination sélectionnée : <span class="text-blue-600">{{ selectedCountry.name }}</span>
          </div>

          <div class="flex justify-between max-w-lg mx-auto mt-12 pt-6 border-t border-gray-100">
            <button
              @click="prevStep"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl text-base hover:bg-gray-300 transition shadow-md font-medium flex items-center"
            >
              <i class="fas fa-arrow-left mr-2"></i> Retour
            </button>

            <button
              @click="submit"
              :disabled="!selectedCountry"
              class="px-8 py-3 bg-blue-600 text-white rounded-xl text-base hover:bg-blue-700 transition flex items-center shadow-lg shadow-blue-400/50 font-bold disabled:opacity-60 disabled:shadow-none"
            >
              <i class="fas fa-check-circle mr-2"></i> Lancer la Demande
            </button>
          </div>
        </section>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Transition pour le changement d'étape */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
