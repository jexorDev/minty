<template>

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
                <v-text-field label="Quick Search" @update:model-value="searchUpdate" clearable></v-text-field>
              </v-col>
              
            </v-row>
            <v-row no-gutters>
              <v-col>
               <v-select label="Year" :items="years" v-model="selectedYear" variant="outlined" density="compact" max-width="200"></v-select>
             </v-col> 
             <v-col>
              <v-chip-group v-model="selectedMonth" selected-class="v-chip--selected v-chip--variant-flat" mandatory>
                <v-chip value="1">Jan</v-chip>
                <v-chip value="2">Feb</v-chip>
                <v-chip value="3">Mar</v-chip>
                <v-chip value="4">Apr</v-chip>
                <v-chip value="5">May</v-chip>
                <v-chip value="6">Jun</v-chip>
                <v-chip value="7">Jul</v-chip>
                <v-chip value="8">Aug</v-chip>
                <v-chip value="9">Sept</v-chip>
                <v-chip value="10">Oct</v-chip>
                <v-chip value="11">Nov</v-chip>
                <v-chip value="12">Dec</v-chip>
                
              </v-chip-group>
             </v-col>              
              
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
        <div v-show="isLoading">Loading...</div>
        <div v-show="noResults">No results</div>

        <v-fab :app="true"  icon="mdi-plus" color="primary">
          <v-icon>$plus</v-icon>
           <v-speed-dial  activator="parent">
          <v-btn key="1" color="primary" @click="showUploadDialog = true">
            File
          </v-btn>

          <v-btn key="2" color="primary" @click="showAddEditDialog">
            Single
          </v-btn>

          
        </v-speed-dial>
        </v-fab>

    <TransactionAddForm v-model="transactionModel" v-model:splits="transactionSplitModels" @cancel="showAddTransactionDialog = false" @save="save" :show="showAddTransactionDialog"></TransactionAddForm>
    <v-dialog v-model="showUploadDialog">
      <v-card>
        <v-card-text>

          <v-select v-model="selectedImportType" :items="importTypes"></v-select>
          
                    <v-file-input
                    v-model="selectedFileUpload"
                    label="File input"
                  ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showUploadDialog = false">Cancel</v-btn>
          <v-btn @click="uploadFile">Upload</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
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
  import dayjs from 'dayjs';
import TransactionSplitsService from '@/data/services/TransactionSplitsService';
  
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
  const isLoading = ref(false);
  const noResults = ref(false);
  const selectedFileUpload = ref<File|null>(null);
  const importTypes = ['Mint', 'Rocket Money'];
  const selectedImportType = ref<string>("Mint");
  const showUploadDialog = ref(false);
  const selectedMonth = ref(1);

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
        fromDate: `${selectedYear.value}-${selectedMonth.value.toString().padStart(2, '0')}-01`,
        toDate: `${selectedYear.value}-${selectedMonth.value.toString().padStart(2, '0')}-30`
      }).getMultiple();
  }

  async function uploadFile(): Promise<void> {
    if (selectedFileUpload.value === null) return;

    const form = new FormData();
    form.append('csvFile', selectedFileUpload.value);
    var importType = selectedImportType.value === 'Mint' ? 'mint' : 'rocketmoney';
    try {
      await new TransactionsService().postFile(form, `file/${importType}`);

    } finally {
      showUploadDialog.value = false;

    }
  }

  function searchUpdate(searchString: string): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    if (!searchString) {
      transactions.value = [];
      noResults.value = false;
      return;
    }

    timerId = setTimeout(async () => {
      // searchItems.value = await new TransactionsService()
      // .withUrlParameters({
      //   searchString: searchString
      // }).getMultiple();

      try {
        isLoading.value = true;
        transactions.value = await new TransactionsService()
        .withUrlParameters({
          searchString: searchString
        }).getMultiple();
        
      } finally {
        noResults.value = transactions.value.length === 0;
        isLoading.value = false;
      }

      }, 1000); 
      
  }

  function formatDate(date: string | Date): string {
    return dayjs(date).format("MM/DD/YYYY")
  }

  watch(selectedYear, async (newValue, oldValue) => {
    await getData();
  })

  watch(selectedMonth, async (newValue, oldValue) => {
    console.log(selectedMonth.value)
    await getData();
  })

  async function showAddEditDialog(transaction?: Transaction) {
    
    transactionSplitModels.value = new ModelList<TransactionSplitModel, TransactionSplit>([]);

    if (transaction) {
      transactionModel.value = new TransactionModel(transaction);
      if (transaction.splitId) {
        var splitModels: TransactionSplitModel[] = [];

        // for (var trans of await new TransactionSplitsService(transaction.pk!).getMultiple()) {
        //   splitModels.push(new TransactionSplitModel({
        //     pk: trans.pk,
        //     transactionId: trans.transactionId,
        //     amount: trans.amount,
        //     categoryId: trans.categoryId ?? 0,
        //     subcategoryId: trans.subcategoryId ?? 0,
        //     exclude: trans.exclude ?? false
        //   }));
        // }
        
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
  
  