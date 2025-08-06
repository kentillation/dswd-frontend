import apiClient from '../axios';

export const BENEFECIARY_API = {
    ENDPOINTS: {
        FETCH_ALL_BENEFECIARIES: '/admin/all-benefeciaries',
        FETCH_PRODUCT_ALONE: '/admin/product-alone',
        SAVE_NEW_BENEFECIARY: '/admin/save-new-benefeciary',
        SAVE_PRODUCT_INGREDIENTS: '/admin/save-product-ingredients',
        UPDATE: '/admin/update-product',
        UPDATE_PRODUCT_INGREDIENTS: '/admin/update-product-ingredients'
    },

    /**
     * Products Information
     * @param {string|number} branchId - ID of the branch to fetch products for
     * @returns {Promise<Object>} Products data for the branch
     * @throws {Error} Enhanced error with server response details
     */

    async fetchProductAloneApi(producId) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            let endpoint = `${this.ENDPOINTS.FETCH_PRODUCT_ALONE}/${producId}`;
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[fetchProductsOnlyApi] Error fetching sales:', error);
            throw error;
        }
    },

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

    async updateProductApi(product) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            if (!product.product_id) {
                throw new Error('Product ID is required for update');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await apiClient.put(
                `${this.ENDPOINTS.UPDATE}/${product.product_id}`,
                product,
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

    async updateIngredientApi(ingredient) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            if (!ingredient.product_ingredient_id) {
                throw new Error('Product Ingredient ID is required for update');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await apiClient.put(
                `${this.ENDPOINTS.UPDATE_PRODUCT_INGREDIENTS}/${ingredient.product_ingredient_id}`,
                ingredient,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[BENEFECIARY_API] Error updating ingredient:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to update ingredient'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    }
};