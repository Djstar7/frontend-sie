<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import type { UserRegister } from '@/types/user'
import { toastError } from '@/utils/toastConfig'

import { validateForm, required, isEmail, isPassword, isSameAs } from '@/utils/validateForm'
import { ref, reactive } from 'vue'



const userStore = useUserStore()

const loading = ref(false)







const localForm = reactive<Partial<UserRegister>>({
    name: userStore.user?.name || '',
    email: userStore.user?.email || '',

});


const emit = defineEmits<{ (e: 'updated'): void }>()


const passwordForm = reactive({
  new_password: '',
  password_confirmation: '',
})


const errors = ref<Record<string, string>>({})




type AllFormKeys = keyof typeof localForm | keyof typeof passwordForm;


const clearError = (field: AllFormKeys) => {
  if (errors.value[field as keyof typeof errors.value]) {
    delete errors.value[field as keyof typeof errors.value]
  }
}


const validate = () => {
  const rules: Record<string, Array<object>> = {
    name: [required('Le pseudo est obligatoire')],
    email: [required("L'email est obligatoire"), isEmail()],
  }


  const isPasswordProvided = !!passwordForm.new_password || !!passwordForm.password_confirmation;

  if (isPasswordProvided) {
    rules.new_password = [
      required('Le nouveau mot de passe est obligatoire'),
      isPassword('Le mot de passe doit être valide (minimum 8 caractères, majuscule, minuscule, chiffre)'),
    ];
    rules.password_confirmation = [
      required('La confirmation du mot de passe est obligatoire'),

      isSameAs(passwordForm.new_password, 'Les mots de passe ne correspondent pas'),
    ];
  }



  const validationData = { ...localForm, ...passwordForm };

  const { isValid, errors: validationErrors } = validateForm(validationData, rules)

  errors.value = {}
  if (!isValid) {
    for (const key in validationErrors) {
      const msg = (validationErrors as Record<string, string[]>)[key]?.[0]
      if (msg) errors.value[key as AllFormKeys] = msg
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

    const userId = userStore.user?.id;
    if (!userId) {
        toastError("Erreur: L'ID utilisateur est manquant pour la soumission.")
        return
    }

    const updatePayload: UserRegister = {
      name: String(localForm.name),
      email: String(localForm.email),
    };



    if (passwordForm.new_password) {
        updatePayload.password = passwordForm.new_password;
    }

    await userStore.editUser(userId, updatePayload)
    emit('updated')
  } catch (e) {
    console.error(e)
    toastError("Erreur lors de la mise à jour de l'utilisateur.")
  } finally {
    loading.value = false
  }
}


const labelClass = 'block text-xs sm:text-sm font-medium text-gray-700'
const baseInputClass =
  'mt-1 w-full rounded-lg p-2 sm:p-3 text-sm sm:text-md border shadow-sm focus:outline-none transition-all duration-200'


const getInputClass = (field: AllFormKeys) => [
  baseInputClass,
  errors.value[field]
    ? 'border-red-600 ring-2 ring-red-100'
    : 'border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500',
]
</script>

<template>
  <section class="flex overflow-y-auto items-center justify-center px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
    <div
      class="relative w-full max-w-sm sm:max-w-xl bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col max-h-[95vh] shadow-2xl"
    >
      <div class="overflow-y-auto">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700 flex items-center gap-2 mb-4 sm:mb-6 border-b pb-3">
          <i class="fas fa-user-edit text-orange-500"></i>
          Mise à jour des informations utilisateur
        </h1>

        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label :class="labelClass">Pseudo / Nom d'utilisateur</label>
            <input
              v-model="localForm.name"
              @input="clearError('name')"
              type="text"
              :class="getInputClass('name')"
            />
            <p v-if="errors.name" class="text-red-600 text-xs sm:text-sm mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label :class="labelClass">Email</label>
            <input
              v-model="localForm.email"
              @input="clearError('email')"
              type="email"
              :class="getInputClass('email')"
            />
            <p v-if="errors.email" class="text-red-600 text-xs sm:text-sm mt-1">{{ errors.email }}</p>
          </div>

          <div class="col-span-1 sm:col-span-2 my-4">
            <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <i class="fas fa-key text-blue-500"></i> Changer le mot de passe (Facultatif)
            </h2>
          </div>

          <div>
            <label :class="labelClass">Nouveau mot de passe</label>
            <input
              v-model="passwordForm.new_password"
              @input="clearError('new_password')"
              type="password"
              :class="getInputClass('new_password')"
              placeholder="Laisser vide si inchangé"
            />
            <p v-if="errors.new_password" class="text-red-600 text-xs sm:text-sm mt-1">{{ errors.new_password }}</p>
          </div>

          <div>
            <label :class="labelClass">Confirmer le nouveau mot de passe</label>
            <input
              v-model="passwordForm.password_confirmation"
              @input="clearError('password_confirmation')"
              type="password"
              :class="getInputClass('password_confirmation')"
              placeholder="Confirmer le nouveau mot de passe"
            />
            <p v-if="errors.password_confirmation" class="text-red-600 text-xs sm:text-sm mt-1">{{ errors.password_confirmation }}</p>
          </div>

          <div class="col-span-1 sm:col-span-2 mt-4 sm:mt-8">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 py-2 sm:py-3 px-4 text-sm sm:text-lg font-medium text-white rounded-lg sm:rounded-xl shadow-md transition-colors duration-300 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin text-sm sm:text-lg"></i>
              <i v-else class="fas fa-save text-sm sm:text-lg"></i>
              <span>{{ loading ? 'Mise à jour...' : 'Sauvegarder les modifications' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
