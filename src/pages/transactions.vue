<template>
  <v-navigation-drawer
    v-model="showFilterDrawer"    
    location="right">
    <v-list>
      <v-list-item>
        <template v-slot:append>          
          <v-icon icon="mdi-close" @click="showFilterDrawer = false"></v-icon>
        </template>
      </v-list-item>
      <v-list-item>        
        <v-list-item-subtitle>Year</v-list-item-subtitle>
        <v-select :items="years" v-model="selectedYear" variant="outlined" density="compact"></v-select>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>Month</v-list-item-subtitle>
        <v-chip-group 
          v-model="selectedMonth" 
          color="primary"  
          column
          mandatory>
          <v-chip >Jan</v-chip>
          <v-chip >Feb</v-chip>
          <v-chip >Mar</v-chip>
          <v-chip >Apr</v-chip>
          <v-chip >May</v-chip>
          <v-chip >Jun</v-chip>
          <v-chip >Jul</v-chip>
          <v-chip >Aug</v-chip>
          <v-chip >Sep</v-chip>
          <v-chip >Oct</v-chip>
          <v-chip >Nov</v-chip>
          <v-chip >Dec</v-chip>                
      </v-chip-group>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>Category</v-list-item-subtitle>
        <v-autocomplete clearable v-model="filterCategoryId" :items="categoryStore.categories" item-title="name" item-value="pk" variant="outlined" density="compact"></v-autocomplete>
      </v-list-item>
      <v-list-item>
        <v-list-item-subtitle>Reporting Type</v-list-item-subtitle>          
        <v-radio-group
            v-model="reportingType"
            base-color="secondary"
            color="primary"
            divided
            density="compact"
          >
          <v-radio v-for="enumItem in categoryReportingTypeEnum.getItems()" :label="enumItem.description" :value="enumItem.value"></v-radio>          
        </v-radio-group>
        <v-btn @click="reportingType = null" density="compact" color="secondary" variant="text">Reset reporting type</v-btn>
      </v-list-item>
     
    </v-list>
  </v-navigation-drawer>
        
  <v-toolbar color="secondary-darken-1" density="compact">
    <v-text-field variant="outlined" density="compact" class="ml-2 mt-5" max-width="500" label="Quick Search" @update:model-value="searchUpdate" clearable></v-text-field>
    <v-spacer></v-spacer>
    <v-btn @click="showFilterDrawer = !showFilterDrawer" prepend-icon="mdi-filter-variant" color="primary" :variant="showFilterDrawer ? `flat` : `outlined`">Filter</v-btn>
  </v-toolbar>
  <v-row>
    <v-col :cols="$vuetify.display.mobile ? 12 : 8">
      <div :class="$vuetify.display.mobile ? '' : 'scroll'">
        <TransactionsList @selected-transaction-changed="setTransactionToEdit" :transactions="filteredTransactions"></TransactionsList>

      </div>

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
  
  <v-fab :app="true"  icon="mdi-plus" color="primary">
    <v-icon>$plus</v-icon>
    <v-speed-dial  activator="parent">
    <v-btn key="1" color="primary" @click="showUploadDialog = true">
            File
    </v-btn>

          <v-btn key="2" color="primary" @click="setTransactionToEdit()">
            Single
          </v-btn>

          
        </v-speed-dial>
        </v-fab>

    <TransactionAddForm :key="addFormKey" :transaction="selectedTransaction" v-model:show="showAddTransactionDialog" @refresh="getData"></TransactionAddForm>

    <FileUploadDialog v-model="showUploadDialog" @refresh="getData"></FileUploadDialog>
    
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
import CategoryReportingTypeEnum from '@/data/enumerations/CategoryReportingType';

  interface AutoCompleteObject {
    type: string;
    text: string;
    value: number | string;
  }
  
  const categoryReportingTypeEnum = new CategoryReportingTypeEnum();
  const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
  const selectedTransaction = ref<TransactionSearch | undefined>(undefined);
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
  const reportingType = ref<number | null>(null);
  const filterCategoryId = ref<number | null>(null);
  const showFilterDrawer = ref(true);

  const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingDonutChart(categoryMonthTotals, selectedYear.value);
  
  let timerId: number | null = null;
  
  onMounted(async () => {
    for (var year = 2014; year <= dayjs().year(); year++) {
      years.value.push(year);
    }
    
    await getData();

  });

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
      getData();
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
    .filter(x => reportingType.value === null || x.categoryReportingType === reportingType.value)
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

  function setTransactionToEdit(transaction?: TransactionSearch) {
    selectedTransaction.value = transaction;
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
  <style scoped>
.scroll {
  height: 93vh;
  overflow: auto;
}
</style>
  