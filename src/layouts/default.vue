<template>
  <v-main>
    <v-navigation-drawer
        expand-on-hover
        rail
      >
        <v-list>
          <v-list-item
            prepend-icon="mdi-account"
            subtitle="sandra_a88@gmailcom"
            title="Sandra Adams"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>          
          <v-list-item prepend-icon="mdi-view-dashboard-variant-outline" title="Dashboard" value="dashboard" to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-invoice-list-outline" title="Transactions" value="transactions" to="/transactions"></v-list-item>
          <v-list-item prepend-icon="mdi-chart-areaspline" title="Statistics" value="stats"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="Settings" value="settings" to="/settings"></v-list-item>
        </v-list>
      </v-navigation-drawer>
    <router-view />
  </v-main>

  <!-- <AppFooter /> -->
</template>

<script lang="ts" setup>
  //
</script>
