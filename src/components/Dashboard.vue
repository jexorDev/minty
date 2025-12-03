<template> 
  <v-container fluid>

    <v-row>
      <v-col cols="12" md="4">
        <v-card color="secondary-darken-1">
          <v-card-title>
            Expenses
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between ">              
              <span class="text-overline">Current Year</span>
              <span class="text-overline">Previous Year</span>
            </div>
            <v-progress-linear
              color="primary"
              height="22"
              :model-value="totalExpensesPreviousYear === 0 ? 0 : totalExpensesCurrentYear / totalExpensesPreviousYear * 100"
              rounded="lg"
            ></v-progress-linear>
            <div class="d-flex justify-space-between pt-1">
              <span class="font-weight-medium">
                {{ formatNumber(totalExpensesCurrentYear, NumberFormats.Price) }}
              </span>
              <span class="text-medium-emphasis"> {{ formatNumber(totalExpensesPreviousYear, NumberFormats.Price) }} </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col  cols="12" md="4">
        <v-card color="secondary-darken-1">
          <v-card-title>
            Income
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between ">              
              <span class="text-overline">Current Year</span>
              <span class="text-overline">Previous Year</span>
            </div>
            <v-progress-linear
              color="primary"
              height="22"
              :model-value="totalIncomePreviousYear === 0 ? 0 : totalIncomeCurrentYear / totalIncomePreviousYear * 100"
              rounded="lg"
            ></v-progress-linear>
            <div class="d-flex justify-space-between pt-1">
              <span class="font-weight-medium">
                {{ formatNumber(totalIncomeCurrentYear, NumberFormats.Price) }}
              </span>
              <span class="text-medium-emphasis"> 
                {{ formatNumber(totalIncomePreviousYear, NumberFormats.Price) }} 
              </span>
            </div>
          
          </v-card-text>
        </v-card>

      </v-col>
       <v-col cols="12" md="4">
          <CashflowCard :total-expenses="totalExpensesCurrentYear" :total-income="totalIncomeCurrentYear"></CashflowCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5">
        <v-card
          title="Spending Over Time Comparison"
          subtitle="This year vs last year">
          <v-card-text>
            <apexchart  :options="spendingAreaChartOptions" :series="spendingAreaChartSeries"></apexchart>
          </v-card-text>
        </v-card>
        
      </v-col>
      <v-col cols="12" md="3">
        <v-card 
          title="Spending by Category"
          subtitle="For this year">
          <template v-slot:append>
             <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-icon
                            icon="mdi-dots-vertical"
                            v-bind="props"
                        >                                            
                        </v-icon>
                    </template>
                    <v-card color="secondary-darken-1">
                      <v-card-text>
                        <div class="text-overline">Chart Type</div>
                        <v-radio-group 
                          v-model="selectedSpendingByCategoryChartType"
                          density="compact">
                          <v-radio label="Donut" :value="0"></v-radio>
                          <v-radio label="Treemap" :value="1"></v-radio>
                        </v-radio-group>
                      </v-card-text>
                    </v-card>
                </v-menu>
           
            
          </template>          
          <v-card-text>
            <apexchart v-if="selectedSpendingByCategoryChartType === 1" :options="spendingTreemapChartOptions" :series="spendingTreemapChartSeries"></apexchart>
            <apexchart v-else :options="spendingDonutChartOptions" :series="spendingDonutChartSeries"></apexchart>
            <DataTable :data="spendingByCategoryTableData" :headers="[]"></DataTable>                    
          </v-card-text>
        </v-card>
      </v-col>      
      <v-col cols="12" md="4">
        <v-row>
          <v-col cols="12" md="6">
            <v-card color="secondary-darken-1">
              <v-card-title>
                Uncategorized Transactions
              </v-card-title>
              <v-card-text>
                <div class="text-h1 d-flex justify-center">{{ uncategorizedTransactions.length }}</div>
              </v-card-text>
              <v-card-actions>
                <v-btn block text="View" variant="tonal" color="primary" @click="routeToUncategorizedTransactions"></v-btn>
              </v-card-actions>
            </v-card>

          </v-col>
          <v-col cols="12" md="6"></v-col>

        </v-row>
        <v-row>
          <v-col>
            <v-card title="Fast approaching budgets">
              <template v-slot:append>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-icon
                            icon="mdi-dots-vertical"
                            v-bind="props"
                        >                                            
                        </v-icon>
                    </template>
                    <v-card color="secondary-darken-1">
                      <v-card-text>
                        <div class="text-overline">Budget Type</div>
                        <v-radio-group v-model="budgetTypeFilter" density="compact">
                          <v-radio label="All" :value="null"></v-radio>
                          <v-radio label="Monthly" :value="BudgetTypeEnum.Monthly.value"></v-radio>
                          <v-radio label="Yearly" :value="BudgetTypeEnum.Yearly.value"></v-radio>
                        </v-radio-group>
                      </v-card-text>
                    </v-card>
                </v-menu>
              </template>
              <v-list max-height="600">

                <v-list-item v-for="budget in sortedBudgets" :key="budget.pk!">
                  <template v-slot:prepend>
                    <v-progress-circular 
                      v-if="budget.currentMonthBudget" 
                      :model-value="budget.budgetPercent * 100"
                      :color="budget.budgetPercent > 1 ? 'error' : 'primary'"
                      size="50"
                      width="6">                 
                    </v-progress-circular>
                  </template>
                  <template v-slot:append>
                    <div >
                      
                    </div>  
                  </template>
                  <v-row>
                    <v-col cols="6" class="pl-5">
                      <div class="text-overline">{{ budget.categoryName }}</div>
                      <div class="text-caption">{{ formatNumber(budget.totalToDate, NumberFormats.Price) }} of {{ formatNumber(budget.amount, NumberFormats.Price) }} used</div>
                    </v-col>
                    <v-col cols="3">
                      <div class="text-overline">Budgeted</div>
                      <div class="text-caption">{{ formatNumber(budget.amount, NumberFormats.Price)}} / {{ budget.type === BudgetTypeEnum.Monthly.value ? "Month" : "Year" }}</div>
                    </v-col>
                    <v-col cols="3">
                      <div class="text-overline">Remaining</div>
                      <div class="text-caption">{{ formatNumber(budget.remaining, NumberFormats.Price)}}</div>
                    </v-col>
                  </v-row>                                    
                  <v-divider thickness="3" class="mt-1"></v-divider>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
        
    </v-row>
  </v-container> 
</template>
<script setup lang="ts">
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';
import { useSpendingDonutChart } from '@/composables/charts/SpendingDonutChartComposable';
import { useSpendingAreaChart } from '@/composables/charts/SpendingAreaChartComposable';
import { useSpendingTreemapChart } from '@/composables/charts/SpendingTreemapChartComposable';
import { castToNumber, formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';
import { aggregateCategoryMonthTotals } from '@/utilities/CategoryMonthAggregator';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';
import { getCurrentYear } from '@/utilities/DateArithmeticUtility';
import { useYearMonthMapAggregator, type YearMonthAggregatorFilter } from '@/composables/data/YearMonthMapAggregatorComposable';
import { type AggregatedCategory, type CategoryAggregatorFilter, useCategoryAggregator } from '@/composables/data/CategoryAggregator';
import router from '@/router';
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import TransactionSearchService from '@/data/services/TransactionSearchService';
import { createDate, DateFormats } from '@/utilities/DateFormattingUtility';
import BudgetModel from '@/data/classes/BudgetModel';
import BudgetService from '@/data/services/BudgetService';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';

const selectedCurrentYear = ref(getCurrentYear());
const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
const selectedSpendingByCategoryChartType = ref(0);
const uncategorizedTransactions = ref<TransactionSearch[]>([]);
const budgets = ref<BudgetModel[]>([]);
const budgetTypeFilter = ref<number | null>(null);

const yearMonthMapFilter = computed<YearMonthAggregatorFilter>(() => {
   return {    
    categoryType: CategoryTypeEnum.Expense.value    
   } as YearMonthAggregatorFilter; 
});
const categoryAggregatorFilter = computed<CategoryAggregatorFilter>(() => {
  return {
    year: selectedCurrentYear.value
  }
});
const { map } = useYearMonthMapAggregator(categoryMonthTotals, yearMonthMapFilter);
const {aggregatedCategories} = useCategoryAggregator(categoryMonthTotals, categoryAggregatorFilter);
const totalExpensesCurrentYear = computed(() => aggregateCategoryMonthTotals(categoryMonthTotals.value, undefined, selectedCurrentYear.value, undefined, CategoryTypeEnum.Expense.value));
const totalExpensesPreviousYear = computed(() => aggregateCategoryMonthTotals(categoryMonthTotals.value, undefined, selectedCurrentYear.value - 1, undefined, CategoryTypeEnum.Expense.value));
const totalIncomeCurrentYear = computed(() => aggregateCategoryMonthTotals(categoryMonthTotals.value, undefined, selectedCurrentYear.value, undefined, CategoryTypeEnum.Income.value ));
const totalIncomePreviousYear = computed(() => aggregateCategoryMonthTotals(categoryMonthTotals.value, undefined, selectedCurrentYear.value - 1, undefined, CategoryTypeEnum.Income.value ));

const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingDonutChart(aggregatedCategories, categoryClicked, false);
const {options: spendingAreaChartOptions, series: spendingAreaChartSeries} = useSpendingAreaChart(map);
const {options: spendingTreemapChartOptions, series: spendingTreemapChartSeries} = useSpendingTreemapChart(aggregatedCategories, categoryClicked);

onMounted(async () => {
  Promise.all([
    categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
      fromDate: createDate(selectedCurrentYear.value - 1, 0, 1, DateFormats.ISO),
      toDate: createDate(selectedCurrentYear.value, 11, 31, DateFormats.ISO), 
      includeIgnored: false
    }).getMultiple(),
    uncategorizedTransactions.value = await new TransactionSearchService().withUrlParameters({
      uncategorizedTransactionsOnly: true,
      includeIgnoredCategories: true
    }).getMultiple(),
    budgets.value = (await new BudgetService().getMultiple().then(data => data.map(x => new BudgetModel(x))))
  ]);
  budgets.value.forEach(async x => await x.setStatistics());
  budgetTypeFilter.value = localStorage.getItem("budgetTypeFilter") === null ? null : castToNumber(localStorage.getItem("budgetTypeFilter")!);
})

const filteredBudgets = computed(() => budgets.value.filter(x => x.type === (budgetTypeFilter.value !== null ? budgetTypeFilter.value : x.type)));
const sortedBudgets = computed(() => (filteredBudgets.value.length > 5 ? filteredBudgets.value.sort((a, b) => a.remaining - b.remaining).slice(0, 5) : filteredBudgets.value));

const spendingByCategoryTableData = computed(() => {
    return aggregatedCategories.value.map(x => {return {name: x.name, total: formatNumber(x.total, NumberFormats.Price)}});
});

function routeToUncategorizedTransactions() {
  router.push({path: "/transactions", query: {allDates: "true", uncategorized: 'true'}})
}

function categoryClicked(category: AggregatedCategory) {
    router.push({path: "/transactions", query: {
        categoryId: category.id,
        fromDate: createDate(selectedCurrentYear.value, 0, 1, DateFormats.ISO),
        toDate: createDate(selectedCurrentYear.value, 11, 31, DateFormats.ISO), 
    }});
}

watch(budgetTypeFilter, () => {
  if (budgetTypeFilter.value === null) {
    localStorage.removeItem("budgetTypeFilter");
  } else {
    localStorage.setItem("budgetTypeFilter", budgetTypeFilter.value.toString());
  }
})

</script>