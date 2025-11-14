<template>
  <v-navigation-drawer
    v-if="!quickFindMode"
    v-model="showFilterDrawer"    
    location="right">
    <v-list>
      <v-list-item>
        <template v-slot:append>          
          <v-icon icon="mdi-close" @click="showFilterDrawer = false"></v-icon>
        </template>
      </v-list-item>
      <v-list-item subtitle="Custom Date Range">
        <template v-slot:append>
          <v-switch v-model="customDateRange" density="compact" color="primary" class="mt-5"></v-switch>
        </template>
      </v-list-item>
      <v-list-item subtitle="From" v-if="customDateRange">
        <v-date-input 
              v-model="customDateRangeFrom"
              variant="outlined"
              density="compact"
              prepend-icon=""
              prepend-inner-icon="mdi-calendar"
              ></v-date-input>
      </v-list-item>
      <v-list-item subtitle="To" v-if="customDateRange">
        <v-date-input 
              v-model="customDateRangeTo"
              variant="outlined"
              density="compact"
              prepend-icon=""
              prepend-inner-icon="mdi-calendar"
              ></v-date-input>
        <v-btn 
          @click="setCustomDateRange(0)"
          size="x-small" 
          text="This Year" 
          variant="tonal"
          color="secondary">
        </v-btn>
        <v-btn 
          @click="setCustomDateRange(1)"
          size="x-small" 
          text="Last Year" 
          variant="tonal"
          color="secondary"
          class="ml-2">
        </v-btn>
      </v-list-item>      
      <v-list-item subtitle="Year" v-if="!customDateRange">
        <v-select :items="userSettingsStore.yearsOfData" v-model="selectedYear" variant="outlined" density="compact"></v-select>
      </v-list-item>
      <v-list-item subtitle="Month" v-if="!customDateRange">        
        <v-chip-group 
          v-model="selectedMonth" 
          color="primary"  
          column
          mandatory>
          <v-chip v-for="month in MonthEnum.getItems()">{{ month.description.substring(0, 3) }}</v-chip>          
      </v-chip-group>
      </v-list-item>
      <v-divider thickness="3" class="mb-2"></v-divider>
      <v-list-item subtitle="Category">        
        <v-autocomplete clearable v-model="filterCategoryId" :items="categoryStore.categories" item-title="name" item-value="pk" variant="outlined" density="compact"></v-autocomplete>
      </v-list-item>
      <v-list-item subtitle="Include Ignored Categories">
        <v-switch v-model="includeIgnoredCategories"
          color="primary"
          class="ml-2"
          density="compact"
        ></v-switch>
      </v-list-item>
      <v-list-item subtitle="Uncategorized Transactions Only">
        <v-switch v-model="uncategorizedTransactionsOnly"
          color="primary"
          class="ml-2"
          density="compact"
        ></v-switch>
      </v-list-item>
      <v-divider thickness="3" class="mb-2"></v-divider>
      
    </v-list>
  </v-navigation-drawer>
        
  <v-toolbar color="secondary-darken-1" density="compact">    
    <template v-slot:prepend>
      <v-btn
        v-if="!$vuetify.display.mobile"
        color="primary"
        append-icon="mdi-file-table-outline"
        variant="text"
        class="mr-1"
        @click="exportData"
      >
        Export
      </v-btn>
      <v-divider vertical thickness="3"></v-divider>
       <v-menu v-if="!quickFindMode">
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            append-icon="mdi-plus"
            variant="text"
            v-bind="props"
          >
            Add
          </v-btn>
        </template>
        <v-list>
          <v-list-item title="Single transaction" @click="setTransactionToEdit()">
            <template v-slot:append>
              <v-icon icon="mdi-cash-register"></v-icon>
            </template>
          </v-list-item>
          <v-list-item title="File" @click="showUploadDialog = true">
            <template v-slot:append>
              <v-icon icon="mdi-upload"></v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <v-text-field 
      v-if="quickFindMode" 
      v-model="searchString" 
      variant="outlined" 
      density="compact" 
      max-width="500" 
      placeholder="Quick Search" 
      @update:model-value="searchUpdate" 
      clearable 
      :loading="isLoading" 
      class="mt-5">
        <template v-slot:append>
            <v-chip label >{{ resultCount }} results</v-chip>
        </template>
    </v-text-field>
      
    <template v-slot:append>
      <v-btn 
        @click="quickFindMode = !quickFindMode" 
        :prepend-icon="quickFindMode ? 'mdi-magnify-remove-outline' : 'mdi-magnify'"                 
        :text="quickFindMode ? '' : 'Quick Find'"
        color="primary" 
        class="ml-1" 
        :variant="quickFindMode ? 'flat' : 'outlined'"  
        ></v-btn>
      <v-btn 
        v-if="!quickFindMode" 
        text="Filter"
        @click="showFilterDrawer = !showFilterDrawer" 
        prepend-icon="mdi-filter-variant" 
        color="primary" 
        class="ml-1" 
        :variant="showFilterDrawer ? `flat` : `outlined`"></v-btn>
    </template>
  </v-toolbar>
  <v-row no-gutters>
    <v-col cols="12" md="8">
      <div :class="$vuetify.display.mobile ? '' : 'scroll'">
        <v-empty-state v-if=isLoading>
          <v-progress-circular indeterminate size="x-large" color="secondary" :width="7"></v-progress-circular>
        </v-empty-state> 
        <TransactionsList @selected-transaction-changed="setTransactionToEdit" :transactions="filteredTransactions"></TransactionsList>
        <v-empty-state
            v-if="(!quickFindMode || searchString) && !isLoading && resultCount === 0"                            
            title="No results"
            text="Try a different search criteria"  
        ></v-empty-state>
      </div>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <apexchart :options="spendingDonutChartOptions" :series="spendingDonutChartSeries"></apexchart>
      </v-card>
      <v-card>        
        <DataTable :data="spendingByCategoryTableData" :headers="headers" density="compact"></DataTable>
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
import { getCurrentDate, getCurrentYear, getDaysInMonth, getMonth } from '@/utilities/DateArithmeticUtility';
import { createDate, DateFormats, formatDate } from '@/utilities/DateFormattingUtility';
import MonthEnum from '@/data/enumerations/MonthEnum';
import FileUploadDialog from '@/components/FileUploadDialog.vue';
import { useSpendingFromTransactionsDonutChart } from '@/composables/charts/SpendingFromTransactionsDonutChartComposable';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';
import { useUserSettingsStore } from '@/stores/UserSettingsStore';
import { useCategoryAggregatorTransactionSearch } from '@/composables/data/CategoryAggregatorTransactionSearch';
import GenericService from '@/data/services/GenericService';

  const selectedTransaction = ref<TransactionSearch | undefined>(undefined);
  const transactions = ref<TransactionSearch[]>([]);
  const showAddTransactionDialog = ref(false);
  const selectedYear = ref(getCurrentYear());
  const showUploadDialog = ref(false);
  const userSettingsStore = useUserSettingsStore();
  const selectedMonth = ref(getMonth(userSettingsStore.userSettings.maxTransactionDate));
  const categoryStore = useCategoryStore();
  const filterCategoryId = ref<number | null>(null);
  const showFilterDrawer = ref(true);
  const quickFindMode = ref(false);
  const includeIgnoredCategories = ref(true);
  const uncategorizedTransactionsOnly = ref(false);
  const searchString = ref("");
  const isLoading = ref(false);
  const customDateRange = ref(false);
  const customDateRangeFrom = ref(formatDate(getCurrentDate(), DateFormats.ISO));
  const customDateRangeTo = ref(formatDate(getCurrentDate(), DateFormats.ISO));
  const headers = [
    { title: 'Category', key: 'x' },
    { title: 'Total', key: 'y', value: (item: any) => formatNumber(item.y, NumberFormats.Price) }  
  ];
const {aggregatedCategories} = useCategoryAggregatorTransactionSearch(transactions, filterCategoryId)
  const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingFromTransactionsDonutChart(aggregatedCategories);
  let timerId: number | null = null;
  
  onMounted(async () => {
    await getData();
  });

  const filteredTransactions = computed(() => searchString.value 
  ? transactions.value 
  :  transactions.value
      .filter(x => filterCategoryId.value === null || x.categoryId === filterCategoryId.value)
      .filter(x => x.categoryIgnore === (includeIgnoredCategories.value ? x.categoryIgnore : false))
      .filter(x => x.categoryId === (uncategorizedTransactionsOnly.value ? null : x.categoryId)));
  const fromDate = computed(() => customDateRange.value ? formatDate(customDateRangeFrom.value, DateFormats.ISO) : createDate(selectedYear.value, selectedMonth.value, 1, DateFormats.ISO));
  const toDate = computed(() => customDateRange.value ? formatDate(customDateRangeTo.value, DateFormats.ISO) : createDate(selectedYear.value, selectedMonth.value, getDaysInMonth(fromDate.value), DateFormats.ISO));

  async function getData(): Promise<void> {

    try {
      isLoading.value = true;
      
      transactions.value = [];

      if (searchString.value) {
        transactions.value = await new TransactionSearchService()
            .withUrlParameters({
            searchString: searchString.value,
            includeIgnored: true
            }).getMultiple();        
      } else {
        transactions.value = await new TransactionSearchService()
          .withUrlParameters({
            fromDate: fromDate.value,
            toDate: toDate.value,
            includeIgnoredCategories: true,
            uncategorizedTransactionsOnly: false
          }).getMultiple();   

      }
    } finally {
      isLoading.value = false;
    }
  }  

async function exportData(): Promise<void> {
  const file = await new GenericService("search").withRouteParameter("export")
     .withUrlParameters({
            fromDate: fromDate.value,
            toDate: toDate.value,
            includeIgnoredCategories: includeIgnoredCategories.value,
            uncategorizedTransactionsOnly: uncategorizedTransactionsOnly.value
          }).getFile();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `MintyExport${formatDate(getCurrentDate(), "YYYYMMDDHHMM")}`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function searchUpdate(searchString: string): void {
  if (timerId) {
      isLoading.value = true;
    clearTimeout(timerId);
  }

  if (!searchString) {
      isLoading.value = false;
      return;
  }

  timerId = setTimeout(async () => {
    await getData();
  }, 1000);       
}
const resultCount = computed(() => filteredTransactions.value.length);

const spendingByCategoryTableData = computed(() => {
  return aggregatedCategories.value.map(x => {return {name: x.name, total: formatNumber(x.total, NumberFormats.Price)}});
});

function setTransactionToEdit(transaction?: TransactionSearch): void {
  selectedTransaction.value = transaction;
  showAddTransactionDialog.value = true;
}

function setCustomDateRange(yearOffset: number): void {
  const currentYear = getCurrentYear() - yearOffset;
  customDateRangeFrom.value = createDate(currentYear, 0, 1, DateFormats.ISO);
  customDateRangeTo.value = createDate(currentYear, 11, 31, DateFormats.ISO);
}

watch(selectedYear, async () => await getData());
watch(selectedMonth, async () => await getData());
watch(customDateRange, async () => await getData());
watch(customDateRangeFrom, async () => await getData());
watch(customDateRangeTo, async () => await getData());

watch(quickFindMode, () => {
  transactions.value = [];
  if (!quickFindMode.value) {
    searchString.value = "";
    getData();
  }
})
  
</script>
<style scoped>
.scroll {
  height: 93vh;
  overflow: auto;
}
</style>
  