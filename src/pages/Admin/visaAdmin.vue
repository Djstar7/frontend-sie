<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <header class="flex justify-between items-center mb-6 border-b pb-4 border-orange-200">
      <h1 class="text-4xl font-extrabold text-orange-600">
        <i class="fas fa-list-alt text-orange-500 mr-2"></i> Gestion des Éligibilités de Visa
      </h1>
      <button
        @click="goToCreate"
        class="bg-orange-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-orange-400 transition duration-150 flex items-center gap-2 font-semibold"
      >
        <i class="fas fa-plus"></i> Nouvelle Éligibilité
      </button>
    </header>

    <div class="mb-6 bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Rechercher par Pays ou Type de Visa..."
        class="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-150"
      />
      <span class="text-sm text-gray-500 ml-auto">
        Total: {{ filteredEligibilities.length }} / {{ allEligibilities.length }}
      </span>
    </div>

    <div v-if="loading" class="text-center py-10 text-xl text-orange-400">
      <i class="fas fa-spinner fa-spin mr-2"></i> Chargement des données...
    </div>

    <div v-else-if="allEligibilities.length === 0" class="text-center py-10 bg-white rounded-xl shadow-md">
      <i class="fas fa-box-open text-gray-400 text-4xl mb-3"></i>
      <p class="text-gray-600">Aucune éligibilité de visa trouvée. Commencez par en créer une.</p>
    </div>

    <div v-else-if="filteredEligibilities.length === 0" class="text-center py-10 bg-white rounded-xl shadow-md">
      <i class="fas fa-search-minus text-gray-400 text-4xl mb-3"></i>
      <p class="text-gray-600">Aucun résultat ne correspond à votre recherche.</p>
    </div>

    <div v-else class="shadow-xl rounded-xl overflow-hidden bg-white">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-orange-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de Visa</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Âge</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="visa in paginatedEligibilities" :key="visa.id" class="hover:bg-gray-50 transition duration-100 cursor-pointer" @click="goToShow(visa.id)">
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ visa.country || 'N/A' }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ visa.visa_type || 'N/A' }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm">
              <span class="px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-700">
                {{ visa.status_mat ? (statusMap.get(visa.status_mat) || visa.status_mat) : 'N/A' }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ visa.min_age }} - {{ visa.max_age }} ans</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-orange-500 font-semibold">{{ formatCurrency(visa.price_base) }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-3 text-xl">
                <button @click.stop="goToEdit(visa.id)" class="text-blue-600 hover:text-blue-700 transition" title="Éditer">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click.stop="confirmDelete(visa.id)" class="text-red-600 hover:text-red-700 transition" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="totalPages > 1"
      class="flex justify-between items-center mt-6 px-4 py-3 bg-white rounded-lg shadow-md border border-gray-200"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 border rounded-full text-orange-600 border-orange-300 disabled:opacity-50 hover:bg-orange-50 transition font-medium flex items-center gap-2"
      >
        <i class="fas fa-arrow-left"></i> Précédent
      </button>
      <span class="text-gray-500 font-semibold">
        Page {{ currentPage }} / {{ totalPages }}
        <span class="text-sm text-gray-500 ml-2">({{ filteredEligibilities.length }} résultats)</span>
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border rounded-full text-orange-600 border-orange-300 disabled:opacity-50 hover:bg-orange-50 transition font-medium flex items-center gap-2"
      >
        Suivant <i class="fas fa-arrow-right"></i>
      </button>
    </div>

    <DeleteModalCustom
      v-if="isDeleteModalOpen"
      :confirm-text="'document d\'éligibilité'"
      :message="'Cette liste de document d\'éligibilité'"
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useVisaEligibilityStore } from '@/stores/useVisaEligibilityStore';
import DeleteModalCustom from '@/components/DeleteModalCustom.vue';
import { statusMap } from '@/utils/dataMap';

const router = useRouter();
const store = useVisaEligibilityStore();

const { allEligibilities } = storeToRefs(store);

const isDeleteModalOpen = ref(false);
const itemToDeleteId = ref<string | null>(null);
const loading = ref(true);

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 20;

const filteredEligibilities = computed(() => {
    if (!searchTerm.value) {
        return allEligibilities.value;
    }

    const searchLower = searchTerm.value.toLowerCase();

    return allEligibilities.value.filter(visa => {
        const countryMatch = visa.country?.toLowerCase().includes(searchLower);
        const visaTypeMatch = visa.visa_type?.toLowerCase().includes(searchLower);

        return countryMatch || visaTypeMatch;
    });
});

const totalPages = computed(() => Math.ceil(filteredEligibilities.value.length / itemsPerPage));

const paginatedEligibilities = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredEligibilities.value.slice(start, end);
});

watch(filteredEligibilities, () => {
    currentPage.value = 1;
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const loadData = async () => {
    loading.value = true;
    try {
        await store.getVisaEligibilities();
    } catch (e) {
      console.error(e);
    }finally{
        loading.value = false;
    }
};

onMounted(() => {
    loadData();
});

const goToCreate = () => {
    router.push({ name: 'admin.visa.add' });
};
const goToEdit = (id: string) => {
    router.push({ name: 'admin.visa.edit', params: { id } });
};
const goToShow = (id: string) => {
    router.push({ name: 'admin.visa.show', params: { id } });
};

const confirmDelete = (id: string) => {
    itemToDeleteId.value = id;
    isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
    if (itemToDeleteId.value) {
        try {
            await store.deleteEligibility(itemToDeleteId.value);
        } catch (e) {
          console.error(e);
        }
    }
    isDeleteModalOpen.value = false;
    itemToDeleteId.value = null;
};

const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};
</script>
