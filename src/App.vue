<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { useCategoryStore } from './stores/CategoryStore';
import CategoryService from './data/services/CategoryService';
import { useMerchantStore } from './stores/MerchantStore';
import { useAccountStore } from './stores/AccountStore';
import MerchantService from './data/services/MerchantService';
import AccountService from './data/services/AccountService';

const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();

  onMounted(async () => {
    categoryStore.categories = await new CategoryService().getMultiple();
    merchantStore.merchants = await new MerchantService().getMultiple();
    accountStore.accounts = await new AccountService().getMultiple();
  })
</script>
