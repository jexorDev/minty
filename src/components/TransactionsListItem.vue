<template>
  <v-list-item   
    :key="props.transaction.pk" 
    @click="emits('selectedTransactionChanged', transaction)"
    :class="props.transaction.categoryIgnore ? 'text-disabled' : ''">
    <template v-slot:prepend>
      <v-icon v-if="props.transaction.splitId" icon="mdi-source-fork"></v-icon>
    </template>
    <v-list-item-title>{{ props.transaction.description }}</v-list-item-title>
    <v-list-item-subtitle>
      <v-icon v-if="props.transaction.categoryId === null" icon="mdi-alert" color="warning"></v-icon>
      {{ props.transaction.categoryId === null ? "UNCATEGORIZED" : props.transaction.categoryName }}</v-list-item-subtitle>
    <v-list-item-subtitle class="font-italic mt-1">{{ props.transaction.notes }}</v-list-item-subtitle>
    <template v-slot:append>
      <v-list-item-action class="flex-column align-end">
        <small>{{ formatDate(props.transaction.transactionDate) }}</small>
        <div :class="props.transaction.categoryType === CategoryTypeEnum.Income.value ? 'text-primary' : ''">{{ formatAmount(props.transaction.amount, props.transaction.categoryType ?? CategoryTypeEnum.Expense.value) }}</div>
      </v-list-item-action>
    </template>
  </v-list-item>
</template> 
<script setup lang="ts">
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import { NumberFormats, formatNumber } from '@/utilities/NumberFormattingUtility';
import { formatDate } from '@/utilities/DateFormattingUtility';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';

const props = defineProps<{
  transaction: TransactionSearch
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