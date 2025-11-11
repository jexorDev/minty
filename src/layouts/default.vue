<template>
  <v-main>    
    <v-dialog v-model="errorStore.show">
      <v-card color="error" title="An error occurred">        
        <template v-slot:append>
          <v-icon icon="mdi-close" @click="errorStore.show = false"></v-icon>
        </template>        
        <v-card-text>
          {{ errorStore.error }}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="errorStore.show = false">Dismiss</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
     <v-snackbar
     :color="snackbarStore.type"
      v-model="snackbarStore.show"
    >
      {{ snackbarStore.message }}

      <template v-slot:actions>
        <v-btn          
          variant="text"
          @click="snackbarStore.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="confirmationStore.show" max-width="600">
      <v-card color="info" title="Confirm">
        <template v-slot:append>
          <v-icon icon="mdi-help-circle-outline" size="x-large"></v-icon>
        </template>
        <v-card-text>
          {{ confirmationStore.confirmationMessage }}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmationStore.show=false" variant="tonal">Cancel</v-btn>
          <v-btn @click="confirmationStore.executeConfirmationFunction" variant="outlined">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
   
      <v-app-bar 
        v-if="$vuetify.display.mobile" 
        scroll-behavior="fully-hide"
        density="compact"
        color="primary">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      
      </v-app-bar>
    <v-navigation-drawer
    v-model="drawer"
        :expand-on-hover="!$vuetify.display.mobile"
        :rail="!$vuetify.display.mobile"
      >
        <v-list>
          <v-list-item
            prepend-icon="mdi-account"            
            :title="username"            
          >
          
        </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>          
          <v-list-item prepend-icon="mdi-view-dashboard-variant-outline" title="Dashboard" value="dashboard" to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-invoice-list-outline" title="Transactions" value="transactions" to="/transactions"></v-list-item>
          <v-list-item prepend-icon="mdi-chart-areaspline" title="Statistics" value="stats" to="/statistics"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="Settings" value="settings" to="/settings"></v-list-item>
        </v-list>

        <v-list>
          <v-list-item prepend-icon="mdi-exit-run" @click="logout" title="Log Out">            
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <router-view/>

    </v-main>    

  <!-- <AppFooter /> -->
</template>

<script lang="ts" setup>
import router from '@/router';
import { useDisplay } from 'vuetify';
import { useCategoryStore } from '../stores/CategoryStore';
import CategoryService from '../data/services/CategoryService';
import { useMerchantStore } from '../stores/MerchantStore';
import { useAccountStore } from '../stores/AccountStore';
import MerchantService from '../data/services/MerchantService';
import AccountService from '../data/services/AccountService';
import { useErrorStore } from '@/stores/ErrorStore';
import { useSnackbarStore } from '@/stores/SnackbarStore';
import { useConfirmationStore } from '@/stores/ConfirmationStore';
import { useUserSettingsStore } from '@/stores/UserSettingsStore';

const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();
const errorStore = useErrorStore();
const snackbarStore = useSnackbarStore();
const confirmationStore = useConfirmationStore();
const userSettingsStore = useUserSettingsStore();

const { mobile } = useDisplay()

const drawer = ref(!mobile.value);
const username = ref("");

onMounted(async () => {
  const jwtToken = localStorage.getItem('authToken');
  if (jwtToken) {
    const res = getJwtPayload(jwtToken);
    username.value = res;

    await Promise.all([
      categoryStore.categories = await new CategoryService().getMultiple(),
      merchantStore.merchants = await new MerchantService().getMultiple(),
      accountStore.accounts = await new AccountService().getMultiple(),
      await userSettingsStore.refreshUserSettings()
    ]);
  }
})

function logout(): void {
  localStorage.removeItem('authToken');
  router.push("/login");
}

function getJwtPayload(token: string): string {
  try {
    // Split the token into its three parts: header, payload, and signature
    const parts = token.split('.');

    // The payload is the second part (index 1)
    const base64UrlPayload = parts[1];

    // Replace URL-safe characters with standard Base64 characters
    const base64 = base64UrlPayload.replace(/-/g, '+').replace(/_/g, '/');

    // Decode the Base64 string
    const decodedPayload = atob(base64);

    // Parse the JSON string into a JavaScript object
    const payloadObject = JSON.parse(decodedPayload)['Username'];

    return payloadObject;
  } catch (error) {
    console.error("Error decoding JWT payload:", error);
    return "";
  }
}
</script>
