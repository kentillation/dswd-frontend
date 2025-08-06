<template>
    <v-row>
        <v-col cols="12" lg="4" md="4" sm="6">
            <v-text-field  density="comfortable"
                v-model="searchProduct" 
                placeholder="Search product here..." 
                variant="outlined" 
                label="Search product"></v-text-field>
        </v-col>
    </v-row>
    <v-data-table 
        :headers="productHeaders" 
        :items="filteredProducts" 
        :loading="loading" 
        :items-per-page="10"
        class="elevation-1 hover-table"
        density="comfortable">
        <template v-slot:top>
            <v-toolbar flat>
                <h2 class="ms-4 to-hide">List of all Products</h2>
                <h2 class="ms-4 to-show">List</h2>
                <v-spacer></v-spacer>
                <AddProductDialog v-model="addProductDialog" />
                <v-btn @click="openAddProductDialog" :disabled="loading" prepend-icon="mdi-plus" color="#0090b6"
                    class="me-2" variant="flat">
                    <span class="to-hide">Add products</span>
                    <span class="to-show">products</span>
                </v-btn>
                <v-btn @click="$emit('refresh')" :loading="loading" icon="mdi-refresh" color="#0090b6" variant="flat"
                    size="small" class="me-3"></v-btn>
            </v-toolbar>

            <v-divider></v-divider>
        </template>

        <!--eslint-disable-next-line -->
        <!-- <template v-slot:item.select="{ item }">
            <v-checkbox v-model="item.selected" :value="true" color="primary"
                class="d-flex justify-center"></v-checkbox>
        </template> -->

        <!--eslint-disable-next-line -->
        <template v-slot:item.product_name="{ item }">
            <span :class="item.availability_id === 2 ? 'text-red' : ''">
                {{ item.product_name }}
            </span>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.temp_label="{ item }">
            <span :class="item.availability_id === 2 ? 'text-red' : ''">
                {{ item.temp_label }}
            </span>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.size_label="{ item }">
            <span :class="item.availability_id === 2 ? 'text-red' : ''">
                {{ item.size_label }}
            </span>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.display_product_price="{ item }">
            <span :class="item.availability_id === 2 ? 'text-red' : ''">
                {{ item.display_product_price }}
            </span>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.category_label="{ item }">
            <span :class="item.availability_id === 2 ? 'text-red' : ''">
                {{ item.category_label }}
            </span>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.updated_at="{ item }">
            <span :class="item.availability_id === 2 ? 'text-red' : ''">
                {{ item.updated_at }}
            </span>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.availability_label="{ item }">
            <v-chip :color="item.availability_id === 2 ? 'red' : 'green'" size="small" variant="tonal">
                {{ item.availability_label }}
            </v-chip>
        </template>

        <!--eslint-disable-next-line -->
        <template v-slot:item.actions="{ item }">
            <div class="d-flex" style="gap: 8px;">
                <v-tooltip text="View Ingredients" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" @click="$emit('view-ingredients', item)" color="blue" variant="tonal"
                            size="small" icon="mdi-eye-outline"></v-btn>
                    </template>
                </v-tooltip>

                <v-tooltip text="Edit Product" location="top">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" @click="$emit('edit-product', item)" color="green" variant="tonal"
                            size="small" icon="mdi-pencil"></v-btn>
                    </template>
                </v-tooltip>
            </div>
        </template>

        <template v-slot:no-data>
            <v-alert type="warning" variant="tonal" class="ma-4">
                <span>&nbsp; No products found for this branch.</span>
            </v-alert>
        </template>

        <template v-slot:loading>
            <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
        </template>
    </v-data-table>
</template>

<script>
import { useLoadingStore } from '@/stores/loading';
import AddProductDialog from '@/components/AddProductDialog.vue';

export default {
    name: 'ProductsTable',
    data() {
        return {
            searchProduct: '',
            addProductDialog: false,
            productHeaders: [
                { title: '', value: 'select', width: '5%' },
                { title: 'Product', value: 'product_name', sortable: true, width: '20%' },
                { title: 'Temp', value: 'temp_label', sortable: true, width: '10%' },
                { title: 'Size', value: 'size_label', sortable: true, width: '10%' },
                { title: 'Price', value: 'display_product_price', sortable: true, width: '10%' },
                { title: 'Category', value: 'category_label', sortable: true, width: '10%' },
                { title: 'Availability', value: 'availability_label', sortable: true, width: '15%' },
                { title: 'Last update', value: 'updated_at', sortable: true, width: '20%' },
                { title: '', value: 'actions', sortable: false, width: '15%' }
            ],
        };
    },
    components: {
        AddProductDialog,
    },
    props: {
        products: {
            type: Array,
            required: true,
            // default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        shopId: {
            type: Number,
            required: true
        },
        branchId: {
            type: Number,
            required: true
        },
        branchName: {
            type: String,
            required: true
        },
        error: {
            type: [String, Error, null],
            default: null
        }
    },
    emits: [
        'refresh',
        'edit-product',
        'view-ingredients',
    ],
    computed: {
        filteredProducts() {
            if (!this.searchProduct) {
                return this.products;
            }
            return this.products.filter(product =>
                product.product_name.toLowerCase().includes(this.searchProduct.toLowerCase())
            );
        },
        // hasCheck() {
        //     return !this.products.some(item => item.selected);
        // }
    },
    setup() {
        const loadingStore = useLoadingStore();
        return {
            loadingStore,
        };
    },
    methods: {
        openAddProductDialog() {
            this.$router.push({
                path: '/add-product/',
                query: {
                    shop_id: this.shopId,
                    branch_id: this.branchId,
                    branch_name: this.branchName,
                }
            });
            // this.addProductDialog = true;
        },
        // toEditPage() {
        //     this.$router.push({
        //         path: '/edit-products/',
        //         query: {
        //             shop_id: this.products.shop_id,
        //             branch_id: this.products.branchId,
        //             branch_name: this.branchName,
        //             product_id: this.products.product_id
        //         }
        //     });
        // }
    }
}
</script>

<style scoped>
.hover-table:deep(.v-data-table__tr:hover) {
    background-color: rgba(0, 0, 0, 0.04);
}

.to-hide {
    display: inline;
}

.to-show {
    display: none;
}

@media (max-width: 768px) {
    .to-hide {
        display: none;
    }

    .to-show {
        display: inline;
    }
}
</style>