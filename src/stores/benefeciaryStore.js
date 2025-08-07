import { defineStore } from 'pinia';
import { BENEFECIARY_API } from '@/api/benefeciaryApi';

export const useBenefeciaryStore = defineStore('products', {
    state: () => ({
        allBenefeciaries: [],
        loading: false,
        error: null
    }),

    actions: {

        // Create
        async saveNewBenefStore(benefeciaryData) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.saveNewBenefApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.saveNewBenefApi(benefeciaryData);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save benefeciary');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Read
        async fetchAllBenefStore() {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchAllBenefApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchAllBenefApi();
                if (response && response.status === true) {
                    this.allBenefeciaries = response.data;
                } else {
                    throw new Error('Failed to fetch benefeciaries');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Update
        async updateBenefInfoStore(benefeciaryData) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.updateBenefInfoApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.updateBenefInfoApi(benefeciaryData);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save benefeciary info');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

    },
});