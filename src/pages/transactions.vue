<template>
    <v-container class="fill-height">
      <v-responsive>
        <!-- <v-autocomplete :items="autoCompleteObjects" chip item-title="text" item-value="text" variant="underlined" density="compact">
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
        </v-autocomplete> -->
        <v-card color="secondary-darken-1">
          <v-card-text>
            <v-row>
              <v-col>
                <!-- <v-autocomplete :search="searchString" @update:search="searchUpdate" :items="searchItems" item-title="description" density="compact" no-filter>
                  <template v-slot:item="{props, item}">
                    <v-list-item
                      v-bind="props"                      
                      @click="showAddEditDialog(item.raw)">                      
                      <v-list-item-subtitle>{{ item.raw.categoryName }} | {{ item.raw.transactionDate }}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{ item.raw.notes }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete> -->
                <v-text-field label="Search" @update:model-value="searchUpdate" clearable></v-text-field>
              </v-col>
              <!-- <v-col>
                <v-select label="Year" :items="years" v-model="selectedYear" variant="outlined" density="compact"></v-select>
              </v-col> -->
            </v-row>

          </v-card-text>

        </v-card>
<!--         <v-data-table-virtual :headers="headers" :items="transactions" fixed-header>
          <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="showAddEditDialog(item)"></v-icon>

          
        </div>
      </template>
        </v-data-table-virtual> -->

        <v-list>
          <v-list-item v-for="transaction in transactions" :key="transaction.pk" @click="showAddEditDialog(transaction)">
            <v-list-item-title>{{ transaction.description }}</v-list-item-title>
            <v-list-item-subtitle>{{ transaction.notes }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ transaction.categoryName }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-list-item-action class="flex-column align-end">
                <small>{{ transaction.transactionDate }}</small>
                <div>{{ transaction.amount }}</div>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>

        <v-fab :app="true" @click="showAddEditDialog()" icon="mdi-plus" color="primary"></v-fab>
    </v-responsive>
</v-container>
    <TransactionAddForm v-model="transactionModel" v-model:splits="transactionSplitModels" @cancel="showAddTransactionDialog = false" @save="save" :show="showAddTransactionDialog"></TransactionAddForm>
  </template>
  
  <script setup lang="ts">
  import { provide } from 'vue';
  import type Transaction from '@/data/interfaces/Transactions/Transaction';
  import type Category from '@/data/interfaces/Category';
  import TransactionsService from '@/data/services/TransactionsService';
  import CategoryService from '@/data/services/CategoryService'; 
import TransactionModel from '@/data/classes/TransactionModel';
import TransactionSplitModel from '@/data/classes/TransactionSplitModel';
import ModelList from '@/data/classes/ModelList';
import type TransactionSplit from '@/data/interfaces/Transactions/TransactionSplit';
  
  
  interface AutoCompleteObject {
    type: string;
    text: string;
    value: number | string;
  }
  
  const transactions = ref<Transaction[]>([]);
  const searchItems = ref<Transaction[]>([])
  const categories = ref<Category[]>([]);
  const selectedFilter = ref<AutoCompleteObject | null>(null);
  const fromDate = ref(Date.now().toString())
  const searchString = ref("");
  const showAddTransactionDialog = ref(false);
  const loading = ref(false);
  provide('show', showAddTransactionDialog);
  provide('loading', loading);
  const selectedYear = ref(2024);
  const years = ref<number[]>([]);
  const transactionModel = ref<TransactionModel>(new TransactionModel());
  const transactionSplitModels = ref<ModelList<TransactionSplitModel, TransactionSplit>>();
  
  let timerId: number | null = null;
  
  const headers = ref([
    {title: 'Date', key: 'transactionDate'},
    {title: 'Description', key: 'description'},
    {title: 'Category', key: 'categoryName'},
    {title: 'Amount', key: 'amount'},
    {title: 'Actions', key: 'actions'}
  
  ]);
  
  onMounted(async () => {
    for (var year = 2014; year < 2026; year++) {
      years.value.push(year);
    }
    
    //getData();

    categories.value = await new CategoryService().getMultiple();
  });

  async function save() {
    try {
      loading.value = true;
      await transactionModel.value.save(new TransactionsService());      
      showAddTransactionDialog.value = false;
    } finally {
      loading.value = false;
    }
  }

  async function getData(): Promise<void> {
    transactions.value = await new TransactionsService()
      .withUrlParameters({
        fromDate: `${selectedYear.value}-01-01`,
        toDate: `${selectedYear.value}-12-31`
      }).getMultiple();
  }

  function searchUpdate(searchString: string): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    if (!searchString) {
      transactions.value = [];
      return;
    }

    timerId = setTimeout(async () => {
      // searchItems.value = await new TransactionsService()
      // .withUrlParameters({
      //   searchString: searchString
      // }).getMultiple();
      transactions.value = await new TransactionsService()
      .withUrlParameters({
        searchString: searchString
      }).getMultiple();
      }, 1000); 
      
  }

  watch(selectedYear, async (newValue, oldValue) => {
    await getData();
  })

  function showAddEditDialog(transaction?: Transaction) {
    
    transactionSplitModels.value = new ModelList<TransactionSplitModel, TransactionSplit>([]);

    if (transaction) {
      transactionModel.value = new TransactionModel(transaction);
      if (transaction.splitId) {
        var splitModels: TransactionSplitModel[] = [];
        for (var trans of transactions.value.filter(x => x.splitId === transaction.splitId)) {
          splitModels.push(new TransactionSplitModel({
            pk: trans.pk,
            transactionId: trans.splitId ?? 0,
            amount: trans.amount,
            categoryId: trans.categoryId ?? 0,
            subcategoryId: trans.subcategoryId ?? 0,
            exclude: trans.exclude ?? false
          }));
        }
        transactionSplitModels.value = new ModelList<TransactionSplitModel, TransactionSplit>(splitModels);
      }
    } else {
      transactionModel.value = new TransactionModel();
    }
    showAddTransactionDialog.value = true;
  }  
  
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

  </script>
  
  