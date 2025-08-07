<template>
  <v-app dark>
    <div v-if="connectionStatus !== 'online'" class="connection-container">
      <div class="connection-banner" :class="connectionStatus">
        <v-icon left>
          {{ connectionStatusIcon }}
        </v-icon>
        <span>&nbsp;{{ connectionStatusText }}</span>
      </div>
    </div>
    <v-main>
      <template v-if="!isNotFoundPage">
        <v-app-bar v-if="showMenu" prominent>
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <span><strong>DSWD</strong></span>
          <v-spacer></v-spacer>
          <v-btn icon>
            <!-- <v-badge 
              content="" 
              class="position-absolute" 
              style="top: 10px; right: 12px;" 
              color="error">
            </v-badge> -->
            <v-icon>mdi-bell-outline</v-icon>
          </v-btn>
          <v-btn class="ms-0" icon>
            <v-icon @click="toSettings">mdi-account-circle-outline</v-icon>
          </v-btn>
        </v-app-bar>
        <v-navigation-drawer class="h-screen pa-3" v-model="drawer" v-if="showSidebar">
          <v-list density="compact" nav>
            <v-list-subheader size="30">Menu</v-list-subheader>
            <v-list-item prepend-icon="mdi-home-outline" @click="toHome" class="ps-3">Home</v-list-item>
            <v-list-item prepend-icon="mdi-account-group-outline" @click="toAllBenef" class="ps-3">All Benefeciaries</v-list-item>
            <v-list-item prepend-icon="mdi-account-cog-outline" @click="toSettings" class="ps-3">Settings</v-list-item>
            <v-list-item prepend-icon="mdi-information-outline" @click="toAbout" class="ps-3">About</v-list-item>
            <v-list-item prepend-icon="mdi-help-circle-outline" @click="toHelp" class="ps-3">Help</v-list-item>
            <v-divider class="mt-4"></v-divider>
            <v-list-item prepend-icon="mdi-power" v-if="showLogout" @click="authStore.logout"
              class="ps-3 mt-2">Signout</v-list-item>
          </v-list>
        </v-navigation-drawer>
      </template>
      <v-layout>
        <router-view />
        <GlobalLoader />
        <Alert ref="snackbarRef" />
      </v-layout>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { useRoute } from 'vue-router';
import GlobalLoader from '@/components/GlobalLoader.vue';
import Alert from '@/components/Alert.vue';

export default {
  name: 'App',
  data() {
    return {
    }
  },
  components: {
    GlobalLoader,
    Alert,
  },
  setup() {
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();
    const connectionStatus = ref('online');
    const route = useRoute();
    const isNotFoundPage = computed(() => route.name === 'NotFound');
    const updateStatus = () => {
      if (!navigator.onLine) {
        connectionStatus.value = 'offline';
      } else {
        connectionStatus.value = 'online';
      }
    };

    let waitingTimeout;
    const simulateWaiting = () => {
      connectionStatus.value = 'waiting';
      waitingTimeout = setTimeout(() => {
        connectionStatus.value = navigator.onLine ? 'online' : 'offline';
      }, 3000);
    };

    onMounted(async () => {
      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);
      simulateWaiting();
      if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
          if (navigator.connection.downlink < 1) {
            connectionStatus.value = 'slow';
          } else if (navigator.onLine) {
            connectionStatus.value = 'online';
          }
        });
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (waitingTimeout) clearTimeout(waitingTimeout);
    });

    const connectionStatusText = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'No internet connection';
        case 'slow':
          return 'Low internet connection';
        case 'waiting':
          return 'Waiting for connection...';
        default:
          return '';
      }
    });

    const connectionStatusIcon = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'mdi-wifi-off';
        case 'slow':
          return 'mdi-wifi-alert';
        case 'waiting':
          return 'mdi-timer-sand';
        default:
          return '';
      }
    });

    return {
      authStore,
      loadingStore,
      drawer: ref(true),
      open: ref(false),
      connectionStatus,
      connectionStatusText,
      connectionStatusIcon,
      isNotFoundPage
    };
  },
  computed: {
    showSidebar() {
      return this.$route.name !== 'LoginPage' && !this.isNotFoundPage;
    },
    showLogout() {
      return this.$route.name !== 'LoginPage' && !this.isNotFoundPage;
    },
    showMenu() {
      return this.$route.name !== 'LoginPage' && !this.isNotFoundPage;
    },
    themeText() {
      return this.theme.global.name.value === 'light' ? 'Dark Mode' : 'Light Mode';
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(newRoute) {
        if (this.authStore.isAuthenticated && newRoute.name !== 'LoginPage') {
          console.log("Logged in!")
        }
      }
    }
  },
  methods: {
    toHome() {
      this.$router.push('/home');
    },

    toAllBenef() {
      this.$router.push('/all-benefeciaries');
    },

    toSettings() {
      this.$router.push('/settings');
    },

    toHelp() {
      this.$router.push('/help');
    },

    toAbout() {
      this.$router.push('/about');
    },
  }
};
</script>
