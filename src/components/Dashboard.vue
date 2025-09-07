<template>  
  <router-link to="/transactions">Transactions</router-link>
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
        <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
      </v-card>

    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';


const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
const totalExpensesCurrentYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 0 && x.year === selectedCurrentYear.value).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalExpensesPreviousYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 0 && x.year === selectedCurrentYear.value - 1).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalIncomeCurrentYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 1 && x.year === selectedCurrentYear.value).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalIncomePreviousYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 1 && x.year === selectedCurrentYear.value - 1).reduce((acc, curr) => { return acc + curr.total}, 0));
const currentYearChartData = ref<number[]>([]);
const previousYearChartData = ref<number[]>([]);
const selectedCurrentYear = ref(2025);

const series = computed(() => [{
              name: "Current Year",
              data: currentYearChartData.value
          },
        {
              name: "Previous Year",
              data: previousYearChartData.value
          }]);
const chartOptions = {
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'Product Trends by Month',
              align: 'left'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            }
          };

onMounted(async () => {
  categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
    "fromDate": "01/01/2024",
    "toDate": "12/31/2025"
  }).getMultiple();

  currentYearChartData.value = getChartData(selectedCurrentYear.value);
  previousYearChartData.value = getChartData(selectedCurrentYear.value - 1);

})

function getChartData(year: number) {
  const chartData : number[] = [];

  for (var i = 1; i <= 12; i++) {    
    chartData.push(categoryMonthTotals.value.filter(x => x.categoryType === 0 && x.month === i && x.year === year).reduce((acc, curr) => { return acc + curr.total}, 0));
  }
  return chartData;
}
</script>