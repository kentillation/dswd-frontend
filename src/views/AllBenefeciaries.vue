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
                        <v-chip :color="Number(item.category_id) === 1 ? 'orange' : Number(item.category_id) === 2 ? 'blue' : undefined" size="small" variant="tonal">
                            {{ item.category_label }}
                        </v-chip>
                    </template>

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.benef_status_id="{ item }">
                        <v-chip :color="Number(item.benef_status_id) === 1 ? 'green' : 'red'" size="small" variant="flat">
                            {{ item.benef_status_id === 1 ? 'Active' : 'Inactive' }}
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

        <!-- Benefeciary Info -->
        <v-dialog v-model="dialogInfo" width="1000">
            <v-btn @click="dialogInfo = false" color="#01a79e" class="position-absolute" size="small"
                style="top: -17px; right: -17px; z-index: 10;" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card class="mb-5">
                <v-card-title>Benefeciary Info</v-card-title>
                <v-card-text>
                    <v-form ref="benefeciaryForm" @submit.prevent="showConfirmDialog">
                        <v-row class="my-5">
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.first_name" label="First name"
                                    :rules="[v => !!v || 'Required']" variant="outlined" placeholder="e.g. Jose" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.middle_name" label="Middle name"
                                    :rules="[v => !!v || 'Required']" variant="outlined" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.last_name" label="Last name"
                                    :rules="[v => !!v || 'Required']" variant="outlined" placeholder="e.g. Rizal" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.suffix" label="Suffix"
                                    :rules="[v => !!v || 'Required']" variant="outlined" placeholder="e.g. II, III, IV, V, Sr., Jr." />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedBenef.gender_id" label="Gender"
                                    :items="benefGenderOption" :rules="[v => !!v || 'Required']"
                                    item-title="gender_label" item-value="gender_id" variant="outlined" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.benef_age" label="Age"
                                    :rules="[v => !!v || 'Required']" variant="outlined" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.address_line1" label="Address Line 1"
                                    :rules="[v => !!v || 'Required']" variant="outlined"
                                    placeholder="e.g. Purok Paghidaet" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.address_line2" label="Address Line 2"
                                    :rules="[v => !!v || 'Required']" variant="outlined"
                                    placeholder="e.g. Barangay Pob. II" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.address_line3" label="Address Line 3"
                                    :rules="[v => !!v || 'Required']" variant="outlined"
                                    placeholder="e.g. Sagay City" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.contact_number" label="Contact number"
                                    :rules="[v => !isNaN(parseFloat(v)) || 'Required' || 'Must be a valid number']"
                                    @input="e => selectedBenef.contact_number = e.target.value.replace(/[^0-9.]/g, '')"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedBenef.bloodtype_id" label="Blood type"
                                    :items="benefBloodTypeOption" :rules="[v => !!v || 'Required']"
                                    item-title="bloodtype_label" item-value="bloodtype_id" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedBenef.category_id" label="Category"
                                    :items="benefCategoryOption" :rules="[v => !!v || 'Required']"
                                    item-title="category_label" item-value="category_id" variant="outlined" />
                            </v-col>
                        </v-row>
                        <v-btn color="green" variant="tonal" prepend-icon="mdi-check" :disabled="!isFormValid"
                            @click="showConfirmDialog">Confirm
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Confirm Dialog for Benefeciary Info Modification -->
        <v-dialog v-model="confirmDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center">Do you want to save benefeciary info?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="tonal" class="px-3" prepend-icon="mdi-close"
                        @click="closeConfirmDialog">Check
                        again</v-btn>
                    <v-btn color="green" variant="tonal" class="px-3" prepend-icon="mdi-content-save"
                        @click="confirmUpdateBenef">Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Digital ID -->
        <v-dialog v-model="dialogID" class="dialog-id" width="650">
            <v-btn @click="dialogID = false" color="#01a79e" class="position-absolute" size="small"
                style="top: -17px; left: -17px; z-index: 10;" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card class="bg-grey-lighten-1">
                <v-card-title class="ms-2">Benefeciary Digital ID</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-card class="mb-3 pa-4 bg-grey-lighten-4">
                            <div class="text-center d-flex flex-column">
                                <h4>REPUBLIKA NG PILIPINAS</h4>
                                <h6>Republic of the Philippines</h6>
                                <h3 style="color: #01a79e">DSWD DIGITAL IDENTIFICATION CARD</h3>
                            </div>
                            <div class="mt-4">
                                <h6 class="text-grey"><em>Numero ng ID / ID Number</em></h6>
                                <h4>{{ this.selectedBenef.reference_number }}</h4>
                            </div>
                            <div class="d-flex justify-space-between">
                                <div class="d-flex">
                                    <!-- <img :src="benefImage" width="150" height="150" alt="Benefeciary Image" class="pa-2"> -->
                                     <h1 style="font-size: 100px; color: #01a79e"><v-icon>mdi-account-circle-outline</v-icon></h1>
                                    <div class="ms-3 d-flex flex-column">
                                        <h6 class="text-grey"><em>Apelyido / Lastname</em></h6>
                                        <h4>{{ this.selectedBenef.last_name }}</h4>
                                        <h6 class="text-grey"><em>Mga Pangalan / Given Names</em></h6>
                                        <h4>{{ this.selectedBenef.first_name }}</h4>
                                        <h6 class="text-grey"><em>Gitnang Apelyido / Middle Name</em></h6>
                                        <h4>{{ this.selectedBenef.middle_name }}</h4>
                                        <h6 class="text-grey"><em> / Suffix</em></h6>
                                        <h4>{{ this.selectedBenef.suffix }}</h4>
                                    </div>
                                </div>
                                <div>
                                    <h1 style="font-size: 100px;"><v-icon>mdi-qrcode</v-icon></h1>
                                </div>
                            </div>
                            <h6 class="text-grey"><em>Tirahan / Address</em></h6>
                            <h4>{{ this.selectedBenef.address_line1 }}, {{ this.selectedBenef.address_line2 }}, {{ this.selectedBenef.address_line3 }}</h4>
                        </v-card>
                        <v-card class="pa-4 bg-grey-lighten-4">
                            <div class="d-flex justify-space-around">
                                <div class="ms-2 mt-6 d-flex flex-column">
                                    <h6 class="text-grey"><em>Telepono / Cellphone</em></h6>
                                        <h4>{{ this.selectedBenef.contact_number }}</h4>
                                    <h6 class="text-grey"><em>Kasarian / Sex</em></h6>
                                    <h4>{{ this.selectedBenef.gender_label }}</h4>
                                    <h6 class="text-grey"><em>Uri ng dugo / Blood Type</em></h6>
                                    <h4>{{ this.selectedBenef.bloodtype_label }}</h4>
                                    <h6 class="text-grey"><em>Kategorya / Category</em></h6>
                                    <h4>{{ this.selectedBenef.category_label }}</h4>
                                </div>
                                <div>
                                    <h1 style="font-size: 100px;"><v-icon>mdi-qrcode</v-icon></h1>
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
import { computed } from 'vue';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useBenefOptionStore } from '@/stores/benefOptionStore';
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
            selectedBenef: null,
            loadingAllBenef: false,
            dialogInfo: false,
            dialogID: false,
            confirmDialog: false,
            benefeciaries: [],
            headersBenef: [
                { title: 'Category', value: 'category_label', width: '15%' },
                { title: 'Name_of_benefeciary', value: 'display_name', width: '20%' },
                { title: 'Age', value: 'benef_age', width: '10%' },
                { title: 'Contact', value: 'contact_number', width: '15%' },
                { title: 'Status', value: 'benef_status_id', width: '20%' },
                { title: 'Last_update', value: 'updated_at', width: '20%' },
                { title: '', value: 'actions', sortable: false, width: '10%' }
            ],
            firstName: '',
            middleName: '',
            lastName: '',
            benefSuffix: '',
            benefAge: '',
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            contactNumber: '',
            benefGender: null,
            benefBloodType: null,
            benefCategory: null,
            benefImage: require('@/assets/logo.svg'),
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
        const benefOption = useBenefOptionStore();
        return {
            benefeciaryStore,
            loadingStore,
            formatCurrentDate,
            benefOption,
            benefGenderOption: computed(() => benefOption.benefGenderOption),
            benefBloodTypeOption: computed(() => benefOption.benefBloodTypeOption),
            benefCategoryOption: computed(() => benefOption.benefCategoryOption),
        };
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
        isFormValid() {
            return (
                this.selectedBenef.first_name &&
                this.selectedBenef.middle_name &&
                this.selectedBenef.last_name &&
                this.selectedBenef.benef_age &&
                this.selectedBenef.address_line1 &&
                this.selectedBenef.address_line2 &&
                this.selectedBenef.address_line3 &&
                this.selectedBenef.contact_number &&
                this.selectedBenef.suffix &&
                this.selectedBenef.gender_id &&
                this.selectedBenef.bloodtype_id &&
                this.selectedBenef.category_id
            );
        },
    },
    methods: {
        toNewBenef() {
            this.$router.push('/new-benefeciary');
        },

        // Read all benefeciary
        async fetchAllBenef() {
            this.loadingAllBenef = true;
            this.loadingStore.show('');
            try {
                await this.benefeciaryStore.fetchAllBenefStore();
                this.benefeciaries = this.benefeciaryStore.allBenefeciaries;
                if (this.benefeciaries && this.benefeciaries.length > 0) {
                    this.benefeciaries = this.benefeciaries.map(order => this.formatallBenef(order));
                } else {
                    this.showError("No benefeciaries found!");
                }
                this.loadingAllBenef = false;
            } catch (error) {
                console.error(error);
                this.showError(error);
            } finally {
                this.loadingAllBenef = false;
                this.loadingStore.hide();
            }
        },

        viewDialogInfo(details) {
            this.benefOption.fetchAllOptions();
            this.selectedBenef = { ...details };
            this.dialogInfo = true;
            const gender = this.benefGenderOption.find(g => g.gender_id === Number(details.gender_id));
            const bloodtype = this.benefBloodTypeOption.find(b => b.bloodtype_id === Number(details.bloodtype_id));
            const category = this.benefCategoryOption.find(c => c.category_id === Number(details.category_id));
            return {
                gender_label: gender?.gender_label,
                bloodtype_label: bloodtype?.bloodtype_label,
                category_label: category?.category_label,
            };
        },

        // Update benefeciary
        async confirmUpdateBenef() {
            this.confirmDialog = false;
            this.dialogInfo = false;
            if (!this.$refs.benefeciaryForm.validate()) return;
            if (!this.selectedBenef || !this.selectedBenef.benefeciary_id) {
                this.showError("Invalid benefeciary data!");
                return;
            }
            try {
                const now = new Date();
                const formattedDate = now.toISOString();
                const benefData = {
                    benefeciary_id: this.selectedBenef.benefeciary_id,
                    first_name: this.selectedBenef.first_name?.trim(),
                    middle_name: this.selectedBenef.middle_name?.trim(),
                    last_name: this.selectedBenef.last_name?.trim(),
                    benef_age: Number(this.selectedBenef.benef_age),
                    address_line1: this.selectedBenef.address_line1?.trim(),
                    address_line2: this.selectedBenef.address_line2?.trim(),
                    address_line3: this.selectedBenef.address_line3?.trim(),
                    contact_number: this.selectedBenef.contact_number?.trim(),
                    suffix: this.selectedBenef.suffix?.trim(),
                    gender_id: Number(this.selectedBenef.gender_id),
                    bloodtype_id: Number(this.selectedBenef.bloodtype_id),
                    category_id: Number(this.selectedBenef.category_id),
                };
                const benefDataWithUpdatedAt = {
                    benefeciary_id: this.selectedBenef.benefeciary_id,
                    first_name: this.selectedBenef.first_name?.trim(),
                    middle_name: this.selectedBenef.middle_name?.trim(),
                    last_name: this.selectedBenef.last_name?.trim(),
                    benef_age: Number(this.selectedBenef.benef_age),
                    address_line1: this.selectedBenef.address_line1?.trim(),
                    address_line2: this.selectedBenef.address_line2?.trim(),
                    address_line3: this.selectedBenef.address_line3?.trim(),
                    contact_number: this.selectedBenef.contact_number?.trim(),
                    suffix: this.selectedBenef.suffix?.trim(),
                    gender_id: Number(this.selectedBenef.gender_id),
                    bloodtype_id: Number(this.selectedBenef.bloodtype_id),
                    category_id: Number(this.selectedBenef.category_id),
                    updated_at: formattedDate,
                };
                await this.benefeciaryStore.updateBenefInfoStore(benefData);
                console.log("Updated benefeciary:", benefData);
                const updatedBenef = this.formatallBenef({ ...this.selectedBenef, ...benefDataWithUpdatedAt });
                const index = this.benefeciaries.findIndex(
                    p => p.benefeciary_id === this.selectedBenef.benefeciary_id
                );
                if (index !== -1) {
                    this.benefeciaries.splice(index, 1, updatedBenef);
                }
                this.loadingStore.hide();
                this.showSuccess("Benefeciary info successfully updated!");
            } catch (error) {
                console.error(error);
                this.showError(error);
            } finally {
                this.loadingStore.hide();
            }
        },

        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
        },

        closeConfirmDialog() {
            this.confirmDialog = false;
        },

        viewDialogID(details) {
            this.benefOption.fetchAllOptions();
            this.selectedBenef = { ...details };
            this.dialogID = true;
            const gender = this.benefGenderOption.find(g => g.gender_id === Number(details.gender_id));
            const bloodtype = this.benefBloodTypeOption.find(b => b.bloodtype_id === Number(details.bloodtype_id));
            const category = this.benefCategoryOption.find(c => c.category_id === Number(details.category_id));
            return {
                gender_label: gender?.gender_label,
                bloodtype_label: bloodtype?.bloodtype_label,
                category_label: category?.category_label,
            };
        },

        formatallBenef(benef) {
            let benefSuffix = benef.suffix;
            if (benefSuffix !== null) {
                benefSuffix = benef.suffix;
            } else {
                benefSuffix = '';
            }
            return {
                ...benef,
                display_name: `${benef.first_name} ${benef.middle_name} ${benef.last_name}  ${benefSuffix}` || '',
                updated_at: benef.updated_at ? this.formatDateTime(benef.updated_at) : 'N/A',
            };
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

        showSuccess(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "success");
        },

        showError(message) {
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