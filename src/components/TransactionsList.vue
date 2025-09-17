<template>
        <v-list>
          <v-list-item v-for="transaction in props.transactions" :key="transaction.pk" @click="selectedTransaction = transaction">
            <v-list-item-title>{{ transaction.description }}</v-list-item-title>
            <v-list-item-subtitle>{{ transaction.categoryName }}</v-list-item-subtitle>
            <v-list-item-subtitle class="font-italic mt-1">{{ transaction.notes }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-list-item-action class="flex-column align-end">
                <small>{{ formatDate(transaction.transactionDate) }}</small>
                <div>{{ transaction.amount }}</div>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
</template> 
<script setup lang="ts">
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import dayjs from 'dayjs';

const selectedTransaction = defineModel<TransactionSearch | null>("selectedTransaction");

const props = defineProps<{
  transactions: TransactionSearch[]
}>();


  function formatDate(date: string | Date): string {
    return dayjs(date).format("MM/DD/YYYY")
  }

async function save() {

}
</script>