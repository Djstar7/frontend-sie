<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useListDocumentRequiredStore } from '@/stores/listDocumentRequiredStore'
import type { ListDocumentRequired, ListDocumentRequiredForm } from '@/types/document'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const store = useListDocumentRequiredStore()

// States
const documents = ref<ListDocumentRequired[]>([])
const categories = ref<string[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref<string>('all')

// Form states
const showForm = ref(false)
const isEditMode = ref(false)
const editingDocument = ref<ListDocumentRequired | null>(null)
const isSubmitting = ref(false)
const deleteConfirmId = ref<string | null>(null)

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
const availableFileTypes = ['pdf', 'jpg', 'png', 'jpeg', 'doc', 'docx']

// Computed
const filteredDocuments = computed(() => {
  let result = documents.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter((doc) => doc.category === selectedCategory.value)
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        (doc.guide && doc.guide.toLowerCase().includes(query)),
    )
  }

  return result
})

const groupedDocuments = computed(() => {
  const grouped: Record<string, ListDocumentRequired[]> = {}
  filteredDocuments.value.forEach((doc) => {
    if (!grouped[doc.category]) {
      grouped[doc.category] = []
    }
    grouped[doc.category].push(doc)
  })
  return grouped
})

// Methods
const loadData = async () => {
  isLoading.value = true
  try {
    const [docsRes, catsRes] = await Promise.all([
      store.getAll(false),
      store.getCategories(),
    ])
    documents.value = docsRes?.data || []
    categories.value = catsRes?.data || []
  } catch (e) {
    console.error('Erreur chargement:', e)
  } finally {
    isLoading.value = false
  }
}

const formatCategoryName = (cat: string) => {
  return cat.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

const resetForm = () => {
  form.value = {
    name: '',
    guide: '',
    category: categories.value[0] || 'administratifs',
    is_required: true,
    file_types: ['pdf'],
    max_size_mb: 5,
    is_active: true,
  }
  errors.value = {}
  isEditMode.value = false
  editingDocument.value = null
}

const openAddForm = () => {
  resetForm()
  showForm.value = true
}

const openEditForm = (doc: ListDocumentRequired) => {
  isEditMode.value = true
  editingDocument.value = doc
  form.value = {
    name: doc.name,
    guide: doc.guide || '',
    category: doc.category,
    is_required: doc.is_required,
    file_types: [...doc.file_types],
    max_size_mb: doc.max_size_mb,
    is_active: doc.is_active,
  }
  errors.value = {}
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  resetForm()
}

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
    if (isEditMode.value && editingDocument.value) {
      await store.update(editingDocument.value.id, form.value)
    } else {
      await store.create(form.value)
    }
    await loadData()
    closeForm()
    emit('updated')
  } catch {
    // Error handled by store
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (id: string) => {
  deleteConfirmId.value = id
}

const cancelDelete = () => {
  deleteConfirmId.value = null
}

const handleDelete = async (id: string) => {
  try {
    await store.deleteDocument(id)
    await loadData()
    deleteConfirmId.value = null
    emit('updated')
  } catch {
    // Error handled by store
  }
}

const toggleActive = async (doc: ListDocumentRequired) => {
  try {
    await store.toggleActive(doc.id)
    // Update local state
    const index = documents.value.findIndex((d) => d.id === doc.id)
    if (index !== -1) {
      documents.value[index].is_active = !documents.value[index].is_active
    }
    emit('updated')
  } catch {
    // Error handled by store
  }
}

// Watch for modal open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadData()
      showForm.value = false
      resetForm()
    }
  },
)

onMounted(() => {
  if (props.isOpen) {
    loadData()
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
      @click.self="emit('close')"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b gap-2 sm:gap-4 shrink-0"
        >
          <h3 class="text-lg sm:text-xl font-bold text-gray-800">
            <i class="fas fa-file-alt text-orange-500 mr-2"></i>
            Gestion des documents requis
          </h3>
          <div class="flex items-center gap-2">
            <button
              v-if="!showForm"
              @click="openAddForm"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              <i class="fas fa-plus"></i>
              <span class="hidden sm:inline">Nouveau</span>
            </button>
            <button
              @click="emit('close')"
              class="text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
          <!-- Form View -->
          <div v-if="showForm" class="p-3 sm:p-4">
            <div class="flex items-center gap-2 mb-4">
              <button
                @click="closeForm"
                class="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i class="fas fa-arrow-left"></i>
              </button>
              <h4 class="text-lg font-semibold text-gray-700">
                {{ isEditMode ? 'Modifier le document' : 'Nouveau document' }}
              </h4>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Nom -->
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nom du document <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Ex: Passeport valide"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
                    :class="{ 'border-red-500': errors.name }"
                  />
                  <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
                </div>

                <!-- Guide -->
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Guide / Instructions
                  </label>
                  <textarea
                    v-model="form.guide"
                    rows="2"
                    placeholder="Ex: Passeport valable au moins 6 mois apres la date de retour."
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
                  ></textarea>
                </div>

                <!-- Categorie -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Categorie <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.category"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
                    :class="{ 'border-red-500': errors.category }"
                  >
                    <option v-for="cat in categories" :key="cat" :value="cat">
                      {{ formatCategoryName(cat) }}
                    </option>
                  </select>
                  <p v-if="errors.category" class="text-red-500 text-xs mt-1">
                    {{ errors.category }}
                  </p>
                </div>

                <!-- Taille max -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Taille max (Mo) <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.number="form.max_size_mb"
                    type="number"
                    min="1"
                    max="50"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
                    :class="{ 'border-red-500': errors.max_size_mb }"
                  />
                  <p v-if="errors.max_size_mb" class="text-red-500 text-xs mt-1">
                    {{ errors.max_size_mb }}
                  </p>
                </div>

                <!-- Types de fichier -->
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Types de fichiers <span class="text-red-500">*</span>
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="type in availableFileTypes"
                      :key="type"
                      type="button"
                      @click="toggleFileType(type)"
                      class="px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors"
                      :class="
                        form.file_types.includes(type)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      "
                    >
                      .{{ type }}
                    </button>
                  </div>
                  <p v-if="errors.file_types" class="text-red-500 text-xs mt-1">
                    {{ errors.file_types }}
                  </p>
                </div>

                <!-- Options -->
                <div class="sm:col-span-2 flex flex-wrap items-center gap-4 sm:gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="form.is_required"
                      type="checkbox"
                      class="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
                    />
                    <span class="text-sm text-gray-700">Obligatoire</span>
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
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                <button
                  type="button"
                  @click="closeForm"
                  class="w-full sm:w-auto px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full sm:w-auto px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm"
                >
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                  {{ isEditMode ? 'Enregistrer' : 'Ajouter' }}
                </button>
              </div>
            </form>
          </div>

          <!-- List View -->
          <div v-else class="p-3 sm:p-4">
            <!-- Filters -->
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
              <div class="flex-1">
                <div class="relative">
                  <i
                    class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  ></i>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher..."
                    class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
                  />
                </div>
              </div>
              <select
                v-model="selectedCategory"
                class="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
              >
                <option value="all">Toutes les categories</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ formatCategoryName(cat) }}
                </option>
              </select>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="flex items-center justify-center py-10">
              <i class="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
            </div>

            <!-- Empty -->
            <div
              v-else-if="filteredDocuments.length === 0"
              class="text-center py-10 text-gray-500"
            >
              <i class="fas fa-folder-open text-4xl mb-3 text-gray-300"></i>
              <p>Aucun document trouve</p>
            </div>

            <!-- Documents List -->
            <div v-else class="space-y-4">
              <div
                v-for="(docs, category) in groupedDocuments"
                :key="category"
                class="border rounded-lg overflow-hidden"
              >
                <div class="bg-orange-50 px-3 py-2 font-semibold text-orange-700 text-sm">
                  <i class="fas fa-folder mr-2"></i>
                  {{ formatCategoryName(category as string) }}
                  <span class="text-orange-500 font-normal">({{ docs.length }})</span>
                </div>

                <div class="divide-y">
                  <div
                    v-for="doc in docs"
                    :key="doc.id"
                    class="p-3 hover:bg-gray-50 transition-colors"
                    :class="{ 'opacity-50': !doc.is_active }"
                  >
                    <!-- Mobile Layout -->
                    <div class="sm:hidden space-y-2">
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-medium text-gray-800 text-sm">{{ doc.name }}</span>
                            <span
                              v-if="doc.is_required"
                              class="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded"
                            >
                              Requis
                            </span>
                            <span
                              v-if="!doc.is_active"
                              class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              Inactif
                            </span>
                          </div>
                          <p v-if="doc.guide" class="text-xs text-gray-500 mt-1 line-clamp-2">
                            {{ doc.guide }}
                          </p>
                          <div class="flex flex-wrap gap-1 mt-1">
                            <span
                              v-for="ft in doc.file_types"
                              :key="ft"
                              class="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded"
                            >
                              .{{ ft }}
                            </span>
                            <span class="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-xs rounded">
                              {{ doc.max_size_mb }} Mo
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center justify-end gap-1 pt-2 border-t">
                        <button
                          @click="toggleActive(doc)"
                          class="p-2 rounded-lg transition-colors"
                          :class="
                            doc.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          "
                          :title="doc.is_active ? 'Desactiver' : 'Activer'"
                        >
                          <i :class="doc.is_active ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
                        </button>
                        <button
                          @click="openEditForm(doc)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          v-if="deleteConfirmId !== doc.id"
                          @click="confirmDelete(doc.id)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                        <div v-else class="flex items-center gap-1">
                          <button
                            @click="handleDelete(doc.id)"
                            class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Confirmer
                          </button>
                          <button
                            @click="cancelDelete"
                            class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            Non
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Desktop Layout -->
                    <div class="hidden sm:flex items-center gap-4">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="font-medium text-gray-800">{{ doc.name }}</span>
                          <span
                            v-if="doc.is_required"
                            class="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded"
                          >
                            Requis
                          </span>
                          <span
                            v-if="!doc.is_active"
                            class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            Inactif
                          </span>
                        </div>
                        <p v-if="doc.guide" class="text-xs text-gray-500 mt-0.5 truncate">
                          {{ doc.guide }}
                        </p>
                      </div>

                      <div class="flex items-center gap-1 shrink-0">
                        <span
                          v-for="ft in doc.file_types"
                          :key="ft"
                          class="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded"
                        >
                          .{{ ft }}
                        </span>
                        <span class="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-xs rounded">
                          {{ doc.max_size_mb }} Mo
                        </span>
                      </div>

                      <div class="flex items-center gap-1 shrink-0">
                        <button
                          @click="toggleActive(doc)"
                          class="p-1.5 rounded-lg transition-colors"
                          :class="
                            doc.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          "
                          :title="doc.is_active ? 'Desactiver' : 'Activer'"
                        >
                          <i :class="doc.is_active ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
                        </button>
                        <button
                          @click="openEditForm(doc)"
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          v-if="deleteConfirmId !== doc.id"
                          @click="confirmDelete(doc.id)"
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                        <div v-else class="flex items-center gap-1">
                          <button
                            @click="handleDelete(doc.id)"
                            class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Oui
                          </button>
                          <button
                            @click="cancelDelete"
                            class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            Non
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="mt-4 pt-4 border-t text-center text-sm text-gray-500">
              {{ filteredDocuments.length }} document(s)
              <span v-if="selectedCategory !== 'all' || searchQuery">
                sur {{ documents.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
