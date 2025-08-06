<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <v-btn @click="this.fetchAllBenef" color="#01a79e" size="small" class="refresh" variant="flat" icon>
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <h2>
            <span class="to-hide">List of Benefeciaries</span>
            <span class="to-show">List</span>
        </h2>
        <div class="d-flex justify-space-around mt-3">
            <v-row>
                <v-col cols="12" lg="8" md="10" sm="10">
                    <v-text-field density="compact" v-model="searchName" placeholder="e.g Juan Dela Cruz"
                        variant="outlined" label="Search name"></v-text-field>
                </v-col>
            </v-row>
            <div>
                <v-btn color="red" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3" prepend-icon="mdi-printer">
                    <span class="to-hide">PDF</span>
                    <span class="to-show"></span>
                </v-btn>
                <v-btn color="green" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3"
                    prepend-icon="mdi-download">
                    <span class="to-hide">XLS</span>
                    <span class="to-show"></span>
                </v-btn>
                <v-btn @click="toNewBenef" color="blue" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3"
                    prepend-icon="mdi-plus">
                    <span class="to-hide">Add Benefeciary</span>
                    <span class="to-show"></span>
                </v-btn>
            </div>
        </div>
        <v-card>
            <v-card-text>
                <v-data-table :headers="headersBenef" :items="allBenef" :loading="loadingAllBenef" density="comfortable"
                    height="400px">

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.category_label="{ item }">
                        <v-chip :color="item.category_id === 1 ? 'red' : 'green'" size="small" variant="tonal">
                            {{ item.category_label }}
                        </v-chip>
                    </template>

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.actions="{ item }">
                        <div class="d-flex" style="gap: 8px;">
                            <v-tooltip text="View Info" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn @click="viewDialogInfo(item)" v-bind="props" color="blue" variant="tonal"
                                        size="small" icon="mdi-information-outline"></v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="View Digital ID" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn @click="viewDialogID(item)" v-bind="props" color="blue" variant="tonal"
                                        size="small" icon="mdi-qrcode"></v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </template>

                    <template v-slot:no-data>
                        <v-alert type="warning" variant="tonal" class="ma-4">
                            <span>&nbsp; No record found.</span>
                        </v-alert>
                    </template>

                </v-data-table>
            </v-card-text>
        </v-card>

        <v-dialog v-model="dialogInfo" width="1000">
            <v-btn @click="dialogInfo = false" color="#01a79e" class="position-absolute" size="small"
                style="top: -17px; right: -17px; z-index: 10;" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card class="mb-5">
                <v-card-title>Benefeciary Info</v-card-title>
                <v-card-text>
                    <v-row class="my-5">
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-text-field v-model="this.firstName" label="First name" :rules="[v => !!v || 'Required']"
                                variant="outlined" placeholder="e.g. Jose" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-text-field v-model="this.middleName" label="Middle name"
                                :rules="[v => !!v || 'Required']" variant="outlined" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-text-field v-model="this.lastName" label="Last name" :rules="[v => !!v || 'Required']"
                                variant="outlined" placeholder="e.g. Rizal" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-autocomplete v-model="this.benefGender" @click="getbenefGenderOption" label="Gender"
                                :items="benefGenderOption" :rules="[v => !!v || 'Required']" item-title="gender_label"
                                item-value="gender_id" variant="outlined" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-text-field v-model="this.benefAge" label="Age" :rules="[v => !!v || 'Required']"
                                variant="outlined" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-text-field v-model="this.addressLine1" label="Address Line 1"
                                :rules="[v => !!v || 'Required']" variant="outlined"
                                placeholder="e.g. Purok Paghidaet" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-text-field v-model="this.addressLine2" label="Address Line 2"
                                :rules="[v => !!v || 'Required']" variant="outlined"
                                placeholder="e.g. Barangay Pob. II" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-text-field v-model="this.addressLine3" label="Address Line 3"
                                :rules="[v => !!v || 'Required']" variant="outlined" placeholder="e.g. Sagay City" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-text-field v-model="this.contactNumber" label="Contact number"
                                :rules="[v => !isNaN(parseFloat(v)) || 'Required' || 'Must be a valid number']"
                                @input="e => contactNumber = e.target.value.replace(/[^0-9.]/g, '')"
                                variant="outlined" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-autocomplete v-model="this.benefBloodType" @click="getBenefBloodTypeOption"
                                label="Blood type" :items="benefBloodTypeOption" :rules="[v => !!v || 'Required']"
                                item-title="bloodtype_label" item-value="bloodtype_id" variant="outlined" />
                        </v-col>

                        <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                            <v-autocomplete v-model="this.benefCategory" @click="getBenefCategoryOption"
                                label="Category" :items="benefCategoryOption" :rules="[v => !!v || 'Required']"
                                item-title="category_label" item-value="category_id" variant="outlined" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-btn color="green" variant="tonal" prepend-icon="mdi-check"
                                :disabled="!isFormValid || validatingBenefeciary" @click="showConfirmDialog">
                                Confirm
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogID" class="dialog-id" width="650">
            <v-btn @click="dialogID = false" color="#01a79e" class="position-absolute" size="small"
                style="top: -17px; left: -17px; z-index: 10;" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card class="bg-grey-lighten-3">
                <v-card-title class="ms-2">Benefeciary Digital ID</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-card class="mb-3 pa-4">
                            <div class="text-center d-flex flex-column">
                                <h4>REPUBLIKA NG PILIPINAS</h4>
                                <h6>Republic of the Philippines</h6>
                                <h3>DSWD DIGITAL IDENTIFICATION CARD</h3>
                            </div>
                            <div class="mt-4 d-flex justify-space-between">
                                <div class="d-flex">
                                    <v-card class="border">
                                        <h1 style="font-size: 105px;"><v-icon>mdi-account</v-icon></h1>
                                    </v-card>
                                    <div class="ms-3 d-flex flex-column">
                                        <h6><em>Apelyido / Lastname</em></h6>
                                        <h4>{{ this.lastName }}</h4>
                                        <h6><em>Mga Pangalan / Given Names</em></h6>
                                        <h4>{{ this.firstName }}</h4>
                                        <h6><em>Gitnang Apelyido / Middle Name</em></h6>
                                        <h4>{{ this.middleName }}</h4>
                                        <h6><em>Numero ng Telepono / Cellphone Number</em></h6>
                                        <h4>{{ this.contactNumber }}</h4>
                                    </div>
                                </div>
                                <div>
                                    <v-card class="border">
                                        <h1 style="font-size: 105px;"><v-icon>mdi-qrcode</v-icon></h1>
                                    </v-card>
                                </div>
                            </div>
                            <h6><em>Tirahan / Address</em></h6>
                            <h4>{{ this.addressLine1 }}, {{ this.addressLine2 }}, {{ this.addressLine3 }}</h4>
                        </v-card>
                        <v-card class="pa-4">
                            <div class="d-flex justify-space-around">
                                <div class="ms-2 mt-6 d-flex flex-column">
                                    <h6><em>Kasarian / Sex</em></h6>
                                    <h4>{{ this.benefGender }}</h4>
                                    <h6><em>Uri ng dugo / Blood Type</em></h6>
                                    <h4>{{ this.benefBloodType }}</h4>
                                    <h6><em>Kategorya / Category</em></h6>
                                    <h4>{{ this.benefCategory }}</h4>
                                </div>
                                <div>
                                    <v-card>
                                        <h1 style="font-size: 120px;"><v-icon>mdi-qrcode</v-icon></h1>
                                    </v-card>
                                </div>
                            </div>
                        </v-card>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
    <Alert ref="alertRef" />
</template>

<script>
import apiClient from '../axios';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useLoadingStore } from '@/stores/loading';
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'AllBenefeciaries',
    components: {
        Alert,
    },
    data() {
        return {
            searchName: '',
            loadingAllBenef: false,
            dialogInfo: false,
            dialogID: false,
            benefeciaries: [],
            headersBenef: [
                { title: 'Category', value: 'category_label', width: '15%' },
                { title: 'Name_of_benefeciary', value: 'display_name', width: '20%' },
                { title: 'Age', value: 'benef_age', width: '10%' },
                { title: 'Contact', value: 'contact_number', width: '15%' },
                { title: 'Last_update', value: 'updated_at', width: '20%' },
                { title: '', value: 'actions', sortable: false, width: '10%' }
            ],
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
        }
    },
    setup() {
        const benefeciaryStore = useBenefeciaryStore();
        const loadingStore = useLoadingStore();
        const currentDate = new Date().toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        const formatCurrentDate = currentDate.replace(/,/g, '');
        return { benefeciaryStore, loadingStore, formatCurrentDate };
    },
    mounted() {
        this.fetchAllBenef();
    },
    computed: {
        allBenef() {
            if (!this.searchName) {
                return this.benefeciaries;
            }
            return this.benefeciaries.filter(benef =>
                benef.first_name.toLowerCase().includes(this.searchName.toLowerCase())
            );
        },
    },
    methods: {
        toNewBenef() {
            this.$router.push('/new-benefeciary');
        },
        async fetchAllBenef() {
            this.loadingAllBenef = true;
            this.loadingStore.show('');
            try {
                await this.benefeciaryStore.fetchAllBenefStore();
                this.benefeciaries = this.benefeciaryStore.allBenefeciaries;
                if (this.benefeciaries && this.benefeciaries.length > 0) {
                    this.benefeciaries = this.benefeciaries.map(order => this.formatallBenef(order));
                } else {
                    this.showAlert("No benefeciaries found!");
                }
                this.loadingAllBenef = false;
            } catch (error) {
                console.error(error);
                this.showAlert(error);
            } finally {
                this.loadingAllBenef = false;
                this.loadingStore.hide();
            }
        },

        viewDialogInfo(details) {
            this.dialogInfo = true;
            this.firstName = details.first_name;
            this.middleName = details.middle_name;
            this.lastName = details.last_name;
            this.benefAge = details.benef_age;
            this.addressLine1 = details.address_line1;
            this.addressLine2 = details.address_line2;
            this.addressLine3 = details.address_line3;
            this.contactNumber = details.contact_number;
            this.benefGender = details.gender_label;
            this.benefBloodType = details.bloodtype_label;
            this.benefCategory = details.category_label;
        },

        viewDialogID(details) {
            this.dialogID = true;
            this.firstName = details.first_name;
            this.middleName = details.middle_name;
            this.lastName = details.last_name;
            this.benefAge = details.benef_age;
            this.addressLine1 = details.address_line1;
            this.addressLine2 = details.address_line2;
            this.addressLine3 = details.address_line3;
            this.contactNumber = details.contact_number;
            this.benefGender = details.gender_label;
            this.benefBloodType = details.bloodtype_label;
            this.benefCategory = details.category_label;
        },

        formatallBenef(benef) {
            return {
                ...benef,
                display_name: `${benef.first_name} ${benef.middle_name} ${benef.last_name}` || '',
                updated_at: benef.updated_at ? this.formatDateTime(benef.updated_at) : 'N/A',
            };
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

        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Manila'
            });
        },
        showAlert(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "error");
        },
    }
};
</script>

<style scoped>
.dialog-id h3,
.dialog-id h4,
.dialog-id h5,
.dialog-id h6 {
    color: #0c0c0c;
}

.refresh {
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 1;
}
</style>