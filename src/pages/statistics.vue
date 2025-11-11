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
            <v-select :items="userSettingsStore.yearsOfData" v-model="selectedYear" variant="outlined" density="compact"></v-select>
        </v-list-item>
        <v-list-item>
            <v-list-item-subtitle>Comparison with</v-list-item-subtitle>
            <v-chip-group 
                v-model="selectedComparisonYear"            
                color="primary"  
                column
                >
            <v-chip :value="1">Prior year</v-chip>          
            <v-chip :value="2">Prior two years</v-chip>          
            <v-chip :value="3">Prior three years</v-chip>    
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
        <v-spacer></v-spacer>
        <v-btn @click="showFilterDrawer = !showFilterDrawer" prepend-icon="mdi-filter-variant" color="primary" :variant="showFilterDrawer ? `flat` : `outlined`">Filter</v-btn>
    </v-toolbar>
        
    <v-row no-gutters>
        <v-col cols="12" md="8">
            <v-card >
                <v-card-title>
                    <v-switch 
                        v-model="showStackedBarChartList" 
                        label="List View"
                        density="compact">
                    </v-switch>
                </v-card-title>
                <v-card-text>
                    <apexchart v-if="!showStackedBarChartList" :options="spendingStackedBarChartOptions" :series="spendingStackedBarChartSeries"></apexchart>
                    <v-data-table v-else :items="spendingTotalByYear" :headers="spendingTotalByYearHeaders" density="compact" hide-default-footer></v-data-table>
                    <apexchart :options="spendingHeatMapChartOptions" :series="spendingHeatMapChartSeries"></apexchart>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">     
             <v-card color="secondary-darken-1" class="my-2">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <div class="text-overline">Total</div>
                            {{ formatNumber(grandTotal) }}

                        </v-col>
                        <v-col>
                            <div class="text-overline">Monthly Avg</div>
                            {{ formatNumber(monthlyAverage) }}
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>       
            <v-card>
                <v-card-title>
                    <v-switch 
                        v-model="showDonutChartList" 
                        label="List View"
                        density="compact">
                    </v-switch>
                </v-card-title>
                <v-card-text>                    
                    <apexchart v-if="!showDonutChartList"  :options="sependingDonutChartOptions" :series="spendingDonutChartSeries"></apexchart>
                    <DataTable v-else :data="spendingByCategoryTableData" :headers="[]"></DataTable>                    
                </v-card-text>
            </v-card>            
           
        </v-col>
    </v-row>

</template> 
<script lang="ts" setup>
import { useYearMonthMapAggregator } from '@/composables/data/YearMonthMapAggregatorComposable';
import { useSpendingByMonthHeatmapChart } from '@/composables/SpendingByMonthHeatmapChartComposable';
import { useSpendingDonutChart } from '@/composables/SpendingDonutChartComposable';
import { useStackedSpendingBarChart } from '@/composables/SpendingStackedBarChartComposable';
import YearCollectionModel from '@/data/classes/YearCollectionModel';
import CategoryReportingTypeEnum from '@/data/enumerations/CategoryReportingType';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';
import MonthEnum from '@/data/enumerations/MonthEnum';
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useUserSettingsStore } from '@/stores/UserSettingsStore';
import type { CategoryMonthAggregatorFilter } from '@/utilities/CategoryMonthAggregator';
import { getCurrentYear } from '@/utilities/DateArithmeticUtility';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const selectedYear = ref(getCurrentYear());
const filterCategoryId = ref<number | null>(null);
const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
const showFilterDrawer = ref(true);
const reportingType = ref<number | null>(null);

const showStackedBarChartList = ref(false);
const showDonutChartList = ref(false);
const categoryReportingTypeEnum = new CategoryReportingTypeEnum();
const selectedComparisonYear = ref<number | undefined>(undefined);
const categoryStore = useCategoryStore();
const userSettingsStore = useUserSettingsStore();

const {options: sependingDonutChartOptions, series: spendingDonutChartSeries } = useSpendingDonutChart(categoryMonthTotals, selectedYear);
const grandTotal = computed<number>(() => spendingStackedBarChartSeries.value.map(x => x.data).reduce((acc, curr) => acc + curr.reduce((a, c) => a + c, 0), 0));
const monthlyAverage = computed<number>(() => grandTotal.value / (12 * (selectedComparisonYear.value ?? 1)))

onMounted(async () => {    
    await getData();
});

async function getData() {    
    const fromDate = `${selectedYear.value - (selectedComparisonYear.value ?? 0)}-01-01`;
    const toDate = `${selectedYear.value}-12-31`;   

    categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
        "fromDate": fromDate,
        "toDate": toDate
    }).getMultiple();
}

const yearMonthMapFilter = computed<CategoryMonthAggregatorFilter>(() => {
   return {
    categoryId: filterCategoryId.value,
    categoryType: new CategoryTypeEnum().Expense.value,
    categoryReportingTypes: [new CategoryReportingTypeEnum().AlwaysInclude.value]
   } as CategoryMonthAggregatorFilter; 
});
const { map } = useYearMonthMapAggregator(categoryMonthTotals, yearMonthMapFilter);
const {options: spendingHeatMapChartOptions, series: spendingHeatMapChartSeries} = useSpendingByMonthHeatmapChart(map);
const {options: spendingStackedBarChartOptions, series: spendingStackedBarChartSeries} = useStackedSpendingBarChart(map);

const spendingTotalByYearHeaders = computed(() => {
    const headerArray: any[] = [];

    headerArray.push({ title: 'Year', key: 'description' }  );
    for (var month of new MonthEnum().getItems()) {
        headerArray.push({ title: month.description, key: month.value.toString()}  )
    }

    headerArray.push({ title: 'Total', key: 'total' }  );
    headerArray.push({ title: 'Average', key: 'average' }  );

    return headerArray;
});

const spendingTotalByYear = computed(() => {
    const yearsData: any[]  = [];
    const yearsDataFormatted: any[]  = [];

    for (const [key, value] of map.value) {
        var yearData: any = {};
        var yearDataFormatted: any = {};
        yearDataFormatted.description = key.toString();

        for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
            yearDataFormatted[`${monthIndex}`] = formatNumber(value.getMonthData(monthIndex), NumberFormats.Price);
            yearData[`${monthIndex}`] = value.getMonthData(monthIndex);
        }

        yearDataFormatted.total = formatNumber(value.getTotal(), NumberFormats.Price);
        yearDataFormatted.average = formatNumber(value.getAverage(), NumberFormats.Price);

        yearData.total = value.getTotal();

        yearsData.push(yearData);
        yearsDataFormatted.push(yearDataFormatted);
    }

    if (yearsData.length > 1) {
        var totalData: any = {};
        var averageData: any = {};
        totalData.description = "Total"
        averageData.description = "Average";
    
        for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
            var yearMonthTotal = 0;
            for (var yearIndex = 0; yearIndex < yearsData.length; yearIndex++) {
                yearMonthTotal += yearsData[yearIndex][`${monthIndex}`];
            }
    
            totalData[`${monthIndex}`] = formatNumber(yearMonthTotal, NumberFormats.Price);
            averageData[`${monthIndex}`] = formatNumber(yearMonthTotal / yearsData.length, NumberFormats.Price);
        }
    
        yearsDataFormatted.push(totalData);
        yearsDataFormatted.push(averageData);
    }


    return yearsDataFormatted;
});

  const spendingByCategoryTableData = computed(() => {
    if (spendingDonutChartSeries.value.length > 0) {
      return spendingDonutChartSeries.value[0].data;
    } else {
      return [];
    }
  });

watch(selectedYear, async () => await getData());
watch(selectedComparisonYear, async () => await getData());

</script>