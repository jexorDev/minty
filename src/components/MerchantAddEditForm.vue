<template>
    <div v-if="selectedMerchant">
        <div class="text-overline">Name</div>
        <v-text-field v-model="selectedMerchant.name" variant="outlined" density="compact"></v-text-field>          
    </div>
</template>
<script lang="ts" setup>
import type Merchant from '@/data/interfaces/Merchant';

const selectedMerchant = defineModel<Merchant>("merchant");

</script>