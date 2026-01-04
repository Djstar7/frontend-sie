<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useListDocumentRequiredStore } from '@/stores/listDocumentRequiredStore'
import type { ListDocumentRequired, ListDocumentRequiredForm } from '@/types/document'

const props = defineProps<{
  isOpen: boolean
  document?: ListDocumentRequired | null
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const store = useListDocumentRequiredStore()

const isEditMode = computed(() => !!props.document)

const form = ref<ListDocumentRequiredForm>({
  name: '',
  guide: '',
  category: 'administratifs',
  is_required: true,
  file_types: ['pdf'],
  max_size_mb: 5,
  is_active: true,
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const availableFileTypes = ['pdf', 'jpg', 'png', 'jpeg', 'doc', 'docx']

// Reinitialiser le formulaire quand la modal s'ouvre
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.document) {
        form.value = {
          name: props.document.name,
          guide: props.document.guide || '',
          category: props.document.category,
          is_required: props.document.is_required,
          file_types: [...props.document.file_types],
          max_size_mb: props.document.max_size_mb,
          is_active: props.document.is_active,
        }
      } else {
        form.value = {
          name: '',
          guide: '',
          category: props.categories[0] || 'administratifs',
          is_required: true,
          file_types: ['pdf'],
          max_size_mb: 5,
          is_active: true,
        }
      }
      errors.value = {}
    }
  },
)

const toggleFileType = (type: string) => {
  const index = form.value.file_types.indexOf(type)
  if (index > -1) {
    if (form.value.file_types.length > 1) {
      form.value.file_types.splice(index, 1)
    }
  } else {
    form.value.file_types.push(type)
  }
}

const validate = (): boolean => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Le nom est obligatoire'
  }

  if (!form.value.category) {
    errors.value.category = 'La categorie est obligatoire'
  }

  if (form.value.file_types.length === 0) {
    errors.value.file_types = 'Selectionnez au moins un type de fichier'
  }

  if (!form.value.max_size_mb || form.value.max_size_mb < 1) {
    errors.value.max_size_mb = 'La taille max doit etre au moins 1 Mo'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  try {
    if (isEditMode.value && props.document) {
      await store.update(props.document.id, form.value)
    } else {
      await store.create(form.value)
    }
    emit('saved')
    emit('close')
  } catch {
    // Error handled by store
  } finally {
    isSubmitting.value = false
  }
}

const formatCategoryName = (cat: string) => {
  return cat
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-xl font-bold text-gray-800">
            {{ isEditMode ? 'Modifier le document' : 'Ajouter un document requis' }}
          </h3>
          <button
            @click="emit('close')"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
          <!-- Nom -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom du document <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Ex: Passeport valide"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <!-- Guide -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Guide / Instructions
            </label>
            <textarea
              v-model="form.guide"
              rows="3"
              placeholder="Ex: Passeport valable au moins 6 mois apres la date de retour."
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            ></textarea>
          </div>

          <!-- Categorie -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categorie <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              :class="{ 'border-red-500': errors.category }"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ formatCategoryName(cat) }}
              </option>
            </select>
            <p v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</p>
          </div>

          <!-- Types de fichier -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Types de fichiers acceptes <span class="text-red-500">*</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in availableFileTypes"
                :key="type"
                type="button"
                @click="toggleFileType(type)"
                class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                :class="
                  form.file_types.includes(type)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                "
              >
                .{{ type }}
              </button>
            </div>
            <p v-if="errors.file_types" class="text-red-500 text-xs mt-1">{{ errors.file_types }}</p>
          </div>

          <!-- Taille max -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Taille maximum (Mo) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.max_size_mb"
              type="number"
              min="1"
              max="50"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              :class="{ 'border-red-500': errors.max_size_mb }"
            />
            <p v-if="errors.max_size_mb" class="text-red-500 text-xs mt-1">{{ errors.max_size_mb }}</p>
          </div>

          <!-- Options -->
          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.is_required"
                type="checkbox"
                class="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
              />
              <span class="text-sm text-gray-700">Document obligatoire</span>
            </label>

            <label v-if="isEditMode" class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="w-4 h-4 text-green-500 rounded focus:ring-green-400"
              />
              <span class="text-sm text-gray-700">Actif</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="emit('close')"
              class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isEditMode ? 'Enregistrer' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
