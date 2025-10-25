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
        <v-toolbar color="secondary-darken-1">

          <v-text-field variant="outlined" density="compact" class="ml-5 mt-5" label="Quick Search" @update:model-value="searchUpdate" clearable></v-text-field>


          <v-select label="Year" :items="years" v-model="selectedYear" variant="outlined" density="compact" max-width="200" class="ml-5 mt-5"></v-select>

          <v-chip-group 
              v-model="selectedMonth" 
              color="primary"  
              class="ml-5"              
              mandatory>
                <v-chip >Jan</v-chip>
                <v-chip >Feb</v-chip>
                <v-chip >Mar</v-chip>
                <v-chip >Apr</v-chip>
                <v-chip >May</v-chip>
                <v-chip >Jun</v-chip>
                <v-chip >Jul</v-chip>
                <v-chip >Aug</v-chip>
                <v-chip >Sept</v-chip>
                <v-chip >Oct</v-chip>
                <v-chip >Nov</v-chip>
                <v-chip >Dec</v-chip>
                
            </v-chip-group>
            <v-btn-toggle
                    v-model="reportingType"
                    base-color="secondary"
                    color="primary"
                    divided
                    density="compact"
                  >
                  <v-btn text="Always include"></v-btn>
                  <v-btn text="Exclude by default"></v-btn>
                  <v-btn text="Always exclude"></v-btn>
                </v-btn-toggle>
            <v-autocomplete clearable v-model="filterCategoryId" label="Category" :items="categoryStore.categories" item-title="name" item-value="pk" variant="outlined" density="compact" class="ml-5 mt-5"></v-autocomplete>

        </v-toolbar>
<!--         <v-data-table-virtual :headers="headers" :items="transactions" fixed-header>
          <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="showAddEditDialog(item)"></v-icon>

          
        </div>
      </template>
        </v-data-table-virtual> -->
        <v-row>
          <v-col :cols="$vuetify.display.mobile ? 12 : 8">
            <TransactionsList v-model:selectedTransaction="selectedTransaction" :transactions="filteredTransactions"></TransactionsList>

          </v-col>
           <v-col v-if="!$vuetify.display.mobile" :cols="4">
            <v-card>
              <apexchart  :options="spendingDonutChartOptions" :series="spendingDonutChartSeries"></apexchart>
            </v-card>
            <v-card>
              <v-data-table :items="tableData" :headers="headers"></v-data-table>
            </v-card>
          </v-col>
        </v-row>
       
        <div v-show="isLoading">Loading...</div>
        <div v-show="noResults">No results</div>

        <v-fab :app="true"  icon="mdi-plus" color="primary">
          <v-icon>$plus</v-icon>
           <v-speed-dial  activator="parent">
          <v-btn key="1" color="primary" @click="showUploadDialog = true">
            File
          </v-btn>

          <v-btn key="2" color="primary" @click="showAddEditDialog()">
            Single
          </v-btn>

          
        </v-speed-dial>
        </v-fab>

    <TransactionAddForm :key="addFormKey" :transaction="selectedTransaction" v-model:show="showAddTransactionDialog" ></TransactionAddForm>

    <FileUploadDialog v-model="showUploadDialog" @close="showUploadDialog = false"></FileUploadDialog>
    
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
  import {useCategoryStore} from '@/stores/CategoryStore';
import TransactionSearchService from '@/data/services/TransactionSearchService';
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import FileUploadService from '@/data/services/FileUploadService';
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';
import { useSpendingDonutChart } from '@/composables/SpendingDonutChartComposable';
import { useDisplay } from 'vuetify';

  interface AutoCompleteObject {
    type: string;
    text: string;
    value: number | string;
  }
  
  const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
  const selectedTransaction = ref<TransactionSearch>({} as TransactionSearch);
  const transactions = ref<TransactionSearch[]>([]);
  const searchItems = ref<Transaction[]>([])
  //const categories = ref<Category[]>([]);
  const selectedFilter = ref<AutoCompleteObject | null>(null);
  const fromDate = ref(Date.now().toString())
  const searchString = ref("");
  const showAddTransactionDialog = ref(false);
  const loading = ref(false);  
  //provide('show', show);
  //provide('loading', loading);
  const selectedYear = ref(dayjs().year());
  const years = ref<number[]>([]);
  const transactionModel = ref<TransactionSearch>({} as TransactionSearch);
  const transactionSplitModels = ref<ModelList<TransactionSplitModel, TransactionSplit>>();  
  const isLoading = ref(false);
  const noResults = ref(false);
  
  const showUploadDialog = ref(false);
  const selectedMonth = ref(dayjs().month());
  const categoryStore = useCategoryStore();
  const { mobile } = useDisplay()

  const addFormKey = ref(1);
  const reportingType = ref<number | undefined>(undefined);
  const filterCategoryId = ref<number | null>(null);

  const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingDonutChart(categoryMonthTotals, selectedYear.value);
  
  let timerId: number | null = null;
  
  onMounted(async () => {
    for (var year = 2014; year <= dayjs().year(); year++) {
      years.value.push(year);
    }
    
    await getData();

  });

  function save() {
    // try {
    //   loading.value = true;
    //   await transactionModel.value.save(new TransactionsService());      
       showAddTransactionDialog.value = false;
    // } finally {
    //   loading.value = false;
    // }
    getData();
  }

  async function getData(): Promise<void> {
    const fromDate = `${selectedYear.value}-${(selectedMonth.value + 1).toString().padStart(2, '0')}-01`;
    const toDate = `${selectedYear.value}-${(selectedMonth.value + 1).toString().padStart(2, '0')}-${dayjs(fromDate).daysInMonth()}`;

    transactions.value = await new TransactionSearchService()
      .withUrlParameters({
        fromDate: fromDate,
        toDate: toDate
      }).getMultiple();

        categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
    "fromDate": fromDate,
    "toDate": toDate
  }).getMultiple();
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
        transactions.value = await new TransactionSearchService()
        .withUrlParameters({
          searchString: searchString
        }).getMultiple();
        
      } finally {
        noResults.value = transactions.value.length === 0;
        isLoading.value = false;
      }

      }, 1000); 
      
  }

  const filteredTransactions = computed(() => transactions.value
    .filter(x => reportingType.value === undefined || x.categoryReportingType === reportingType.value)
    .filter(x => filterCategoryId.value === null || x.categoryId === filterCategoryId.value));

  function formatDate(date: string | Date): string {
    return dayjs(date).format("MM/DD/YYYY")
  }

  watch(selectedYear, async (newValue, oldValue) => {
    await getData();
  });

  watch(selectedMonth, async (newValue, oldValue) => {
    await getData();
  });

  watch(selectedTransaction, () => showAddTransactionDialog.value = true);

  async function showAddEditDialog(transaction?: TransactionSearch) {
    
    transactionSplitModels.value = new ModelList<TransactionSplitModel, TransactionSplit>([]);
    
    if (transaction) {
//      transactionModel.value = new TransactionModel(transaction);
      transactionModel.value = transaction;
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
      transactionModel.value = {} as TransactionSearch;
    }

    addFormKey.value += 1;
    showAddTransactionDialog.value = true;
  }  

  const tableData = computed(() => {
    if (spendingDonutChartSeries.value.length > 0) {
      return spendingDonutChartSeries.value[0].data;

    } else {
      return [];
    }
  });

  const headers = [
  { title: 'Category', value: 'x' },
  { title: 'Total', key: 'y' }  
]
  
  const transactionDescriptions = computed<string[]>(() => [...new Set(transactions.value.map(x => x.description))]);
  // const autoCompleteObjects = computed<AutoCompleteObject[]>(() => [...categoryStore.categories.map(x => {
  //   return {
  //     type: "Category",
  //     text: x.name,
  //     value: x.pk
  //   }
  // }), ...transactionDescriptions.value.map(x => {
  //   return {
  //     type: "",
  //     text: x,
  //     value: x
  //   }
  // } )]);

  </script>
  
  