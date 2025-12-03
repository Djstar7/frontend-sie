<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCountryStore } from '@/stores/countryStore'
import { useVisaTypeStore } from '@/stores/visaTypeStore'
import {  useRoute, useRouter } from 'vue-router'
import type { VisaFetch, VisaType } from '@/types/visa'
import { vOnClickOutside } from '@vueuse/components'
import { documentRequest } from '@/utils/dataAdmin'
import { validateForm, required } from '@/utils/validateForm'
import { useVisaEligibilityStore } from '@/stores/useVisaEligibilityStore'
import type { VisaResourceType } from '@/types/visa'
import type { Country } from '@/types/country'
import { toastSuccess } from '@/utils/toastConfig'

const route = useRoute()
const router = useRouter()
const countryStore = useCountryStore()
const visaTypeStore = useVisaTypeStore()
const visaEligibilitiesStore = useVisaEligibilityStore()
const visaId = route.params.id as string | undefined

// isEditMode est vrai si visaId est présent (mode Modification)
const isEditMode = computed(() => !!visaId)

const form = ref<VisaFetch>({
  country_name: '',
  visa_type_name: '',
  price_base: null,
  price_per_child: null,
  processing_duration_min: null,
  processing_duration_max: null,
  status_mat: 'single',
  min_age: 18,
  max_age: 50,
  documents: [] as string[],
})

const countrys = ref<Country[]>([])
const visaTypes = ref<VisaType[]>([])
const errors = ref<Record<string, string[]>>({})

const loadVisaData = async () => {
  if (!isEditMode.value) return

  try {
    const res = await visaEligibilitiesStore.getEligibilityDetails(visaId!)
    const visa = res.data as VisaResourceType & { min_age: number; max_age: number }
    if (!visa) {
      console.error('La réponse du serveur est vide')
      return
    }
    if (!visa) {
      console.error('La réponse du serveur est vide')
      return
    }

    form.value = {
      country_name: visa.country ?? '',
      visa_type_name: visa.visa_type ?? '',
      price_base: parseFloat(visa.price_base.toString()),
      price_per_child: visa.price_per_child ? parseFloat(visa.price_per_child.toString()) : null,
      processing_duration_min: visa.processing_duration_min,
      processing_duration_max: visa.processing_duration_max,
      status_mat: visa.status_mat,
      min_age: visa.min_age,
      max_age: visa.max_age,
      documents: visa.documents || [],
    }

    searchCountry.value = form.value.country_name
    searchVisaType.value = form.value.visa_type_name
  } catch (e) {
    console.error('Erreur lors du chargement du visa :', e)
  }
}
onMounted(async () => {
  try {
    const [resCountrys, resVisaType] = await Promise.all([
      countryStore.getCountrys(),
      visaTypeStore.getVisaTypes(),
    ])
    countrys.value = resCountrys?.data || []
    visaTypes.value = resVisaType?.data || []

    await loadVisaData()
  } catch (e) {
    console.error(e)
  }
})

const isCountryOpen = ref(false)
const searchCountry = ref('')
const selectedCountry = ref<Country | null>(null)

const filteredCountries = computed(() => {
  if (!searchCountry.value) return countrys.value
  return countrys.value.filter((c: Country) =>
    c.name.toLowerCase().includes(searchCountry.value.toLowerCase()),
  )
})

function selectCountry(country: Country) {
  selectedCountry.value = country
  searchCountry.value = country.name
  form.value.country_name = country.name
  isCountryOpen.value = false
}

function closeCountryDropdown() {
  isCountryOpen.value = false
  if (selectedCountry.value) {
    searchCountry.value = selectedCountry.value.name
  } else {
    searchCountry.value = form.value.country_name
  }
}

const isVisaOpen = ref(false)
const searchVisaType = ref('')
const selectedVisaType = ref<VisaType | null>(null)

const filteredVisaTypes = computed(() => {
  if (!searchVisaType.value) return visaTypes.value
  return visaTypes.value.filter((v) =>
    v.name.toLowerCase().includes(searchVisaType.value.toLowerCase()),
  )
})

function selectVisaType(type: VisaType) {
  selectedVisaType.value = type
  searchVisaType.value = type.name
  form.value.visa_type_name = type.name
  isVisaOpen.value = false
}

function closeVisaDropdown() {
  isVisaOpen.value = false
  if (selectedVisaType.value) {
    searchVisaType.value = selectedVisaType.value.name
  } else {
    searchVisaType.value = form.value.visa_type_name
  }
}

const allDocuments: Record<string, string[]> = documentRequest

// La logique des documents disponibles fonctionne maintenant correctement en mode Edit
const availableDocuments = computed(() => {
  const result: Record<string, string[]> = {}
  for (const category in allDocuments) {
    // Les documents déjà sélectionnés (form.value.documents) ne sont pas dans les disponibles
    result[category] = allDocuments[category].filter((doc) => !form.value.documents.includes(doc))
  }
  return result
})

const addDocument = (doc: string) => {
  if (!form.value.documents.includes(doc)) form.value.documents.push(doc)
}

const removeDocument = (index: number) => {
  form.value.documents.splice(index, 1)
}

const rules = {
  country_name: [required('Le pays est obligatoire')],
  visa_type_name: [required('Le type de visa est obligatoire')],
  price_base: [required('Le prix de base est obligatoire')],
  status_mat: [required('Le statut matrimonial est obligatoire')],
  min_age: [required('Âge minimum requis')],
  max_age: [required('Âge maximum requis')],
}

const submitForm = async () => {
  const { isValid, errors: validationErrors } = validateForm(form.value, rules)
  errors.value = validationErrors

  if (!isValid) return

  try {
    let res
    if (isEditMode.value) {
      res = await visaEligibilitiesStore.updateEligibility(visaId!, form.value)
    } else {
      res = await visaEligibilitiesStore.createEligibility(form.value)
    }
    router.push({ name: 'admin.visa' })
    toastSuccess(res.message)
  } catch (e) {
    console.error(`Erreur lors de ${isEditMode.value ? 'la modification' : 'la création'} du visa :`, e)
  }
}
</script>

<template>
  <div class="w-full mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg">
    <h2 class="text-3xl md:text-4xl font-bold text-orange-400 text-center mb-8">
      {{ isEditMode ? 'Modifier la liste des documents' : 'Créer la liste des documents pour une demande' }}
    </h2>

    <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="relative w-full" v-on-click-outside="closeCountryDropdown">
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Nom du pays <span class="text-orange-400">*</span>
        </label>
        <input
          type="text"
          class="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          v-model="searchCountry"
          @focus="isCountryOpen = true"
          :placeholder="'Rechercher ou sélectionner un pays...'"
        />
        <span class="absolute top-1/2 right-3 transform translate-y-1/2 pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <ul v-if="isCountryOpen" class="absolute top-full left-0 right-0 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-0.5 z-50 shadow-md">
          <li v-if="filteredCountries.length === 0" class="p-2 text-gray-400 text-xs">Aucun résultat</li>
          <li
            v-for="country in filteredCountries"
            :key="country.id"
            @click="selectCountry(country)"
            class="p-2 cursor-pointer hover:bg-gray-100 text-sm"
          >
            {{ country.name }}
          </li>
        </ul>
        <p v-if="errors.country_name" class="text-red-500 text-xs mt-1">
          {{ errors.country_name[0] }}
        </p>
      </div>

      <div class="relative w-full" v-on-click-outside="closeVisaDropdown">
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Type de visa <span class="text-orange-400">*</span>
        </label>
        <input
          type="text"
          class="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          v-model="searchVisaType"
          @focus="isVisaOpen = true"
          :placeholder="'Rechercher ou sélectionner un type de visa...'"
        />
        <span class="absolute top-1/2 right-3 transform translate-y-1/2 pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <ul v-if="isVisaOpen" class="absolute top-full left-0 right-0 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-0.5 z-50 shadow-md">
          <li v-if="filteredVisaTypes.length === 0" class="p-2 text-gray-400 text-xs">Aucun résultat</li>
          <li
            v-for="type in filteredVisaTypes"
            :key="type.id"
            @click="selectVisaType(type)"
            class="p-2 cursor-pointer hover:bg-gray-100 text-sm"
          >
            {{ type.name }}
          </li>
        </ul>
        <p v-if="errors.visa_type_name" class="text-red-500 text-xs mt-1">
          {{ errors.visa_type_name[0] }}
        </p>
      </div>

      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Prix de base <span class="text-orange-400">*</span>
        </label>
        <input
          v-model="form.price_base"
          type="number"
          placeholder="Ex: 150"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-400 text-sm"
        />
        <p v-if="errors.price_base" class="text-red-500 text-xs mt-1">{{ errors.price_base[0] }}</p>
      </div>

      <div v-if="form.status_mat !== 'single'">
        <label class="block text-lg text-gray-700 font-bold mb-2">Prix par enfant</label>
        <input
          v-model="form.price_per_child"
          type="number"
          placeholder="Ex: 50"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-400 text-sm"
        />
      </div>

      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Durée traitement min (jours) <span class="text-orange-400">*</span>
        </label>
        <input
          v-model="form.processing_duration_min"
          type="number"
          placeholder="Ex: 7"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-400 text-sm"
        />
      </div>
      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Durée traitement max (jours) <span class="text-orange-400">*</span>
        </label>
        <input
          v-model="form.processing_duration_max"
          type="number"
          placeholder="Ex: 15"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-400 text-sm"
        />
      </div>

      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Statut matrimonial <span class="text-orange-400">*</span>
        </label>
        <select
          v-model="form.status_mat"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-400 text-sm"
        >
          <option value="">-- Sélectionner --</option>
          <option value="single">Célibataire</option>
          <option value="married">Marié</option>
          <option value="divorced">Divorcé</option>
          <option value="widowed">Veuf/Veuve</option>
        </select>
        <p v-if="errors.status_mat" class="text-red-500 text-xs mt-1">{{ errors.status_mat[0] }}</p>
      </div>

      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Âge minimum <span class="text-orange-400">*</span>
        </label>
        <input
          v-model.number="form.min_age"
          type="number"
          min="0"
          max="100"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-400 text-sm"
        />
        <p v-if="errors.min_age" class="text-red-500 text-xs mt-1">{{ errors.min_age[0] }}</p>
      </div>

      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Âge maximum <span class="text-orange-400">*</span>
        </label>
        <input
          v-model.number="form.max_age"
          type="number"
          min="0"
          max="100"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-400 text-sm"
        />
        <p v-if="errors.max_age" class="text-red-500 text-xs mt-1">{{ errors.max_age[0] }}</p>
      </div>

      <div class="md:col-span-2 border rounded-lg p-4 bg-gray-50">
        <label class="block text-lg text-gray-700 font-bold mb-2">
          Documents requis
          <span class="text-orange-400">*</span>
        </label>
        <div class="mb-4">
          <div v-for="(docs, category) in availableDocuments" :key="category" class="mb-4">
            <h3 class="text-sm font-semibold text-orange-500 mb-2 capitalize">
              {{ category.replace('_', ' ') }}
            </h3>
            <transition-group name="fade" tag="ul" class="flex flex-wrap gap-1">
              <li
                v-for="doc in docs"
                :key="doc"
                class="px-2 py-1 border border-orange-400 rounded-full flex items-center gap-1 cursor-pointer hover:bg-orange-100 text-xs transition duration-150"
                @click="addDocument(doc)"
              >
                <span class="text-orange-500 font-bold">+</span> {{ doc }}
              </li>
            </transition-group>
          </div>
        </div>

        <transition-group name="fade" tag="ul" class="flex flex-wrap gap-1 mt-2">
          <li
            v-for="(doc, index) in form.documents"
            :key="doc"
            :class="[
              'px-2 py-1 rounded-full flex items-center gap-1 text-xs',
              'bg-gray-100', // Style uniforme pour les éléments sélectionnés
            ]"
          >
            {{ doc }}
            <button
              type="button"
              @click="removeDocument(index)"
              class="text-red-500 cursor-pointer hover:text-red-700 transition duration-150"
            >
              x
            </button>
          </li>
        </transition-group>
        <p v-if="form.documents.length === 0" class="text-gray-400 italic mt-2 text-sm">
            Veuillez ajouter les documents requis ci-dessus.
        </p>
      </div>

      <div class="md:col-span-2 flex justify-center gap-10 mt-4">
        <button
          type="submit"
          class="bg-orange-400 w-full text-white text-xl font-bold px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          {{ isEditMode ? 'Enregistrer les modifications' : 'Enregistrer' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
