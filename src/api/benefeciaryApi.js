import apiClient from '../axios';

export const BENEFECIARY_API = {
    ENDPOINTS: {
        SAVE_NEW_BENEFECIARY: '/admin/save-new-benefeciary',
        FETCH_ALL_BENEFECIARIES: '/admin/all-benefeciaries',
        UPDATE_BENEFECIARY_INFO: '/admin/update-benef',
    },

    // Create
    async saveNewBenefApi(benefeciaryData) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await apiClient.post(
                this.ENDPOINTS.SAVE_NEW_BENEFECIARY,
                benefeciaryData,
                config
            );

            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[BENEFECIARY_API] Error saving benefeciary:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to save benefeciary'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    // Read
    async fetchAllBenefApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                this.ENDPOINTS.FETCH_ALL_BENEFECIARIES,
                config
            );

            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[BENEFECIARY_API] Error fetching benefeciaries:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch benefeciaries'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    // Update
    async updateBenefInfoApi(benef) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            if (!benef.benefeciary_id) {
                throw new Error('Benefeciary ID is required for update');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await apiClient.put(
                `${this.ENDPOINTS.UPDATE_BENEFECIARY_INFO}/${benef.benefeciary_id}`,
                benef,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[BENEFECIARY_API] Error updating product:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to update product'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },
};