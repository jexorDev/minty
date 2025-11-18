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
        <v-list-item v-if="selectedViewType !== StatisticsPageViewTypeEnum.NetIncome.value">
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
        <v-list-item v-if="selectedViewType !== StatisticsPageViewTypeEnum.NetIncome.value">
            <v-list-item-subtitle>Category</v-list-item-subtitle>
            <v-autocomplete clearable v-model="filterCategoryId" :items="filteredCategories" item-title="name" item-value="pk" variant="outlined" density="compact"></v-autocomplete>
        </v-list-item>
      
        </v-list>
    </v-navigation-drawer>
    <v-toolbar color="secondary-darken-1" density="compact">
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn
                    color="primary"
                    variant="text"
                    density="compact"
                    append-icon="mdi-chevron-down"
                    v-bind="props"
                >
                    {{  StatisticsPageViewTypeEnum.getItemByValue(selectedViewType)?.description }}
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="item of StatisticsPageViewTypeEnum.getItems()" :title="item.description" @click="selectedViewType = item.value"></v-list-item>                            
            </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <v-btn @click="showFilterDrawer = !showFilterDrawer" prepend-icon="mdi-filter-variant" color="primary" :variant="showFilterDrawer ? `flat` : `outlined`">Filter</v-btn>
    </v-toolbar>
    
    <v-container fluid>
    
    <v-row>
        <v-col cols="12" md="8">
            <v-card >
                <v-card-title>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                        <v-btn
                            color="primary"
                            variant="text"
                            density="compact"
                            append-icon="mdi-chevron-down"
                            v-bind="props"
                        >
                            Chart Type
                        </v-btn>
                        </template>
                        <v-list>
                            <v-list-item :title="ChartTypeEnum.Bar.description" @click="selectedSpendingChartType = ChartTypeEnum.Bar.value"></v-list-item>                            
                            <v-list-item :title="ChartTypeEnum.Table.description" @click="selectedSpendingChartType = ChartTypeEnum.Table.value"></v-list-item>                            
                            <v-list-item :title="ChartTypeEnum.Heatmap.description" @click="selectedSpendingChartType = ChartTypeEnum.Heatmap.value"></v-list-item>                            
                        </v-list>
                    </v-menu>
                </v-card-title>
                <v-card-text>
                    <apexchart :key="key" v-if="selectedSpendingChartType === ChartTypeEnum.Bar.value" :options="spendingStackedBarChartOptions" :series="spendingStackedBarChartSeries"></apexchart>
                    <v-data-table v-if="selectedSpendingChartType === ChartTypeEnum.Table.value" :items="spendingTotalByYear" :headers="spendingTotalByYearHeaders" density="compact" hide-default-footer></v-data-table>
                    <apexchart v-if="selectedSpendingChartType === ChartTypeEnum.Heatmap.value" :options="spendingHeatMapChartOptions" :series="spendingHeatMapChartSeries"></apexchart>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">     
             <v-card color="secondary-darken-1" class="mb-2">
                <v-card-text>
                    <v-row>
                        <v-col>
                            <div class="text-overline">Total</div>
                            <span class="font-weight-medium">
                                {{ formatNumber(grandTotal, NumberFormats.Price) }}
                            </span>

                        </v-col>
                        <v-col>
                            <div class="text-overline">Monthly Avg</div>
                            <span class="font-weight-medium">
                                {{ formatNumber(monthlyAverage, NumberFormats.Price) }}

                            </span>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>       
            <CashflowCard v-if="selectedViewType === StatisticsPageViewTypeEnum.NetIncome.value"
                :total-income="incomeTotal"
                :total-expenses="expensesTotal"></CashflowCard>
            <v-card v-else>
                 <v-card-title>
                    <v-menu>
                        <template v-slot:activator="{ props }">
                        <v-btn
                            color="primary"
                            variant="text"
                            density="compact"
                            append-icon="mdi-chevron-down"
                            v-bind="props"
                        >
                            Chart Type
                        </v-btn>
                        </template>
                        <v-list>
                            <v-list-item :title="ChartTypeEnum.Donut.description" @click="selectedCategoryChartType = ChartTypeEnum.Donut.value"></v-list-item>                            
                            <v-list-item :title="ChartTypeEnum.Treemap.description" @click="selectedCategoryChartType = ChartTypeEnum.Treemap.value"></v-list-item>                            
                        </v-list>
                    </v-menu>
                </v-card-title>
                <v-card-text>                    
                    <apexchart v-if="selectedCategoryChartType === ChartTypeEnum.Donut.value"  :options="sependingDonutChartOptions" :series="spendingDonutChartSeries"></apexchart>
                    <apexchart v-else :options="spendingTreemapChartOptions" :series="spendingTreemapChartSeries"></apexchart>
                    <DataTable :data="spendingByCategoryTableData" :headers="[]"></DataTable>                    
                </v-card-text>
            </v-card>            
           
        </v-col>
    </v-row>
</v-container>
</template> 
<script lang="ts" setup>
import { useYearMonthMapAggregator, type YearMonthAggregatorFilter } from '@/composables/data/YearMonthMapAggregatorComposable';
import { useSpendingByMonthHeatmapChart } from '@/composables/charts/SpendingByMonthHeatmapChartComposable';
import { useSpendingTreemapChart } from '@/composables/charts/SpendingTreemapChartComposable';
import { useSpendingDonutChart } from '@/composables/charts/SpendingDonutChartComposable';
import { useStackedSpendingBarChart } from '@/composables/charts/SpendingStackedBarChartComposable';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';
import ChartTypeEnum from '@/data/enumerations/ChartTypeEnum';
import MonthEnum from '@/data/enumerations/MonthEnum';
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import StatisticsService from '@/data/services/StatisticsService';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useUserSettingsStore } from '@/stores/UserSettingsStore';
import { getCurrentYear, getDaysInMonth } from '@/utilities/DateArithmeticUtility';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';
import { useCategoryAggregator, type AggregatedCategory, type CategoryAggregatorFilter } from '@/composables/data/CategoryAggregator';
import StatisticsPageViewTypeEnum from '@/data/enumerations/StatisticsPageViewType';
import YearCollectionModel from '@/data/classes/YearCollectionModel';
import router from "@/router";
import { createDate, DateFormats } from '@/utilities/DateFormattingUtility';

const selectedYear = ref(getCurrentYear());
const filterCategoryId = ref<number | null>(null);
const categoryMonthTotals = ref<CategoryMonthTotal[]>([]);
const showFilterDrawer = ref(true);
const selectedViewType = ref<number>(StatisticsPageViewTypeEnum.Expenses.value);
const selectedComparisonYear = ref<number | undefined>(undefined);
const categoryStore = useCategoryStore();
const userSettingsStore = useUserSettingsStore();  
const key = ref(0);

const grandTotal = computed<number>(() => {
    var grandTotal = 0;

    for (const value of currentMap.value.values()) {
        grandTotal += value.getTotal();
    }
    return grandTotal;
});
const expensesTotal = computed<number>(() => {
    var grandTotal = 0;

    for (const value of expensesMap.value.values()) {
        grandTotal += value.getTotal();
    }
    return grandTotal;
});
const incomeTotal = computed<number>(() => {
    var grandTotal = 0;

    for (const value of incomeMap.value.values()) {
        grandTotal += value.getTotal();
    }
    return grandTotal;
});
const monthlyAverage = computed<number>(() => grandTotal.value / (12 * (selectedComparisonYear.value ?? 1)))
const selectedSpendingChartType = ref(ChartTypeEnum.Bar.value);
const selectedCategoryChartType = ref(ChartTypeEnum.Donut.value);

onMounted(async () => {   
    await getData();
});

const fromDate = computed(() => `${selectedYear.value - (selectedComparisonYear.value ?? 0)}-01-01`)
const toDate = computed(() => `${selectedYear.value}-12-31`)

async function getData() {    
    categoryMonthTotals.value = await new StatisticsService().withUrlParameters({
        "fromDate": fromDate.value,
        "toDate": toDate.value,
        "includeIgnored": false
    }).getMultiple();
}

const expenseYearMonthMapFilter = computed<YearMonthAggregatorFilter>(() => {
   return {
    categoryId: filterCategoryId.value,
    categoryType: CategoryTypeEnum.Expense.value
   } as YearMonthAggregatorFilter; 
});
const incomeYearMonthMapFilter = computed<YearMonthAggregatorFilter>(() => {
   return {
    categoryId: filterCategoryId.value,
    categoryType: CategoryTypeEnum.Income.value
   } as YearMonthAggregatorFilter; 
});
const categoryAggregatorFilter = computed<CategoryAggregatorFilter>(() => {
  return {
    categoryId: filterCategoryId.value,
    categoryType: selectedViewType.value === StatisticsPageViewTypeEnum.Expenses.value ? CategoryTypeEnum.Expense.value : CategoryTypeEnum.Income.value,
  } as CategoryAggregatorFilter;
});

const { map: expensesMap } = useYearMonthMapAggregator(categoryMonthTotals, expenseYearMonthMapFilter);
const { map: incomeMap } = useYearMonthMapAggregator(categoryMonthTotals, incomeYearMonthMapFilter);
const {aggregatedCategories} = useCategoryAggregator(categoryMonthTotals, categoryAggregatorFilter);

const netIncomeMap = computed(() => {
    const mergedMap: Map<string, YearCollectionModel> = new Map();

    for (const [key, value] of expensesMap.value) {        
        const newExpenses = new YearCollectionModel(value.yearData);
        newExpenses.negateValues();
        mergedMap.set(`${key} Expenses`, newExpenses);
    }

    for (const [key, value] of incomeMap.value) {
        mergedMap.set(`${key} Income`, value);
    }

    return mergedMap;
});

const currentMap = computed(() => {
    if (selectedViewType.value === StatisticsPageViewTypeEnum.Expenses.value) {
        return expensesMap.value;
    } else if (selectedViewType.value === StatisticsPageViewTypeEnum.Income.value) {
        return incomeMap.value;
    } else {
        return netIncomeMap.value;
    }
})

const filteredCategories = computed(() => selectedViewType.value === StatisticsPageViewTypeEnum.Expenses.value 
                                            ? categoryStore.categories.filter(x => x.type === CategoryTypeEnum.Expense.value) 
                                            : categoryStore.categories.filter(x => x.type === CategoryTypeEnum.Income.value));
const isNetIncomeChart = computed(() => selectedViewType.value === StatisticsPageViewTypeEnum.NetIncome.value);
const {options: spendingHeatMapChartOptions, series: spendingHeatMapChartSeries} = useSpendingByMonthHeatmapChart(expensesMap);
const {options: spendingStackedBarChartOptions, series: spendingStackedBarChartSeries} = useStackedSpendingBarChart(currentMap, isNetIncomeChart, monthClicked);
const {options: sependingDonutChartOptions, series: spendingDonutChartSeries } = useSpendingDonutChart(aggregatedCategories, categoryClicked);
const {options: spendingTreemapChartOptions, series: spendingTreemapChartSeries} = useSpendingTreemapChart(aggregatedCategories, categoryClicked);

function categoryClicked(category: AggregatedCategory) {
    router.push({path: "/transactions", query: {
        categoryId: category.id,
        fromDate: fromDate.value,
        toDate: toDate.value
    }});
}

function monthClicked(year: number, month: number) {
    const fromDate = createDate(year, month, 1, DateFormats.ISO);
    const toDate = createDate(year, month, getDaysInMonth(fromDate), DateFormats.ISO);

    router.push({path: "/transactions", query: {
        categoryId: filterCategoryId.value ?? "",
        fromDate: fromDate,
        toDate: toDate,
    }})
}

const spendingTotalByYearHeaders = computed(() => {
    const headerArray: any[] = [];

    headerArray.push({ title: 'Year', key: 'description' }  );
    for (var month of MonthEnum.getItems()) {
        headerArray.push({ title: month.description, key: month.value.toString()}  )
    }

    headerArray.push({ title: 'Total', key: 'total' }  );
    headerArray.push({ title: 'Average', key: 'average' }  );

    return headerArray;
});

const spendingTotalByYear = computed(() => {
    const yearsData: any[]  = [];
    const yearsDataFormatted: any[]  = [];

    for (const [key, value] of currentMap.value) {
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
    return aggregatedCategories.value.map(x => {return {name: x.name, total: formatNumber(x.total, NumberFormats.Price)}});
});

watch(selectedYear, async () => await getData());
watch(selectedComparisonYear, async () => await getData());
watch(selectedViewType, (newValue, oldValue) => {
    filterCategoryId.value = null;
    if (newValue === StatisticsPageViewTypeEnum.NetIncome.value || oldValue === StatisticsPageViewTypeEnum.NetIncome.value){
        selectedComparisonYear.value = undefined;        
        key.value++
    }
});
</script>