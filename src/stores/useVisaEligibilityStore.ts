import { ref } from 'vue';
import { defineStore } from 'pinia';
import { visaEligibilityService } from '@/services/visaEligibilityService';
import type { VisaFetch, VisaResourceType } from "@/types/visa";
import type { PaginatorResponse } from '@/services/visaEligibilityService';
import { useLoading } from '@/utils/startLoading';
import { toast } from 'vue3-toastify';

export const useVisaEligibilityStore = defineStore('visaEligibility', () => {
    const loading = useLoading();
    const allEligibilities = ref<VisaResourceType[]>([]);
    const selectedEligibility = ref<VisaResourceType | null>(null);
    const error = ref<string | null>(null);

    async function getVisaEligibilities() {
        loading.startLoading('Chargement des éligibilités de visa en cours');
        error.value = null;
        try {
            const response: PaginatorResponse = await visaEligibilityService.getEligibilities();
            allEligibilities.value = response.data;
            return response;
        } catch (err) {
            loading.handleError(err, "Échec de la récupération des éligibilités de visa.");
            error.value = "Échec de la récupération des éligibilités de visa.";
            throw err;
        } finally {
            loading.stopLoading();
        }
    }

    async function getEligibilityDetails(id: string) {
        loading.startLoading('Chargement des détails de l\'éligibilité en cours');
        error.value = null;
        selectedEligibility.value = null;
        try {
            const response = await visaEligibilityService.getEligibilityDetails(id);
            selectedEligibility.value = response.data;
            return response;
        } catch (err) {
            loading.handleError(err, `Échec de la récupération des détails pour l'éligibilité ${id}.`);
            error.value = `Échec de la récupération des détails pour l'éligibilité ${id}.`;
            throw err;
        } finally {
            loading.stopLoading();
        }
    }

    async function createEligibility(data: VisaFetch) {
        loading.startLoading('Création de l\'éligibilité en cours...');
        error.value = null;
        try {
            const response = await visaEligibilityService.createEligibility(data);
            toast.success(response.message || 'Éligibilité créée avec succès');
            return response;
        } catch (err) {
            loading.handleError(err, "Échec de la création de l'éligibilité de visa.");
            error.value = "Échec de la création de l'éligibilité de visa.";
            throw err;
        } finally {
            loading.stopLoading();
        }
    }

    async function updateEligibility(id: string, data: VisaFetch) {
        loading.startLoading('Mise à jour de l\'éligibilité en cours...');
        error.value = null;
        try {
            const response = await visaEligibilityService.updateEligibility(id, data);

            const index = allEligibilities.value.findIndex(e => e.id === id);
            if (index !== -1) {
                allEligibilities.value[index] = response.data;
            }

            if (selectedEligibility.value?.id === id) {
                selectedEligibility.value = response.data;
            }

            toast.success(response.message || 'Éligibilité mise à jour avec succès');
            return response;
        } catch (err) {
            loading.handleError(err, `Échec de la mise à jour de l'éligibilité ${id}.`);
            error.value = `Échec de la mise à jour de l'éligibilité ${id}.`;
            throw err;
        } finally {
            loading.stopLoading();
        }
    }

    async function deleteEligibility(id: string) {
        loading.startLoading('Suppression de l\'éligibilité en cours...');
        try {
            await visaEligibilityService.deleteEligibility(id);
            allEligibilities.value = allEligibilities.value.filter(e => e.id !== id);
            toast.success('Éligibilité supprimée avec succès');
        } catch (err) {
            loading.handleError(err, `Échec de la suppression de l'éligibilité ${id}.`);
            error.value = `Échec de la suppression de l'éligibilité ${id}.`;
            throw err;
        } finally {
            loading.stopLoading();
        }
    }

    return {
        allEligibilities,
        selectedEligibility,
        error,
        getVisaEligibilities,
        getEligibilityDetails,
        createEligibility,
        updateEligibility,
        deleteEligibility,
    };
});
