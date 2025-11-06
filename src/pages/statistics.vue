<template>
        <v-toolbar color="secondary-darken-1">
            <v-select label="Year" :items="years" v-model="selectedYear" variant="outlined" density="compact" max-width="200" class="mx-5 mt-5"></v-select>
            <v-autocomplete clearable density="compact" variant="outlined" v-model="filterCategoryId" label="Category" :items="categoryStore.categories" item-title="name" item-value="pk" max-width="300" class="mt-5"></v-autocomplete>
            
        </v-toolbar>
        
        <v-row>
            <v-col cols="12" md="8">
                <v-card >
                    <v-card-text>
                        <apexchart  :options="chartOptions" :series="series"></apexchart>

                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                
                <v-card>
                    <v-card-text>
                        Total: {{ grandTotal }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

</template> 
<script lang="ts" setup>
    import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
    import StatisticsService from '@/data/services/StatisticsService';
    import { useCategoryStore } from '@/stores/CategoryStore';
    import dayjs from 'dayjs';

    const selectedYear = ref(dayjs().year());
    const years = ref<number[]>([]);
    const filterCategoryId = ref<number | null>(null);
    const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);

    const categoryStore = useCategoryStore();

    const maxMonth = computed(() => Math.max(...categoryMonthTotals.value.filter(x => x.total != 0).map(y => y.month)));
    const filteredCategoryMonthTotals = computed(() => categoryMonthTotals.value.filter(x => filterCategoryId.value === null || x.categoryId === filterCategoryId.value));
    const aggregatedCategoryMonthTotals = computed<number[]>(() => {
        const data: number[] = [];

        for (var i = 1; i <= 12; i++) {
            data.push(filteredCategoryMonthTotals.value.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.month === i).reduce((acc, curr) => { return acc + curr.total}, 0));
        }

        return data;
    });
    const grandTotal = computed<number>(() => aggregatedCategoryMonthTotals.value.reduce((acc, curr) => {return acc + curr}, 0));
    const averagedCategoryMonthTotals = computed<number[]>(() => {
        if (maxMonth.value === 0) return [];

        const data: number[] = [];
        
        const average = grandTotal.value / maxMonth.value;

        for (var i = 1; i <= 12; i++) {
            data.push(average);
        }

        return data;
    })

    const series = computed(() => [{
            name: 'Month',
            type: 'column',
            data: aggregatedCategoryMonthTotals.value
          }, {
            name: 'Average',
            type: 'line',
            data: averagedCategoryMonthTotals.value
          }]);

    const chartOptions = {
            chart: {
              type: 'line',
              height: 350,
            },           
            theme: {
                mode: 'dark'
            },
            colors: ['#2196F3', '#50C878'],

            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            yaxis: [{
              title: {
                text: 'Month',
              },
            
            }],
           
          };

    onMounted(async () => {
        for (var year = 2014; year <= dayjs().year(); year++) {
        years.value.push(year);
        }  
        
        await getData();

    });

    async function getData() {
        const fromDate = `${selectedYear.value}-01-01`;
        const toDate = `${selectedYear.value}-12-31`;   

        categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
            "fromDate": fromDate,
            "toDate": toDate
        }).getMultiple();
    }

    watch(selectedYear, async (newValue, oldValue) => {
        await getData();
    });

</script>