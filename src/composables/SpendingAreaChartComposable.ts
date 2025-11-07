import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { useAreaChart } from "./AreaChartComposable";
import type { Ref } from "vue";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";
import CategoryTypeEnum from "@/data/enumerations/CategoryType";
import CategoryReportingTypeEnum from "@/data/enumerations/CategoryReportingType";
import MonthEnum from "@/data/enumerations/MonthEnum";

export function useSpendingAreaChart(data: Ref<CategoryMonthTotal[]>, firstYear: number, secondYear: number) {
    
    const monthEnum = new MonthEnum();
    const xAxisCategories = ref(monthEnum.getItems().map(x => x.description.substring(0, 3)));
    
    const {options} = useAreaChart(xAxisCategories);

    const series = computed(() => [{
        name: "Current Year",
        data: getChartData(toValue(data), firstYear)
    },
    {
        name: "Previous Year",
        data: getChartData(toValue(data), secondYear)
    }]);

    return {options, series};
}

function getChartData(data: CategoryMonthTotal[], year: number) {
    const chartData : number[] = [];
    var previousMonthsTotal = 0;

    for (var i = 0; i < 12; i++) {    
        const currentMonthTotal = aggregateCategoryMonthTotals(data, { 
            year: year, 
            month: i,
            categoryType: new CategoryTypeEnum().Expense.value, 
            categoryReportingTypes: [new CategoryReportingTypeEnum().AlwaysInclude.value]
        });
        
        chartData.push(currentMonthTotal + previousMonthsTotal);
        previousMonthsTotal += currentMonthTotal;
    }

    return chartData;
}