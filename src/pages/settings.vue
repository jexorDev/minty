<template>
  <div :class="$vuetify.display.mobile ? '' : 'd-flex flex-row'">
      <v-tabs
        v-model="tab"
        color="primary"
        :direction="$vuetify.display.mobile ? 'horizontal': 'vertical'"
      >
        <v-tab prepend-icon="mdi-sitemap-outline" text="Categories" value="category"></v-tab>
        <v-tab prepend-icon="mdi-point-of-sale" text="Merchants" value="merchant"></v-tab>
        <v-tab prepend-icon="mdi-bank" text="Accounts" value="account"></v-tab>
        <v-tab prepend-icon="mdi-file-document-check-outline" value="imported-files" text="Imported Files"></v-tab>
      </v-tabs>

      <v-container fluid>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="category">     
            <SettingsManagementCategory v-if="tab === 'category'"></SettingsManagementCategory>
          </v-tabs-window-item>
          <v-tabs-window-item value="merchant">
            <SettingsManagementMerchants v-if="tab === 'merchant'"></SettingsManagementMerchants>
          </v-tabs-window-item>
          <v-tabs-window-item value="account">
            <SettingsManagementAccount v-if="tab === 'account'"></SettingsManagementAccount>
          </v-tabs-window-item>        
          <v-tabs-window-item value="imported-files">
            <ImportedFiles></ImportedFiles>
          </v-tabs-window-item>
        </v-tabs-window>     
    </v-container>      
  </div>
</template>
<script setup lang="ts">
import router from "@/router";

const tab = ref("category");

onMounted(() => {
  if (router.currentRoute.value.query.merchantId) {
    tab.value = "merchant";
  } else if (router.currentRoute.value.query.accountId) {
    tab.value = "account";
  }
});

</script>
<style scoped>
.main-list-scroll {
  max-height: 97vh;
  overflow: auto;
}
.inner-list-scroll {
  max-height: 75vh;
  overflow: auto;
}
</style>