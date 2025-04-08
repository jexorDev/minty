<template>
    <v-container class="fill-height">
      <v-responsive>
        <v-autocomplete :items="autoCompleteObjects" chip item-title="text" item-value="text" variant="underlined" density="compact">
          <template v-slot:chip="{ props, item }" >
                  <v-chip
                    v-bind="props"                  
                    :text="item.raw.text"
                  ></v-chip>
                </template>
  
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"      
                    :subtitle="item.raw.type"
                    :title="item.raw.text"
                  ></v-list-item>
                </template>
        </v-autocomplete>
        <v-data-table-virtual :headers="headers" :items="transactions" fixed-header></v-data-table-virtual>
        <v-fab :app="true" @click="showAddTransactionDialog = true" icon="mdi-plus"></v-fab>
    </v-responsive>
</v-container>
<DialogBase title="Add Transaction" @close="showAddTransactionDialog = false" :show="showAddTransactionDialog">
    <TransactionAddForm></TransactionAddForm>
</DialogBase>
  </template>
  
  <script setup lang="ts">
  import type Transaction from '@/data/interfaces/Transactions/Transaction';
  import type Category from '@/data/interfaces/Category';
  import TransactionsService from '@/data/services/TransactionsService';
  import CategoryService from '@/data/services/CategoryService';
  
  
  
  interface CategoryTotal {
    category: string;
    total: number;
  }
  
  interface AutoCompleteObject {
    type: string;
    text: string;
    value: number | string;
  }
  
  const transactions = ref<Transaction[]>([]);
  const categoryTotals = ref<CategoryTotal[]>([]);
  const categories = ref<Category[]>([]);
  const selectedFilter = ref<AutoCompleteObject | null>(null);
  const fromDate = ref(Date.now().toString())
  const showAddTransactionDialog = ref(false);
  
  const headers = ref([
    {title: 'Date', key: 'transactionDate'},
    {title: 'Description', key: 'description'},
    {title: 'Category', key: 'categoryName'},
    {title: 'Amount', key: 'amount'},
  
  ]);
  
  onMounted(async () => {
    transactions.value = await new TransactionsService().getMultiple("fromDate=1/1/2018&toDate=12/31/2018");
    // new TransactionsService().post({
    //   transactionDate: new Date(),
    //   description: "ca ca poo poo",
    //   amount: 69.69,
    //   notes: "i just shit mah pantz",
    //   exclude: false,
    //   categoryId: null,
    //   subcategoryId: null,
    //   merchantId: null,
    //   accountId: null
    // });
    categories.value = await new CategoryService().getMultiple("");
  });
  
  const transactionDescriptions = computed<string[]>(() => [...new Set(transactions.value.map(x => x.description))]);
  const autoCompleteObjects = computed<AutoCompleteObject[]>(() => [...categories.value.map(x => {
    return {
      type: "Category",
      text: x.name,
      value: x.pk
    }
  }), ...transactionDescriptions.value.map(x => {
    return {
      type: "",
      text: x,
      value: x
    }
  } )]);
  
  function sumCategories() {
    //categoryTotals.value = [...new Set(transactions.value.map(x => x.Category))].map(y => {category: y; total: 0});
    //console.log([...new Set(transactions.value.map(x => x.Category))].map(y => {'category': y; 'total': 0}));
    categoryTotals.value.push({category: 'Poop', total: 69});
  }
  </script>
  
  