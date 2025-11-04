<template>
    <div v-if="selectedAccount">
        <div class="text-overline">Name</div>
        <v-text-field v-model="selectedAccount.name"></v-text-field> 
    </div>
</template>
<script lang="ts" setup>
import type Account from '@/data/interfaces/Account';

const selectedAccount = defineModel<Account>("account");

</script>