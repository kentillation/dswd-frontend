import { defineStore } from 'pinia';
import { BENEFECIARY_API } from '@/api/benefeciaryApi';

export const useBenefeciaryStore = defineStore('products', {
    state: () => ({
        allBenefeciaries: [],
        productAlone: '',
        loading: false,
        error: null
    }),

    actions: {
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
                this.error = 'Failed to fetch benefeciaries';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchProductAloneStore(branchId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await BENEFECIARY_API.fetchProductAloneApi(branchId);
                if (response && response.status === true) {
                    this.productAlone = response.data;
                } else {
                    throw new Error(response?.message || 'Failed to fetch product alone');
                }
            } catch (error) {
                console.error('Error in fetchProductAloneApi:', error);
                this.error = error.message || 'Failed to fetch product alone';
                throw error;
            } finally {
                this.loading = false;
            }
        },

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
                console.error('Error in saveNewBenefApi:', error);
                this.error = 'Failed to save benefeciary';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateProductStore(product) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.updateProductApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.updateProductApi(product);
                if (response && (response.status === true || response.status === "true" || response.status === 1)) {
                    return response;
                } else {
                    throw new Error('Failed to save product');
                }
            } catch (error) {
                console.error('Error in updateProductApi:', error);
                this.error = 'Failed to save product';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateIngredientStore(ingredient) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.updateIngredientApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.updateIngredientApi(ingredient);
                if (response && (response.status === true || response.status === "true" || response.status === 1)) {
                    return response;
                } else {
                    throw new Error('Failed to save ingredient');
                }
            } catch (error) {
                console.error('Error in updateIngredientApi:', error);
                this.error = 'Failed to save ingredient';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});