<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { toastError } from '@/utils/toastConfig'
import type { Custom, Profil } from '@/types/user'
import { reactive, ref, watch } from 'vue'
import { validateForm, required, isEmail, isPassword, isSameAs } from '@/utils/validateForm'
import { useProfilStore } from '@/stores/profilStore'


type CreateForm = Custom

const userStore = useUserStore()
const profilStore = useProfilStore()
const emit = defineEmits<{ (e: 'created'): void }>()


const form: CreateForm = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: 'custom',
  first_name: '',
  last_name: '',
  gender: 'male',
  date_of_birth: '',
  place_of_birth: '',
  status_mat: 'single',
  nationality: '',
})


const finalPhone = ref('')


const formatPhone = (value: string) => {

  let num = value.replace(/\D/g, '')


  if (num.length > 0 && !num.startsWith('6')) num = '6' + num.slice(1)


  num = num.slice(0, 9)

  return num
}


watch(
  () => form.phone,
  (val) => {
    const formatted = formatPhone(val)
    form.phone = formatted
    finalPhone.value = formatted.length === 9 ? `+237${formatted}` : ''
  },
)


const errors = ref<Record<string, string>>({})
const loading = ref(false)


const clearError = (field: keyof CreateForm) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

const validate = () => {
  const rules: Record<string, Array<object>> = {
    name: [required('Le pseudo est obligatoire')],
    email: [required("L'email est obligatoire"), isEmail()],
    password: [required('Le mot de passe est obligatoire'), isPassword()],
    password_confirmation: [
      required('La confirmation du mot de passe est obligatoire'),
      isSameAs(form.password, 'Les mots de passe ne correspondent pas'),
    ],
  }

  if (form.role === 'custom') {
    rules.first_name = [required('Le prénom est obligatoire')]
    rules.last_name = [required('Le nom est obligatoire')]
    rules.phone = [
      required('Le téléphone est obligatoire'),
      {
        validate: () => form.phone.length === 9,
        message: 'Le numéro doit contenir exactement 9 chiffres',
      },
      {
        validate: () => form.phone.startsWith('6'),
        message: 'Le numéro doit commencer par 6',
      },
    ]
    rules.date_of_birth = [required('La date de naissance est obligatoire')]
    rules.place_of_birth = [required('Le lieu de naissance est obligatoire')]
    rules.nationality = [required('La nationalité est obligatoire')]
  }

  const { isValid, errors: validationErrors } = validateForm(form, rules)
  errors.value = {}

  if (!isValid) {
    for (const key in validationErrors) {
      const msg = (validationErrors as Record<string, string[]>)[key]?.[0]
      if (msg) errors.value[key] = msg
    }
  }

  return isValid
}


const handleSubmit = async () => {
  if (!validate()) {
    toastError('Veuillez corriger les erreurs avant de soumettre')
    return
  }

  loading.value = true

  try {

    const payload: CreateForm = {
      ...form,
      phone: finalPhone.value || '',
    }


    const res = await userStore.createUser(payload)


    if (form.role === 'custom' && res?.data.id) {
      const profilPayload: Profil = {
        user_id: String(res.data.id),
        first_name: form.first_name,
        last_name: form.last_name,
        place_of_birth: form.place_of_birth,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        status_mat: form.status_mat,
        nationality: form.nationality,
        phone: finalPhone.value,
      }

      await profilStore.createProfil(profilPayload)
    }
    emit('created')
  } catch (e) {
    console.error(e)
    toastError("Erreur lors de la création de l'utilisateur.")
  } finally {
    loading.value = false
  }
}


const labelClass = 'block text-xs sm:text-sm font-medium text-gray-700'
const baseInputClass =
  'mt-1 w-full rounded-lg p-2 sm:p-3 text-sm sm:text-md border shadow-sm focus:outline-none transition-all duration-200'


const getInputClass = (field: keyof CreateForm) => [
  baseInputClass,
  errors.value[field]
    ? 'border-red-600 ring-2 ring-red-100'
    : 'border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500',
]
</script>

<template>
  <section
    class="flex items-center justify-center px-2 sm:px-4 md:px-6 py-4 md:py-8 overflow-y-auto max-h-[95vh]"
  >
    <div
      class="w-full max-w-md sm:max-w-2xl lg:max-w-4xl bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl"
    >
      <h1
        class="pb-3 mt-4 sm:mt-6 md:mt-8 text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-2 mb-4 sm:mb-6 border-b border-gray-200"
      >
        <i class="fas fa-user-plus text-orange-500"></i>
        Création d'un nouvel utilisateur
      </h1>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label :class="labelClass">Pseudo / Nom d'utilisateur</label>
          <input
            v-model="form.name"
            @input="clearError('name')"
            type="text"
            :class="getInputClass('name')"
            placeholder="Pseudo"
          />
          <p v-if="errors.name" class="text-red-600 text-xs sm:text-sm mt-1">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label :class="labelClass">Email</label>
          <input
            v-model="form.email"
            @input="clearError('email')"
            type="email"
            :class="getInputClass('email')"
            placeholder="email@example.com"
          />
          <p v-if="errors.email" class="text-red-600 text-xs sm:text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label :class="labelClass">Rôle</label>
          <select v-model="form.role" @change="clearError('role')" :class="getInputClass('role')">
            <option value="custom">Client</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div v-if="form.role !== 'custom'"></div>

        <div>
          <label :class="labelClass">Mot de passe</label>
          <input
            v-model="form.password"
            @input="clearError('password')"
            type="password"
            :class="getInputClass('password')"
          />
          <p v-if="errors.password" class="text-red-600 text-xs sm:text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label :class="labelClass">Confirmez le mot de passe</label>
          <input
            v-model="form.password_confirmation"
            @input="clearError('password_confirmation')"
            type="password"
            :class="getInputClass('password_confirmation')"
          />
          <p v-if="errors.password_confirmation" class="text-red-600 text-xs sm:text-sm mt-1">
            {{ errors.password_confirmation }}
          </p>
        </div>

        <template v-if="form.role === 'custom'">
          <div>
            <label :class="labelClass">Prénom</label>
            <input
              v-model="form.first_name"
              @input="clearError('first_name')"
              type="text"
              :class="getInputClass('first_name')"
            />
            <p v-if="errors.first_name" class="text-red-600 text-xs sm:text-sm mt-1">
              {{ errors.first_name }}
            </p>
          </div>

          <div>
            <label :class="labelClass">Nom</label>
            <input
              v-model="form.last_name"
              @input="clearError('last_name')"
              type="text"
              :class="getInputClass('last_name')"
            />
            <p v-if="errors.last_name" class="text-red-600 text-xs sm:text-sm mt-1">
              {{ errors.last_name }}
            </p>
          </div>

          <div>
            <label :class="labelClass">Téléphone (9 chiffres, Ex: 6XXXXXXXX)</label>
            <input
              v-model="form.phone"
              @input="clearError('phone')"
              type="tel"
              maxlength="9"
              :class="getInputClass('phone')"
            />
            <p v-if="errors.phone" class="text-red-600 text-xs sm:text-sm mt-1">
              {{ errors.phone }}
            </p>
          </div>

          <div>
            <label :class="labelClass">Genre</label>
            <select
              v-model="form.gender"
              @change="clearError('gender')"
              :class="getInputClass('gender')"
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>

          <div>
            <label :class="labelClass">Date de naissance</label>
            <input
              v-model="form.date_of_birth"
              @input="clearError('date_of_birth')"
              type="date"
              :class="getInputClass('date_of_birth')"
            />
            <p v-if="errors.date_of_birth" class="text-red-600 text-xs sm:text-sm mt-1">
              {{ errors.date_of_birth }}
            </p>
          </div>

          <div>
            <label :class="labelClass">Lieu de naissance</label>
            <input
              v-model="form.place_of_birth"
              @input="clearError('place_of_birth')"
              type="text"
              :class="getInputClass('place_of_birth')"
            />
            <p v-if="errors.place_of_birth" class="text-red-600 text-xs sm:text-sm mt-1">
              {{ errors.place_of_birth }}
            </p>
          </div>

          <div>
            <label :class="labelClass">Statut matrimonial</label>
            <select
              v-model="form.status_mat"
              @change="clearError('status_mat')"
              :class="getInputClass('status_mat')"
            >
              <option value="single">Célibataire</option>
              <option value="married">Marié(e)</option>
              <option value="divorced">Divorcé(e)</option>
              <option value="widowed">Veuf/Veuve</option>
            </select>
          </div>

          <div>
            <label :class="labelClass">Nationalité</label>
            <input
              v-model="form.nationality"
              @input="clearError('nationality')"
              type="text"
              :class="getInputClass('nationality')"
            />
            <p v-if="errors.nationality" class="text-red-600 text-xs sm:text-sm mt-1">
              {{ errors.nationality }}
            </p>
          </div>
        </template>

        <div class="col-span-1 md:col-span-2 mt-4 sm:mt-6">
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-2 sm:py-3 px-4 text-sm sm:text-lg font-medium text-white rounded-lg sm:rounded-xl shadow-md transition-colors duration-300 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-user-plus"></i>
            <span>{{ loading ? 'Création...' : "Créer l'utilisateur" }}</span>
          </button>
        </div>
      </form>

      <div v-if="userStore.error" class="text-red-600 text-sm sm:text-md mt-4 text-center">
        {{ userStore.error }}
      </div>
    </div>
  </section>
</template>
