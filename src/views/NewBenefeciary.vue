<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h2>Add New Benefeciary</h2>
        <v-form ref="benefeciaryForm" @submit.prevent="showConfirmDialog">
            <v-row class="mt-5">
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-text-field v-model="firstName" label="First name" :rules="[v => !!v || 'Required']"
                        variant="outlined" placeholder="e.g. Jose" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-text-field v-model="middleName" label="Middle name"
                        :rules="[v => !!v || 'Required']" variant="outlined" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-text-field v-model="lastName" label="Last name" :rules="[v => !!v || 'Required']"
                        variant="outlined" placeholder="e.g. Rizal" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-autocomplete v-model="benefGender" @click="getbenefGenderOption" label="Gender"
                        :items="benefGenderOption" :rules="[v => !!v || 'Required']" item-title="gender_label"
                        item-value="gender_id" variant="outlined" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-text-field v-model="benefAge" label="Age" :rules="[v => !!v || 'Required']"
                        variant="outlined" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-text-field v-model="addressLine1" label="Address Line 1"
                        :rules="[v => !!v || 'Required']" variant="outlined" placeholder="e.g. Purok Paghidaet" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-text-field v-model="addressLine2" label="Address Line 2"
                        :rules="[v => !!v || 'Required']" variant="outlined" placeholder="e.g. Barangay Pob. II" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-text-field v-model="addressLine3" label="Address Line 3"
                        :rules="[v => !!v || 'Required']" variant="outlined" placeholder="e.g. Sagay City" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-text-field v-model="contactNumber" label="Contact number"
                        :rules="[v => !isNaN(parseFloat(v)) || 'Required' || 'Must be a valid number']"
                        @input="e => contactNumber = e.target.value.replace(/[^0-9.]/g, '')" variant="outlined" />
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-autocomplete v-model="benefBloodType" @click="getBenefBloodTypeOption"
                        label="Blood type" :items="benefBloodTypeOption" :rules="[v => !!v || 'Required']"
                        item-title="bloodtype_label" item-value="bloodtype_id" variant="outlined" />
                </v-col>

                <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                    <v-autocomplete v-model="benefCategory" @click="getBenefCategoryOption"
                        label="Category" :items="benefCategoryOption" :rules="[v => !!v || 'Required']"
                        item-title="category_label" item-value="category_id" variant="outlined" />
                </v-col>

            </v-row>
            <!-- <v-container class="parent rounded my-3 pb-1 mx-auto"></v-container> -->
            <v-row>
                <v-col cols="12">
                    <v-btn color="green" variant="tonal" prepend-icon="mdi-check"
                        :disabled="!isFormValid || validatingBenefeciary" @click="showConfirmDialog">
                        Confirm
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <v-dialog v-model="confirmDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center">Do you want to save new benefeciary?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="tonal" class="px-3" prepend-icon="mdi-close"
                        @click="closeConfirmDialog">Check
                        again</v-btn>
                    <v-btn color="green" variant="tonal" class="px-3" prepend-icon="mdi-content-save"
                        @click="submitForm">
                        <v-progress-circular v-if="validatingBenefeciary" size="20" color="white" label="Loading..."
                            indeterminate />
                        <span v-else>Save</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Snackbar ref="snackbarRef" />
        <LoaderUI :visible="validatingBenefeciary" message="Saving..." />
    </v-container>
</template>

<script>
import apiClient from '../axios';
import Snackbar from '@/components/Snackbar.vue';
import LoaderUI from '@/components/LoaderUI.vue';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'NewBenefeciary',
    components: {
        Snackbar,
        LoaderUI
    },
    data() {
        return {
            referenceNumber: '',
            validatingBenefeciary: false,
            confirmDialog: false,
            firstName: '',
            middleName: '',
            lastName: '',
            benefAge: '',
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            contactNumber: '',
            benefGender: null,
            benefBloodType: null,
            benefCategory: null,
            benefGenderOption: [],
            benefBloodTypeOption: [],
            benefCategoryOption: [],
        };
    },
    setup() {
        const benefeciaryStore = useBenefeciaryStore();
        return { benefeciaryStore };
    },
    computed: {
        newRefNumber() {
            return this.generateReferenceNumber();
        },
        isFormValid() {
            return (
                this.firstName &&
                this.middleName &&
                this.lastName &&
                this.benefAge &&
                this.addressLine1 &&
                this.addressLine2 &&
                this.addressLine3 &&
                this.contactNumber &&
                this.benefGender &&
                this.benefBloodType &&
                this.benefCategory
            );
        },
    },
    methods: {
        async generateReferenceNumber() {
            const generatedNumber = Math.random().toString().slice(2, 14);
            console.log('Generated Reference Number:', generatedNumber);
            return generatedNumber;
        },
        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
        },
        closeConfirmDialog() {
            this.confirmDialog = false;
        },
        async submitForm() {
            this.confirmDialog = false;
            try {
                if (!this.$refs.benefeciaryForm.validate()) return;
                this.validatingBenefeciary = true;
                const payload = {
                    first_name: this.firstName,
                    middle_name: this.middleName,
                    last_name: this.lastName,
                    benef_age: this.benefAge,
                    address_line1: this.addressLine1,
                    address_line2: this.addressLine2,
                    address_line3: this.addressLine3,
                    contact_number: this.contactNumber,
                    gender_id: this.benefGender,
                    bloodtype_id: this.benefBloodType,
                    category_id: this.benefCategory,
                };
                await this.benefeciaryStore.saveNewBenefStore(payload);
                this.validatingBenefeciary = false;
                this.showSuccess("New benefeciary successfully saved!");
                this.$refs.benefeciaryForm.reset();
            } catch (error) {
                this.validatingBenefeciary = false;
                this.showError(error);
                console.error(error);
            }
        },
        async getOptions(endpoint, targetArray, errorMessage) {
            try {
                const response = await apiClient.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                this[targetArray] = response.data;
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar(errorMessage, 'error');
            }
        },
        getbenefGenderOption() {
            this.getOptions('/admin/gender-option', 'benefGenderOption', 'Failed to fetch gender');
        },
        getBenefBloodTypeOption() {
            this.getOptions('/admin/blood-type-option', 'benefBloodTypeOption', 'Failed to fetch blood type');
        },
        getBenefCategoryOption() {
            this.getOptions('/admin/category-option', 'benefCategoryOption', 'Failed to fetch category');
        },
        showError(message) {
            this.$refs.snackbarRef.showSnackbar(message, "error");
        },
        showSuccess(message) {
            this.$refs.snackbarRef.showSnackbar(message, "success");
        },
    },

};
</script>

<style scoped>
.parent {
    display: flex;
    flex-wrap: wrap;
}

.child {
    min-width: 270px;
    max-width: 500px;
    margin-left: 8px;
    margin-right: 8px;
}

/* .child:nth-last-child(1) {
    max-width: 500px;
} */
</style>