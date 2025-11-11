<template>
        <v-list>
          <v-list-item 
            v-for="transaction in props.transactions" 
            :key="transaction.pk" 
            @click="emits('selectedTransactionChanged', transaction)"
            :class="transaction.categoryReportingType === 0 ? '' : 'text-disabled'">
            <template v-slot:prepend>
              <v-icon v-if="transaction.splitId" icon="mdi-source-fork"></v-icon>
            </template>
            <v-list-item-title>{{ transaction.description }}</v-list-item-title>
            <v-list-item-subtitle>{{ transaction.categoryId === null ? "UNCATEGORIZED" : transaction.categoryName }}</v-list-item-subtitle>
            <v-list-item-subtitle class="font-italic mt-1">{{ transaction.notes }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-list-item-action class="flex-column align-end">
                <small>{{ formatDate(transaction.transactionDate) }}</small>
                <div :class="transaction.categoryType === CategoryTypeEnum.Income.value ? 'text-primary' : ''">{{ formatAmount(transaction.amount, transaction.categoryType ?? CategoryTypeEnum.Expense.value) }}</div>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
</template> 
<script setup lang="ts">
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import { NumberFormats, formatNumber } from '@/utilities/NumberFormattingUtility';
import { formatDate } from '@/utilities/DateFormattingUtility';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';

const props = defineProps<{
  transactions: TransactionSearch[]
}>();

const emits = defineEmits<{
  (e: "selectedTransactionChanged", value: TransactionSearch): void
}>();

function formatAmount(amount: number, categoryType: number): string {
  if (categoryType === CategoryTypeEnum.Transfer.value) {
    amount = Math.abs(amount);
  } else if (categoryType === CategoryTypeEnum.Income.value) {
    amount *= -1;
  }

  return formatNumber(amount, NumberFormats.Price);
}

</script>