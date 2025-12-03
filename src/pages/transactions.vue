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
      <v-list-item v-if="fileId">
        <v-chip label closable @click:close="fileId = null">File ID: {{ fileId }}</v-chip>
      </v-list-item>
      <v-list-item subtitle="Dates">
        <v-radio-group v-model="dateFilterType" density="compact">
          <v-radio v-for="item in TransactionDateFilterTypeEnum.getItems()" :value="item.value" :label="item.description"></v-radio>
        </v-radio-group>
        
      </v-list-item>     
      <v-list-item subtitle="From" v-if="dateFilterType === TransactionDateFilterTypeEnum.CustomRange.value">
        <v-date-input 
              v-model="customDateRangeFrom"
              variant="outlined"
              density="compact"
              prepend-icon=""
              prepend-inner-icon="mdi-calendar"
              ></v-date-input>
      </v-list-item>
      <v-list-item subtitle="To" v-if="dateFilterType ===  TransactionDateFilterTypeEnum.CustomRange.value">
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
      <v-list-item subtitle="Year" v-if="dateFilterType === TransactionDateFilterTypeEnum.ByMonth.value">
        <v-select :items="userSettingsStore.yearsOfData" v-model="selectedYear" variant="outlined" density="compact"></v-select>
      </v-list-item>
      <v-list-item subtitle="Month" v-if="dateFilterType === TransactionDateFilterTypeEnum.ByMonth.value">        
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
        <v-autocomplete 
          v-model="filterCategoryId" 
          clearable 
          :items="categoryStore.categories" 
          :disabled="uncategorizedTransactionsOnly"
          item-title="name" 
          item-value="pk" 
          variant="outlined" 
          density="compact">
        </v-autocomplete>
      </v-list-item>
      <v-list-item subtitle="Include Ignored Categories">
        <v-switch 
          v-model="includeIgnoredCategories"
          :disabled="uncategorizedTransactionsOnly"
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

      <v-list-item subtitle="Merchant">        
        <v-autocomplete 
          v-model="filterMerchantId" 
          clearable 
          :items="merchantStore.merchants" 
          item-title="name" 
          item-value="pk" 
          variant="outlined" 
          density="compact">
        </v-autocomplete>
      </v-list-item>
      <v-divider thickness="3" class="mb-2"></v-divider>

      <v-list-item subtitle="Account">        
        <v-autocomplete 
          v-model="filterAccountId" 
          clearable 
          :items="accountStore.accounts" 
          item-title="name" 
          item-value="pk" 
          variant="outlined" 
          density="compact">
        </v-autocomplete>
      </v-list-item>      
      <v-divider thickness="3" class="mb-2"></v-divider>
      <v-list-item subtitle="Tags">        
        <v-autocomplete clearable v-model="filterTagText" :items="tags" item-title="text" item-value="text" variant="outlined" density="compact"></v-autocomplete>
      </v-list-item>
      
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
       <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-if="!$vuetify.display.mobile || !isQuickSearchFocused"
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

    <v-autocomplete 
      v-model:search="searchString"
      :loading="isQuickSearchLoading"
      @update:search="searchUpdate"
      @update:focused="quickSearchFocusChanged"
      placeholder="Quick Search"
      max-width="500"
      density="compact"
      variant="outlined"
      class="mt-5"
      item-value="pk"
      item-title="description"
      hide-no-data      
      :items="quickSearchTransactions">
      <template v-slot:item="{props, item}">
        <TransactionsListItem 
          :transaction="item.raw" 
          @selected-transaction-changed="setTransactionToEdit">
        </TransactionsListItem>
      </template>
         <template v-slot:append>
            <v-chip v-if="!isQuickSearchLoading && searchString.length > 0" label >{{ resultCount }} results</v-chip>
            <v-progress-circular v-if="isQuickSearchLoading" indeterminate></v-progress-circular>
        </template>
    </v-autocomplete>
  
    <template v-slot:append>      
      <v-btn 
        v-if="!$vuetify.display.mobile || !isQuickSearchFocused"
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
        <v-virtual-scroll
          id="transactions-container"
          ref="transactionVirtualScroll"
          :items="filteredTransactions"
          style="height: 93vh"
        >
          <template v-slot:default="{ item }">
            <TransactionsListItem :id="`transaction-${item.pk}`" :transaction="item" @selected-transaction-changed="setTransactionToEdit"></TransactionsListItem>
          </template>
        </v-virtual-scroll>
         <v-empty-state
            v-if="!isLoading && filteredTransactions.length === 0"                            
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
        <DataTable :data="spendingByCategoryTableData" :headers="[]" density="compact"></DataTable>
      </v-card>
    </v-col>
  </v-row>
  
  <TransactionAddForm 
    v-model:show="showAddTransactionDialog" 
    :transaction="selectedTransaction" 
    :tags="tags"
    @refresh="refresh"
  ></TransactionAddForm>
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
import { castToNumber, formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';
import { useUserSettingsStore } from '@/stores/UserSettingsStore';
import { useCategoryAggregatorTransactionSearch } from '@/composables/data/CategoryAggregatorTransactionSearch';
import GenericService from '@/data/services/GenericService';
import type Tag from '@/data/interfaces/Tag';
import TagService from '@/data/services/TagService';
import router from '@/router';
import { useMerchantStore } from '@/stores/MerchantStore';
import { useAccountStore } from '@/stores/AccountStore';
import TransactionDateFilterTypeEnum from '@/data/enumerations/TransactionDateFilterType';
import type { VVirtualScroll } from 'vuetify/components';

  const selectedTransaction = ref<TransactionSearch | undefined>(undefined);
  const transactions = ref<TransactionSearch[]>([]);
  const quickSearchTransactions = ref<TransactionSearch[]>([]);
  const showAddTransactionDialog = ref(false);
  const selectedYear = ref(getCurrentYear());
  const showUploadDialog = ref(false);
  const userSettingsStore = useUserSettingsStore();
  const selectedMonth = ref(getMonth(userSettingsStore.userSettings.maxTransactionDate));
  const categoryStore = useCategoryStore();
  const merchantStore = useMerchantStore();
  const accountStore = useAccountStore();
  const filterCategoryId = ref<number | null>(null);
  const filterMerchantId = ref<number | null>(null);
  const filterAccountId = ref<number | null>(null);
  const filterTagText = ref<string | null>(null);
  const showFilterDrawer = ref(true);
  const includeIgnoredCategories = ref(true);
  const uncategorizedTransactionsOnly = ref(false);
  const searchString = ref("");
  const isLoading = ref(false);
  const isQuickSearchLoading = ref(false);
  const isQuickSearchFocused = ref(false);
  const dateFilterType = ref(TransactionDateFilterTypeEnum.ByMonth.value);
  const customDateRangeFrom = ref(formatDate(getCurrentDate(), DateFormats.ISO));
  const customDateRangeTo = ref(formatDate(getCurrentDate(), DateFormats.ISO));
  const tags = ref<Tag[]>([]);
  const transactionVirtualScroll = ref<VVirtualScroll | null>(null);

  let quickSearchTimer: number | null = null;
  let mainSearchTimer: number | null = null;
  let fileId: string | null = null;
  
  onMounted(async () => {
    if (router.currentRoute.value.query.categoryId) {
      filterCategoryId.value = castToNumber(router.currentRoute.value.query.categoryId.toString());
    }

    if (router.currentRoute.value.query.merchantId) {
      filterMerchantId.value = castToNumber(router.currentRoute.value.query.merchantId.toString());
    }

    if (router.currentRoute.value.query.accountId) {
      filterAccountId.value = castToNumber(router.currentRoute.value.query.accountId.toString());
    }

    if (router.currentRoute.value.query.allDates) {
      dateFilterType.value = TransactionDateFilterTypeEnum.AllDates.value;
    }

    if (router.currentRoute.value.query.fromDate &&
        router.currentRoute.value.query.toDate) {
      customDateRangeFrom.value = formatDate(router.currentRoute.value.query.fromDate.toString(), DateFormats.ISO);
      customDateRangeTo.value = formatDate(router.currentRoute.value.query.toDate.toString(), DateFormats.ISO);
      dateFilterType.value = TransactionDateFilterTypeEnum.CustomRange.value;
    }

    if (router.currentRoute.value.query.uncategorized) {      
      uncategorizedTransactionsOnly.value = true;      
    }

    if (router.currentRoute.value.query.fileId) {
      fileId = router.currentRoute.value.query.fileId.toString();
    }

    Promise.all([
      await getData(),
      tags.value = await new TagService().getMultiple()
    ]);
    
  });

  const filteredTransactions = computed(() => transactions.value
      .filter(x => filterTagText.value ? x.tags.includes(filterTagText.value) : true));
  const fromDate = computed(() => dateFilterType.value === TransactionDateFilterTypeEnum.CustomRange.value ? formatDate(customDateRangeFrom.value, DateFormats.ISO) : createDate(selectedYear.value, selectedMonth.value, 1, DateFormats.ISO));
  const toDate = computed(() => dateFilterType.value === TransactionDateFilterTypeEnum.CustomRange.value ? formatDate(customDateRangeTo.value, DateFormats.ISO) : createDate(selectedYear.value, selectedMonth.value, getDaysInMonth(fromDate.value), DateFormats.ISO));
  const {aggregatedCategories} = useCategoryAggregatorTransactionSearch(filteredTransactions, filterCategoryId)
  const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingFromTransactionsDonutChart(aggregatedCategories);
  
  async function getData(): Promise<void> {

    if (mainSearchTimer) {
      isLoading.value = true;
      clearTimeout(mainSearchTimer);
    }
    
    mainSearchTimer = setTimeout(async () => {
        try {
        transactions.value = [];
  
        transactions.value = await new TransactionSearchService()
          .withUrlParameters({
            fromDate: dateFilterType.value === TransactionDateFilterTypeEnum.AllDates.value ? null : fromDate.value,
            toDate: dateFilterType.value === TransactionDateFilterTypeEnum.AllDates.value ? null : toDate.value,
            includeIgnoredCategories: includeIgnoredCategories.value,
            categoryId: filterCategoryId.value,
            merchantId: filterMerchantId.value,
            accountId: filterAccountId.value,
            uncategorizedTransactionsOnly: uncategorizedTransactionsOnly.value,
            fileId: fileId
          }).getMultiple();           
        } finally {
          isLoading.value = false;

          if (selectedTransaction.value) {
            const x = transactions.value.find(x => x.pk === selectedTransaction.value!.pk)
            if (x) {
              const index = filteredTransactions.value.indexOf(x);
              scrollIntoView("#transaction-" + filteredTransactions.value[0].pk, index);
            }
          }
        }
      }, 2000);
}  

function scrollIntoView(firstItemId: string, indexToScrollTo: number): void {
   const parentEle = document.getElementById("transactions-container");
  
  if (parentEle) {
    const childEle = parentEle.querySelectorAll('[id^="transaction-"]');
    console.log(childEle)
    if (childEle.length > 0) {
      transactionVirtualScroll.value!.scrollToIndex(indexToScrollTo);
      console.log('scrolling')
      setActiveTransaction();
      
    } else {
      console.log('waiting to scroll')
      setTimeout(() => scrollIntoView(firstItemId, indexToScrollTo), 600);
    }
      
  }
}

function setActiveTransaction(): void {
  console.log('attempting to set active transaction')
  const parentEle = document.getElementById("transactions-container");
  
  if (parentEle) {
    const childEle = parentEle.querySelector("#transaction-" + selectedTransaction.value!.pk.toString());

    if (childEle) {
      childEle.classList.add('bg-grey-darken-3');
      console.log('active transaction set')
    } else {
      console.log('waiting to set active transaction')
      setTimeout(() => setActiveTransaction(), 600);
    }
      
  }
}

async function refresh(): Promise<void> {
  Promise.all([
    await getData(),
    tags.value = await new TagService().getMultiple()
  ])
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

async function searchUpdate(searchString: string): Promise<void> {
  if (quickSearchTimer) {
      isQuickSearchLoading.value = true;
    clearTimeout(quickSearchTimer);
  }

  if (!searchString) {
      isQuickSearchLoading.value = false;
      return;
  }

  quickSearchTimer = setTimeout(async () => {
    try {
      quickSearchTransactions.value = await new TransactionSearchService()
        .withUrlParameters({
          searchString: searchString,
          includeIgnored: true
        }).getMultiple();        

    } finally {
      isQuickSearchLoading.value = false;
    }
  }, 1000);       
}
const resultCount = computed(() => quickSearchTransactions.value.length);

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

function quickSearchFocusChanged(focused: boolean): void {
  isQuickSearchFocused.value = focused;
  quickSearchTransactions.value = [];
}

watch(selectedMonth, async () => getData());
watch(selectedYear, async () => getData());
watch(dateFilterType, async () => getData());
watch(filterCategoryId, async () => getData());
watch(uncategorizedTransactionsOnly, async () => getData());
watch(includeIgnoredCategories, async () => getData());
watch(filterMerchantId, async () => getData());
watch(filterAccountId, async () => getData());

</script>
<style scoped>
.scroll {
  height: 93vh;
  overflow: auto;
}
</style>
  