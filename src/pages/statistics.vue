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
            <v-select :items="years" v-model="selectedYear" variant="outlined" density="compact"></v-select>
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
                    <v-data-table v-else :items="spendingTotalByYear" density="compact" hide-default-footer></v-data-table>
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
import { useSpendingDonutChart } from '@/composables/SpendingDonutChartComposable';
import { useStackedSpendingBarChart } from '@/composables/SpendingStackedBarChartComposable';
import CategoryReportingTypeEnum from '@/data/enumerations/CategoryReportingType';
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';
import { useCategoryStore } from '@/stores/CategoryStore';
import { getCurrentYear } from '@/utilities/DateArithmeticUtility';
import { formatNumber } from '@/utilities/NumberFormattingUtility';

const selectedYear = ref(getCurrentYear());
const years = ref<number[]>([]);
const filterCategoryId = ref<number | null>(null);
const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
const showFilterDrawer = ref(true);
const reportingType = ref<number | null>(null);

const showStackedBarChartList = ref(false);
const showDonutChartList = ref(false);
const categoryReportingTypeEnum = new CategoryReportingTypeEnum();
const selectedComparisonYear = ref<number | undefined>(undefined);
const categoryStore = useCategoryStore();
const {options: spendingStackedBarChartOptions, series: spendingStackedBarChartSeries} = useStackedSpendingBarChart(categoryMonthTotals, filterCategoryId);
const {options: sependingDonutChartOptions, series: spendingDonutChartSeries } = useSpendingDonutChart(categoryMonthTotals, selectedYear);

const grandTotal = computed<number>(() => spendingStackedBarChartSeries.value.map(x => x.data).reduce((acc, curr) => acc + curr.reduce((a, c) => a + c, 0), 0));
const monthlyAverage = computed<number>(() => grandTotal.value / (12 * (selectedComparisonYear.value ?? 1)))

onMounted(async () => {
    for (var year = 2014; year <= getCurrentYear(); year++) {
        years.value.push(year);
    }  
    
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


const donutChartYears = computed<number[]>(() => {
    const years: number[] = [];

    for (var i = 0; i < (selectedComparisonYear.value ?? 0); i++) {
        years.push(selectedYear.value - i);
    }

    return years;
})

const spendingTotalByYear = computed(() => {
    const array: {
        year: string, 
        janTotal: number, 
        febTotal: number, 
        marTotal: number, 
        aprTotal: number, 
        mayTotal: number, 
        junTotal: number, 
        julTotal: number, 
        augTotal: number, 
        sepTotal: number, 
        octTotal: number, 
        novTotal: number, 
        decTotal: number, 
        total: number
    }[] = [];

    for (var yearIndex = 0; yearIndex < spendingStackedBarChartSeries.value.length; yearIndex++) {
        const currDataSet = spendingStackedBarChartSeries.value[yearIndex];
        array.push({
            year: currDataSet.name, 
            janTotal: currDataSet.data[0], 
            febTotal: currDataSet.data[1], 
            marTotal: currDataSet.data[2], 
            aprTotal: currDataSet.data[3], 
            mayTotal: currDataSet.data[4], 
            junTotal: currDataSet.data[5], 
            julTotal: currDataSet.data[6], 
            augTotal: currDataSet.data[7], 
            sepTotal: currDataSet.data[8], 
            octTotal: currDataSet.data[9], 
            novTotal: currDataSet.data[10], 
            decTotal: currDataSet.data[11], 
            total: currDataSet.data.reduce((acc, curr) => acc + curr, 0)});
    }

    if (spendingStackedBarChartSeries.value.length > 1) {
        const grandTotalLine = {
            year: "MonthTotal", 
            janTotal: array.map(x => x.janTotal).reduce((acc, curr) => acc + curr, 0), 
            febTotal: array.map(x => x.febTotal).reduce((acc, curr) => acc + curr, 0), 
            marTotal: array.map(x => x.marTotal).reduce((acc, curr) => acc + curr, 0), 
            aprTotal: array.map(x => x.aprTotal).reduce((acc, curr) => acc + curr, 0), 
            mayTotal: array.map(x => x.mayTotal).reduce((acc, curr) => acc + curr, 0), 
            junTotal: array.map(x => x.junTotal).reduce((acc, curr) => acc + curr, 0), 
            julTotal: array.map(x => x.julTotal).reduce((acc, curr) => acc + curr, 0), 
            augTotal: array.map(x => x.augTotal).reduce((acc, curr) => acc + curr, 0), 
            sepTotal: array.map(x => x.sepTotal).reduce((acc, curr) => acc + curr, 0), 
            octTotal: array.map(x => x.octTotal).reduce((acc, curr) => acc + curr, 0), 
            novTotal: array.map(x => x.novTotal).reduce((acc, curr) => acc + curr, 0), 
            decTotal: array.map(x => x.decTotal).reduce((acc, curr) => acc + curr, 0), 
            total: array.map(x => x.total).reduce((acc, curr) => acc + curr, 0)
        }
    
        const averageLine = {
            year: "Average",
            janTotal: grandTotalLine.janTotal / spendingStackedBarChartSeries.value.length,
            febTotal: grandTotalLine.febTotal / spendingStackedBarChartSeries.value.length,
            marTotal: grandTotalLine.marTotal / spendingStackedBarChartSeries.value.length,
            aprTotal: grandTotalLine.aprTotal / spendingStackedBarChartSeries.value.length,
            mayTotal: grandTotalLine.mayTotal / spendingStackedBarChartSeries.value.length,
            junTotal: grandTotalLine.junTotal / spendingStackedBarChartSeries.value.length,
            julTotal: grandTotalLine.julTotal / spendingStackedBarChartSeries.value.length,
            augTotal: grandTotalLine.augTotal / spendingStackedBarChartSeries.value.length,
            sepTotal: grandTotalLine.sepTotal / spendingStackedBarChartSeries.value.length,
            octTotal: grandTotalLine.octTotal / spendingStackedBarChartSeries.value.length,
            novTotal: grandTotalLine.novTotal / spendingStackedBarChartSeries.value.length,
            decTotal: grandTotalLine.decTotal / spendingStackedBarChartSeries.value.length,
            total: grandTotalLine.total / spendingStackedBarChartSeries.value.length
        }
    
        array.push(grandTotalLine);
        array.push(averageLine);
    }

    return array;
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