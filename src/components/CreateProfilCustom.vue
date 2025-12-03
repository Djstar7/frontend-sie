<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { toastError } from '@/utils/toastConfig'
import { useProfilStore } from '@/stores/profilStore'
import { useCountryStore } from '@/stores/countryStore'
import { useUserStore } from '@/stores/userStore'
import type { Country } from '@/types/country'
import type { Gender, Profil, StatusMat } from '@/types/user'


const profilStore = useProfilStore()
const countryStore = useCountryStore()
const userStore = useUserStore()

const emit = defineEmits<{ (e: 'created'): void }>()


interface FormProfil {
  id: string | null
  user_id: string
  first_name: string
  last_name: string
  phone: string
  gender: Gender
  date_of_birth: string
  place_of_birth: string
  status_mat: StatusMat
  nationality: string
  country_id: string
}

const form = ref<FormProfil>({
  id: null,
  user_id: userStore.user?.id ?? '',
  first_name: '',
  last_name: '',
  phone: '',
  gender: 'male',
  date_of_birth: '',
  place_of_birth: '',
  status_mat: 'single',
  nationality: '',
  country_id: '',
})


const errors = ref<Partial<Record<keyof FormProfil, string[]>>>({})
const loading = ref(false)
const isEdit = ref(false)


const countries = ref<Country[]>([])
const searchCountry = ref('')
const isCountryOpen = ref(false)

const filteredCountries = computed(() =>
  !searchCountry.value
    ? countries.value
    : countries.value.filter((c) =>
        c.name.toLowerCase().includes(searchCountry.value.toLowerCase()),
      ),
)


onMounted(async () => {
  try {

    const resCountrys = await countryStore.getCountrys()
    countries.value = resCountrys?.data ?? []


    const resProfil = await profilStore.showProfilUser(String(userStore.user?.id))
    if (resProfil?.data) {

      form.value = {
        ...form.value,
        ...resProfil.data,
        id: resProfil.data.id || null,
        user_id: resProfil.data.user_id || userStore.user?.id || '',
      } as FormProfil


      if (form.value.nationality) {
        const country = countries.value.find((c) => c.name === form.value.nationality)
        if (country) {
          searchCountry.value = country.name
          form.value.country_id = country.id!
        }
      }

      isEdit.value = true
    }
  } catch (err) {
    console.error('Erreur lors du chargement du profil ou des pays :', err)
    toastError('Impossible de charger votre profil pour le moment.')
  }
})


const selectCountry = (country: Country) => {
  form.value.country_id = country.id!
  form.value.nationality = country.name
  searchCountry.value = country.name
  isCountryOpen.value = false
  clearError('country_id')
}


watch(
  () => form.value.phone,
  (value) => {
    if (typeof value !== 'string') return
    const digits = value.replace(/\D/g, '').slice(0, 9)


    const formatted = digits.replace(
      /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{1})$/,
      (_, a, b, c, d, e) => `${a} ${b} ${c} ${d} ${e}`,
    )


    form.value.phone = digits.length === 9 ? formatted : digits
  },
)


const phoneIsValid = computed(() => {
  const digits = form.value.phone.replace(/\D/g, '')
  return digits.length === 9 && digits.startsWith('6')
})

const clearError = (field: keyof FormProfil) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}


const validateForm = (): boolean => {
  errors.value = {}

  const requiredFields: (keyof FormProfil)[] = [
    'first_name',
    'last_name',
    'gender',
    'phone',
    'date_of_birth',
    'place_of_birth',
    'status_mat',
    'country_id',
  ]

  let valid = true

  requiredFields.forEach((field) => {
    if (!form.value[field] || form.value[field] === '') {
      errors.value[field] = ['Ce champ est obligatoire']
      valid = false
    }
  })

  if (!phoneIsValid.value) {
    errors.value.phone = [
      'Numéro invalide : doit commencer par 6 et contenir exactement 9 chiffres.',
    ]
    valid = false
  }


  if (!form.value.country_id && searchCountry.value) {
    errors.value.country_id = ['Veuillez sélectionner un pays dans la liste.']
    valid = false
  }

  return valid
}


const handleSubmit = async () => {
  if (!validateForm()) {
    toastError('Veuillez corriger les erreurs avant de continuer.')
    return
  }

  loading.value = true

  try {

    const phoneDigits = form.value.phone.replace(/\D/g, '')
    const payload = {
      ...form.value,
      phone: `${phoneDigits}`,
      nationality: searchCountry.value,
    } as Profil

    if (isEdit.value) {
      await profilStore.editProfil(form.value.id!, payload)
    } else {
      await profilStore.createProfil(payload)
    }

    emit('created')
  } catch (err) {
    console.error(err)
    toastError("Erreur lors de l'enregistrement")
  } finally {
    loading.value = false
  }
}


const baseInputClass =
  'w-full outline-none rounded-lg p-2 sm:p-3 text-sm sm:text-base border shadow-sm transition-all duration-200'
const labelClass = 'block text-xs sm:text-sm font-medium text-gray-700 mb-1'

const getFieldClass = (field: keyof FormProfil) => [
  baseInputClass,
  errors.value[field]
    ? 'border-red-600 ring-2 ring-red-100'
    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
]
</script>

<template>
  <div class="p-4 sm:p-6 w-full max-w-lg md:max-w-3xl mx-auto">
    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div>
        <label :class="labelClass">Nom</label>
        <input
          v-model="form.last_name"
          @input="clearError('last_name')"
          type="text"
          :class="getFieldClass('last_name')"
        />
        <p v-if="errors.last_name" class="text-red-600 text-xs sm:text-sm mt-1">
          {{ errors.last_name[0] }}
        </p>
      </div>

      <div>
        <label :class="labelClass">Prénom</label>
        <input
          v-model="form.first_name"
          @input="clearError('first_name')"
          type="text"
          :class="getFieldClass('first_name')"
        />
        <p v-if="errors.first_name" class="text-red-600 text-xs sm:text-sm mt-1">
          {{ errors.first_name[0] }}
        </p>
      </div>

      <div>
        <label :class="labelClass">Téléphone (Ex: 6XXXXXXXX)</label>
        <input
          v-model="form.phone"
          @input="clearError('phone')"
          type="tel"
          maxlength="11"
          :class="getFieldClass('phone')"
        />
        <p v-if="errors.phone" class="text-red-600 text-xs sm:text-sm mt-1">
          {{ errors.phone[0] }}
        </p>
      </div>

      <div>
        <label :class="labelClass">Genre</label>
        <select
          v-model="form.gender"
          @change="clearError('gender')"
          :class="[...getFieldClass('gender'), 'appearance-none']"
        >
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
        <p v-if="errors.gender" class="text-red-600 text-xs sm:text-sm mt-1">
          {{ errors.gender[0] }}
        </p>
      </div>

      <div>
        <label :class="labelClass">Date de naissance</label>
        <input
          v-model="form.date_of_birth"
          @input="clearError('date_of_birth')"
          type="date"
          :class="getFieldClass('date_of_birth')"
        />
        <p v-if="errors.date_of_birth" class="text-red-600 text-xs sm:text-sm mt-1">
          {{ errors.date_of_birth[0] }}
        </p>
      </div>

      <div>
        <label :class="labelClass">Lieu de naissance</label>
        <input
          v-model="form.place_of_birth"
          @input="clearError('place_of_birth')"
          type="text"
          :class="getFieldClass('place_of_birth')"
        />
        <p v-if="errors.place_of_birth" class="text-red-600 text-xs sm:text-sm mt-1">
          {{ errors.place_of_birth[0] }}
        </p>
      </div>

      <div>
        <label :class="labelClass">Statut matrimonial</label>
        <select
          v-model="form.status_mat"
          @change="clearError('status_mat')"
          :class="[...getFieldClass('status_mat'), 'appearance-none']"
        >
          <option value="single">Célibataire</option>
          <option value="married">Marié(e)</option>
          <option value="divorced">Divorcé(e)</option>
          <option value="widowed">Veuf / Veuve</option>
        </select>
      </div>

      <div class="relative">
        <label :class="labelClass">Votre pays d'origine</label>

        <input
          type="text"
          v-model="searchCountry"
          @input="clearError('country_id')"
          @focus="isCountryOpen = true"
          placeholder="Rechercher un pays..."
          :class="getFieldClass('country_id')"
        />

        <ul
          v-if="isCountryOpen"
          class="absolute z-50 w-full max-h-48 sm:max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg"
        >
          <li
            v-for="country in filteredCountries"
            :key="country.id"
            @mousedown.prevent="selectCountry(country)"
            class="px-3 py-2 text-sm sm:text-base cursor-pointer hover:bg-blue-50"
            :class="{ 'bg-blue-50 font-medium': form.country_id === country.id }"
          >
            {{ country.name }}
          </li>
          <li v-if="filteredCountries.length === 0" class="px-3 py-2 text-gray-400 text-sm">
            Aucun résultat
          </li>
        </ul>
        <p v-if="errors.country_id" class="text-red-600 text-xs sm:text-sm mt-1">
          {{ errors.country_id[0] }}
        </p>
      </div>

      <div class="col-span-1 md:col-span-2 mt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 sm:py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:bg-blue-700 transition duration-200 disabled:opacity-60 text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          <span v-else class="fas fa-save"></span>
          <span>
            {{ loading ? 'Enregistrement...' : isEdit ? 'Editer mon profil' : 'Créer mon profil' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>
