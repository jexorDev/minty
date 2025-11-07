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
          <v-chip v-for="month in monthEnum.getItems()">{{ month.description.substring(0, 3) }}</v-chip>          
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
        <v-list-item-action>
          <v-btn @click="reportingType = null" density="compact" color="secondary" variant="text">Reset</v-btn>
        </v-list-item-action>
      </v-list-item>     
    </v-list>
  </v-navigation-drawer>
        
  <v-toolbar color="secondary-darken-1" density="compact">    
     <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          append-icon="mdi-plus"
          variant="outlined"
          v-bind="props"
        >
          Add
        </v-btn>
      </template>
      <v-list>
        <v-list-item title="Single transaction" @click="setTransactionToEdit()"></v-list-item>
        <v-list-item title="File" @click="showUploadDialog = true"></v-list-item>
      </v-list>
    </v-menu>
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
        <v-data-table :items="tableData" :headers="headers" density="compact"></v-data-table>
      </v-card>
    </v-col>
  </v-row>
  
  <TransactionAddForm :transaction="selectedTransaction" v-model:show="showAddTransactionDialog" @refresh="getData"></TransactionAddForm>
  <FileUploadDialog v-model="showUploadDialog" @refresh="getData"></FileUploadDialog>
    
</template>
  
<script setup lang="ts">
import {useCategoryStore} from '@/stores/CategoryStore';
import TransactionSearchService from '@/data/services/TransactionSearchService';
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';
import { useSpendingDonutChart } from '@/composables/SpendingDonutChartComposable';
import CategoryReportingTypeEnum from '@/data/enumerations/CategoryReportingType';
import { getCurrentMonth, getCurrentYear, getDaysInMonth } from '@/utilities/DateArithmeticUtility';
import { createDate, DateFormats } from '@/utilities/DateFormattingUtility';
import MonthEnum from '@/data/enumerations/MonthEnum';
import FileUploadDialog from '@/components/FileUploadDialog.vue';

  const categoryReportingTypeEnum = new CategoryReportingTypeEnum();
  const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
  const selectedTransaction = ref<TransactionSearch | undefined>(undefined);
  const transactions = ref<TransactionSearch[]>([]);
  const showAddTransactionDialog = ref(false);
  const selectedYear = ref(getCurrentYear());
  const years = ref<number[]>([]);
  const showUploadDialog = ref(false);
  const selectedMonth = ref(getCurrentMonth());
  const categoryStore = useCategoryStore();
  const reportingType = ref<number | null>(null);
  const filterCategoryId = ref<number | null>(null);
  const showFilterDrawer = ref(true);
  const monthEnum = new MonthEnum();

  const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingDonutChart(categoryMonthTotals, selectedYear);
  
  onMounted(async () => {
    for (var year = 2014; year <= getCurrentYear(); year++) {
      years.value.push(year);
    }
    
    await getData();

  });

  async function getData(): Promise<void> {
    const fromDate = createDate(selectedYear.value, selectedMonth.value, 1, DateFormats.ISO);
    const toDate = createDate(selectedYear.value, selectedMonth.value, getDaysInMonth(fromDate), DateFormats.ISO);

    Promise.all([
      transactions.value = await new TransactionSearchService()
        .withUrlParameters({
          fromDate: fromDate,
          toDate: toDate
        }).getMultiple(),
      categoryMonthTotals.value = await new StatisticsService()
        .withUrlParameters({
          fromDate: fromDate,
          toDate: toDate
        }).getMultiple()
    ]);
  }  

  const filteredTransactions = computed(() => transactions.value
    .filter(x => reportingType.value === null || x.categoryReportingType === reportingType.value)
    .filter(x => filterCategoryId.value === null || x.categoryId === filterCategoryId.value));

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
  ];
</script>
<style scoped>
.scroll {
  height: 93vh;
  overflow: auto;
}
</style>
  