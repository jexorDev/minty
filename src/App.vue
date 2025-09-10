<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { useCategoryStore } from './stores/CategoryStore';
import CategoryService from './data/services/CategoryService';

const categoryStore = useCategoryStore();

  onMounted(async () => {
    categoryStore.categories = await new CategoryService().getMultiple();
  })
</script>
