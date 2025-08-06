import { defineStore } from 'pinia';
import apiClient from '@/axios';

export const useBenefOptionStore = defineStore('benefOption', {
    state: () => ({
        benefGenderOption: [],
        benefBloodTypeOption: [],
        benefCategoryOption: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        // Optional: Add getters if you need computed properties
        getBenefGenderOption: (state) => state.benefGenderOption,
        getBenefBloodTypeOption: (state) => state.benefBloodTypeOption,
        getBenefCategoryOption: (state) => state.benefCategoryOption,
    },

    actions: {
        async fetchOptions(endpoint) {
            try {
                const response = await apiClient.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                return response.data;
            } catch (error) {
                this.error = error;
                console.error(`Failed to fetch options from ${endpoint}:`, error);
                throw error;
            }
        },
        async fetchAllOptions() {
            this.isLoading = true;
            try {
                const [genders, bloodtypes, categories] = await Promise.all([
                    this.fetchOptions('/admin/gender-option'),
                    this.fetchOptions('/admin/blood-type-option'),
                    this.fetchOptions('/admin/category-option'),
                ]);
                this.benefGenderOption = genders;
                this.benefBloodTypeOption = bloodtypes;
                this.benefCategoryOption = categories;
            } catch (error) {
                this.error = error;
                console.error('Failed to fetch all options:', error);
            } finally {
                this.isLoading = false;
            }
        },
    },
});