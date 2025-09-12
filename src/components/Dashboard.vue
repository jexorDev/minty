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
        <apexchart  height="350" width="600" :options="chartOptions" :series="series"></apexchart>
      </v-card>

    </v-col>

    <v-col>
      <v-card>
        <apexchart  height="350" width="600" :options="categoryTreemapChartOptions" :series="categoryTreeMapSeries"></apexchart>
      </v-card>

    </v-col>
    <v-col>
      <v-card>
        <apexchart  height="350" width="600" :options="pieChartOptions" :series="pieChartSeries"></apexchart>
      </v-card>

    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';


const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
const totalExpensesCurrentYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 0 &&  x.reportingType === 0 && x.year === selectedCurrentYear.value).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalExpensesPreviousYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.year === selectedCurrentYear.value - 1).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalIncomeCurrentYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 1 && x.reportingType === 0 && x.year === selectedCurrentYear.value).reduce((acc, curr) => { return acc + curr.total}, 0));
const totalIncomePreviousYear = computed(() => categoryMonthTotals.value.filter(x => x.categoryType === 1 && x.reportingType === 0 && x.year === selectedCurrentYear.value - 1).reduce((acc, curr) => { return acc + curr.total}, 0));
const currentYearChartData = ref<number[]>([]);
const previousYearChartData = ref<number[]>([]);
const treemapData = ref<{x: string, y: number}[]>([]);
const pieChartData = ref<{x: string, y: number}[]>([]);
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
              type: 'area',
              zoom: {
                enabled: false
              }
            },
            theme: {
              mode: 'dark'
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },

          
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            }
          };

  const categoryTreeMapSeries = computed(() => [{
              data: treemapData.value
          }
       ]);
const categoryTreemapChartOptions = {
            chart: {
              height: 350,
              type: 'treemap',
            },
              theme: {
              mode: 'dark'
            },
            
          };

      const pieChartSeries = computed(() => [{
              data: pieChartData.value
          }
       ]);
const pieChartOptions = {
            chart: {
              width: 380,
              type: 'donut',
            },
              theme: {
              mode: 'dark'
            },
              responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          };

onMounted(async () => {
  categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
    "fromDate": "01/01/2024",
    "toDate": "12/31/2025"
  }).getMultiple();

  currentYearChartData.value = getChartData(selectedCurrentYear.value);
  previousYearChartData.value = getChartData(selectedCurrentYear.value - 1);
  treemapData.value = getTreemapData(selectedCurrentYear.value).sort((a, b) => {return b.y - a.y});
  pieChartData.value = getTreemapData(selectedCurrentYear.value).sort((a, b) => {return a.y - b.y});
})

function getChartData(year: number) {
  const chartData : number[] = [];

  for (var i = 1; i <= 12; i++) {    
    chartData.push(categoryMonthTotals.value.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.month <= i && x.year === year).reduce((acc, curr) => { return acc + curr.total}, 0));
  }
  return chartData;
}

function getTreemapData(year: number) {
  const chartData: {x: string, y:number}[] = [];

  for (var category of [...new Set(categoryMonthTotals.value.map(x => x.categoryName))]) {
    chartData.push({x: category, y: getCategoryTotal(category, year)});
  }

  return chartData;
}

function getPieChartData(year: number) {
    const chartData: number[] = [];

  for (var category of [...new Set(categoryMonthTotals.value.map(x => x.categoryName))]) {
    chartData.push(getCategoryTotal(category, year));
  }

  return chartData;
}

function getCategoryTotal(categoryName: string, year: number) {
  return categoryMonthTotals.value.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.categoryName === categoryName && x.year === year).reduce((acc, curr) => {return acc + curr.total}, 0)
}
</script>