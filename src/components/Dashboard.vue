<template> 
  <v-container fluid>

    <v-row>
      <v-col>
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
      <v-col>
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
        <div class="text-overline">Spending over time comparison</div>
        <apexchart  height="350" width="600" :options="spendingAreaChartOptions" :series="spendingAreaChartSeries"></apexchart>
        
      </v-col>
      <v-col>
        <div class="text-overline">Spending by category</div>

        <apexchart  height="350" width="600" :options="spendingTreemapChartOptions" :series="spendingTreemapChartSeries"></apexchart>
        
      </v-col>
      <v-col>
        <div class="text-overline">Spending by category</div>

        <apexchart  height="350" width="600" :options="spendingDonutChartOptions" :series="spendingDonutChartSeries"></apexchart>
        
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

const selectedCurrentYear = ref(2025);
const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);

const totalExpensesCurrentYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 0 &&  x.reportingType === 0 && x.year === selectedCurrentYear.value).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalExpensesPreviousYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.year === selectedCurrentYear.value - 1).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalIncomeCurrentYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 1 && x.reportingType === 0 && x.year === selectedCurrentYear.value).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalIncomePreviousYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 1 && x.reportingType === 0 && x.year === selectedCurrentYear.value - 1).reduce((acc, curr) => { return acc + curr.total}, 0));

const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingDonutChart(categoryMonthTotals, selectedCurrentYear);
const {options: spendingAreaChartOptions, series: spendingAreaChartSeries} = useSpendingAreaChart(categoryMonthTotals, selectedCurrentYear.value, selectedCurrentYear.value - 1);
const {options: spendingTreemapChartOptions, series: spendingTreemapChartSeries} = useSpendingTreemapChart(categoryMonthTotals, selectedCurrentYear.value);

onMounted(async () => {
  categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
    "fromDate": `01/01/${selectedCurrentYear.value - 1}`,
    "toDate": `12/31/${selectedCurrentYear.value}`
  }).getMultiple();
})

</script>