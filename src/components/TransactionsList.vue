<template>
        <v-list>
          <v-list-item v-for="transaction in props.transactions" :key="transaction.pk" @click="emits('selectedTransactionChanged', transaction)">
            <template v-slot:prepend>
              <v-icon v-if="transaction.splitId" icon="mdi-source-fork"></v-icon>
            </template>
            <v-list-item-title>{{ transaction.description }}</v-list-item-title>
            <v-list-item-subtitle>{{ transaction.categoryName }}</v-list-item-subtitle>
            <v-list-item-subtitle class="font-italic mt-1">{{ transaction.notes }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-list-item-action class="flex-column align-end">
                <small>{{ formatDate(transaction.transactionDate) }}</small>
                <div>{{ formatNumber(transaction.amount, NumberFormats.Price) }}</div>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
</template> 
<script setup lang="ts">
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import { NumberFormats, formatNumber } from '@/utilities/NumberFormattingUtility';
import { formatDate } from '@/utilities/DateFormattingUtility';

const props = defineProps<{
  transactions: TransactionSearch[]
}>();

const emits = defineEmits<{
  (e: "selectedTransactionChanged", value: TransactionSearch): void
}>();

</script>