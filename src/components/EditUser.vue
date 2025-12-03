<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { toastError } from '@/utils/toastConfig'
import type { Custom, Profil } from '@/types/user'
import { ref, watch } from 'vue'
import { validateForm, required, isEmail } from '@/utils/validateForm'
import { useProfilStore } from '@/stores/profilStore'





const userStore = useUserStore()
const profilStore = useProfilStore()

const loading = ref(false)

const props = defineProps<{
  form: Custom
  id: string
  idProfil: string
}>()

const emit = defineEmits<{ (e: 'updated'): void }>()


const errors = ref<Record<string, string>>({})


const clearError = (field: keyof Custom) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}


const finalPhone = ref('')

const formatPhone = (value: string) => {
  let num = value.replace(/\D/g, '')


  if (num.length > 0 && !num.startsWith('6')) num = '6' + num.slice(1)


  num = num.slice(0, 9)

  return num
}


watch(
  () => props.form.phone,
  (val) => {
    if (!val) return
    const formatted = formatPhone(val)
    props.form.phone! = formatted
    finalPhone.value = formatted.length === 9 ? `${formatted}` : ''
  },
  { immediate: true }
)


const validate = () => {
  const rules: Record<string, Array<object>> = {
    name: [required('Le nom est obligatoire')],
    email: [required("L'email est obligatoire"), isEmail()],
  }

  if (props.form.role === 'custom') {
    rules.first_name = [required('Le prénom est obligatoire')]
    rules.last_name = [required('Le nom est obligatoire')]
    rules.phone = [
      required('Le téléphone est obligatoire'),
      {
        validate: () => props.form.phone.length === 9,
        message: 'Le numéro doit contenir 9 chiffres',
      },
      {
        validate: () => props.form.phone.startsWith('6'),
        message: 'Le numéro doit commencer par 6',
      },
    ]
    rules.date_of_birth = [required('La date de naissance est obligatoire')]
    rules.place_of_birth = [required('Le lieu de naissance est obligatoire')]
    rules.nationality = [required('La nationalité est obligatoire')]
  }

  const { isValid, errors: validationErrors } = validateForm(props.form, rules)

  errors.value = {}
  if (!isValid) {
    for (const key in validationErrors) {
      const msg = validationErrors[key]![0]
      errors.value[key] = msg
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
    if (!props.id) throw new Error("L'ID utilisateur est manquant.")

    if (props.form.role === 'custom') {

      await userStore.editUser(props.id, props.form
      )


      if (props.idProfil) {
         const profilUpdatePayload: Profil = {
          user_id: props.id,
          first_name: props.form.first_name!,
          last_name: props.form.last_name!,
          place_of_birth: props.form.place_of_birth!,
          date_of_birth: props.form.date_of_birth!,
          gender: props.form.gender!,
          status_mat: props.form.status_mat!,
          nationality: props.form.nationality!,
          phone: finalPhone.value,
        }
        await profilStore.editProfil(props.idProfil, profilUpdatePayload)
      } else {
         console.warn("L'ID du profil est manquant. Le profil n'a pas été mis à jour.")
      }

    } else {

      await userStore.editUser(props.id, {
        name: props.form.name,
        email: props.form.email,
        role: props.form.role,
      })
    }

    emit('updated')
  } catch (e) {
    console.error(e)
    toastError("Erreur lors de la mise à jour du profil.")
  } finally {
    loading.value = false
  }
}


const labelClass = 'block text-xs sm:text-sm font-medium text-gray-700'
const baseInputClass =
  'mt-1 w-full rounded-lg p-2 sm:p-3 text-sm sm:text-md border shadow-sm focus:outline-none transition-all duration-200'


const getInputClass = (field: keyof Custom) => [
  baseInputClass,
  errors.value[field]
    ? 'border-red-600 ring-2 ring-red-100'
    : 'border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500',
]
</script>

<template>
  <section class="flex overflow-y-auto items-center justify-center px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
    <div
      class="relative w-full max-w-sm sm:max-w-2xl lg:max-w-4xl bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col max-h-[95vh] shadow-2xl"
    >
      <div class="overflow-y-auto">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700 flex items-center gap-2 mb-4 sm:mb-6 border-b pb-3">
          <i class="fas fa-user-edit text-orange-500"></i>
          Mise à jour du profil
        </h1>

        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label :class="labelClass">Pseudo / Nom</label>
            <input
              v-model="form.name!"
              @input="clearError('name')"
              type="text"
              :class="getInputClass('name')"
            />
            <p v-if="errors.name" class="text-red-600 text-xs sm:text-sm mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label :class="labelClass">Email</label>
            <input
              v-model="form.email!"
              @input="clearError('email')"
              type="text"
              :class="getInputClass('email')"
            />
            <p v-if="errors.email" class="text-red-600 text-xs sm:text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div v-if="userStore.role !== 'custom'">
            <label :class="labelClass">Rôle</label>
            <select v-model="form.role!" :class="getInputClass('role')">
              <option value="custom">Client</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          <div v-if="userStore.role !== 'custom'"></div> <template v-if="form.role === 'custom'">
            <div>
              <label :class="labelClass">Nom</label>
              <input
                v-model="form.last_name!"
                @input="clearError('last_name')"
                type="text"
                :class="getInputClass('last_name')"
              />
              <p v-if="errors.last_name" class="text-red-600 text-xs sm:text-sm mt-1">
                {{ errors.last_name }}
              </p>
            </div>

            <div>
              <label :class="labelClass">Prénom</label>
              <input
                v-model="form.first_name!"
                @input="clearError('first_name')"
                type="text"
                :class="getInputClass('first_name')"
              />
              <p v-if="errors.first_name" class="text-red-600 text-xs sm:text-sm mt-1">
                {{ errors.first_name }}
              </p>
            </div>

            <div>
              <label :class="labelClass">Téléphone (6XXXXXXXX)</label>
              <input
                v-model="form.phone!"
                @input="clearError('phone')"
                type="tel"
                maxlength="9"
                :class="getInputClass('phone')"
              />
              <p v-if="errors.phone" class="text-red-600 text-xs sm:text-sm mt-1">{{ errors.phone }}</p>
            </div>

            <div>
              <label :class="labelClass">Genre</label>
              <select v-model="form.gender!" :class="getInputClass('gender')">
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>

            <div>
              <label :class="labelClass">Date de naissance</label>
              <input
                v-model="form.date_of_birth!"
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
                v-model="form.place_of_birth!"
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
              <select v-model="form.status_mat!" :class="getInputClass('status_mat')">
                <option value="single">Célibataire</option>
                <option value="married">Marié(e)</option>
                <option value="divorced">Divorcé(e)</option>
                <option value="widowed">Veuf/Veuve</option>
              </select>
            </div>

            <div>
              <label :class="labelClass">Nationalité</label>
              <input
                v-model="form.nationality!"
                @input="clearError('nationality')"
                type="text"
                :class="getInputClass('nationality')"
              />
              <p v-if="errors.nationality" class="text-red-600 text-xs sm:text-sm mt-1">
                {{ errors.nationality }}
              </p>
            </div>
          </template>

          <div class="col-span-1 sm:col-span-2 mt-4 sm:mt-8">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 py-2 sm:py-3 px-4 text-sm sm:text-lg font-medium text-white rounded-lg sm:rounded-xl shadow-md transition-colors duration-300 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-sm sm:text-lg"></i>
              <i v-else class="fas fa-user-edit text-sm sm:text-lg"></i>
              <span>{{ loading ? 'Mise à jour...' : 'Mettre à jour le profil' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
