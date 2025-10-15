<template>  
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          Expenses
        </v-card-title>
        <v-card-text>
          <div>
            <span class="text-subtitle-2">{{ selectedCurrentYear }}</span>
            ${{ totalExpensesCurrentYear }}
          </div>
          <div>
            <span class="text-subtitle-2">{{ selectedCurrentYear - 1 }}</span>
            ${{ totalExpensesPreviousYear }}
          </div>
        </v-card-text>
      </v-card>

    </v-col>
     <v-col>
      <v-card>
        <v-card-title>
          Income
        </v-card-title>
        <v-card-text>
          <div>
            <span class="text-subtitle-2">{{ selectedCurrentYear }}</span>
            ${{ totalIncomeCurrentYear }}
          </div>
          <div>
            <span class="text-subtitle-2">{{ selectedCurrentYear - 1 }}</span>
            ${{ totalIncomePreviousYear }}
          </div>
        </v-card-text>
      </v-card>

    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card>
        <apexchart  height="350" width="600" :options="spendingAreaChartOptions" :series="spendingAreaChartSeries"></apexchart>
      </v-card>
    </v-col>
    <v-col>
      <v-card>
        <apexchart  height="350" width="600" :options="spendingTreemapChartOptions" :series="spendingTreemapChartSeries"></apexchart>
      </v-card>
    </v-col>
    <v-col>
      <v-card>
        <apexchart  height="350" width="600" :options="spendingDonutChartOptions" :series="spendingDonutChartSeries"></apexchart>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';
import { useSpendingDonutChart } from '@/composables/SpendingDonutChartComposable';
import { useSpendingAreaChart } from '@/composables/SpendingAreaChartComposable';
import { useSpendingTreemapChart } from '@/composables/SpendingTreemapChartComposable';

const selectedCurrentYear = ref(2025);
const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);

const totalExpensesCurrentYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 0 &&  x.reportingType === 0 && x.year === selectedCurrentYear.value).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalExpensesPreviousYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.year === selectedCurrentYear.value - 1).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalIncomeCurrentYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 1 && x.reportingType === 0 && x.year === selectedCurrentYear.value).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalIncomePreviousYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 1 && x.reportingType === 0 && x.year === selectedCurrentYear.value - 1).reduce((acc, curr) => { return acc + curr.total}, 0));

const {options: spendingDonutChartOptions, series: spendingDonutChartSeries} = useSpendingDonutChart(categoryMonthTotals, selectedCurrentYear.value);
const {options: spendingAreaChartOptions, series: spendingAreaChartSeries} = useSpendingAreaChart(categoryMonthTotals, selectedCurrentYear.value, selectedCurrentYear.value - 1);
const {options: spendingTreemapChartOptions, series: spendingTreemapChartSeries} = useSpendingTreemapChart(categoryMonthTotals, selectedCurrentYear.value);

onMounted(async () => {
  categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
    "fromDate": `01/01/${selectedCurrentYear.value - 1}`,
    "toDate": `12/31/${selectedCurrentYear.value}`
  }).getMultiple();
})

</script>