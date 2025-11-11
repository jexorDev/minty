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
                {{ formatNumber(totalIncomeCurrentYear * -1, NumberFormats.Price) }}
              </span>
              <span class="text-medium-emphasis"> 
                {{ formatNumber(totalIncomePreviousYear * -1, NumberFormats.Price) }} 
              </span>
            </div>
          
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card
          title="Spending Over Time Comparison"
          subtitle="This year vs last year">
          <v-card-text>
            <apexchart  :options="spendingAreaChartOptions" :series="spendingAreaChartSeries"></apexchart>
          </v-card-text>
        </v-card>
        
      </v-col>
      <v-col>
        <v-card 
          title="Spending by Category"
          subtitle="For this year">
          <template v-slot:append>
            <v-radio-group 
              v-model="selectedSpendingByCategoryChartType"
              inline 
              density="compact">
              <v-radio label="Donut" :value="0"></v-radio>
              <v-radio label="Treemap" :value="1"></v-radio>
            </v-radio-group>
            
          </template>          
          <v-card-text>
            <apexchart v-if="selectedSpendingByCategoryChartType === 1" :options="spendingTreemapChartOptions" :series="spendingTreemapChartSeries"></apexchart>
            <apexchart v-else :options="spendingDonutChartOptions" :series="spendingDonutChartSeries"></apexchart>

          </v-card-text>

        </v-card>
        
      </v-col>      
    </v-row>
  </v-container> 
</template>
<script setup lang="ts">
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';
import { useSpendingDonutChart } from '@/composables/SpendingDonutChartComposable';
import { useSpendingAreaChart } from '@/composables/SpendingAreaChartComposable';
import { useSpendingTreemapChart } from '@/composables/SpendingTreemapChartComposable';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';
import { aggregateCategoryMonthTotals } from '@/utilities/CategoryMonthAggregator';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';
import CategoryReportingTypeEnum from '@/data/enumerations/CategoryReportingType';
import { getCurrentYear } from '@/utilities/DateArithmeticUtility';

const selectedCurrentYear = ref(getCurrentYear());
const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
const selectedSpendingByCategoryChartType = ref(0);
const categoryTypeEnum = new CategoryTypeEnum();
const categoryReportingTypeEnum = new CategoryReportingTypeEnum();

const totalExpensesCurrentYear = computed(() => aggregateCategoryMonthTotals(categoryMonthTotals.value, { year: selectedCurrentYear.value, categoryType: categoryTypeEnum.Expense.value, categoryReportingTypes: [categoryReportingTypeEnum.AlwaysInclude.value] }));
const totalExpensesPreviousYear = computed(() => aggregateCategoryMonthTotals(categoryMonthTotals.value, { year: selectedCurrentYear.value - 1, categoryType: categoryTypeEnum.Expense.value, categoryReportingTypes: [categoryReportingTypeEnum.AlwaysInclude.value] }));
const totalIncomeCurrentYear = computed(() => aggregateCategoryMonthTotals(categoryMonthTotals.value, { year: selectedCurrentYear.value, categoryType: categoryTypeEnum.Income.value, categoryReportingTypes: [categoryReportingTypeEnum.AlwaysInclude.value] }));
const totalIncomePreviousYear = computed(() => aggregateCategoryMonthTotals(categoryMonthTotals.value, { year: selectedCurrentYear.value - 1, categoryType: categoryTypeEnum.Income.value, categoryReportingTypes: [categoryReportingTypeEnum.AlwaysInclude.value] }));

const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingDonutChart(categoryMonthTotals, selectedCurrentYear, true);
const {options: spendingAreaChartOptions, series: spendingAreaChartSeries} = useSpendingAreaChart(categoryMonthTotals, selectedCurrentYear.value, selectedCurrentYear.value - 1);
const {options: spendingTreemapChartOptions, series: spendingTreemapChartSeries} = useSpendingTreemapChart(categoryMonthTotals, selectedCurrentYear.value);

onMounted(async () => {
  categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
    "fromDate": `01/01/${selectedCurrentYear.value - 1}`,
    "toDate": `12/31/${selectedCurrentYear.value}`
  }).getMultiple();
})

</script>