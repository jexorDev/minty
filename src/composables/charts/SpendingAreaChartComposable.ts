import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { useAreaChart } from "../baseCharts/AreaChartComposable";
import type { Ref } from "vue";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";
import CategoryTypeEnum from "@/data/enumerations/CategoryType";
import CategoryReportingTypeEnum from "@/data/enumerations/CategoryReportingType";
import MonthEnum from "@/data/enumerations/MonthEnum";
import type YearCollectionModel from "@/data/classes/YearCollectionModel";

export function useSpendingAreaChart(data: Ref<Map<number, YearCollectionModel>>) {
    
    const xAxisCategories = ref(MonthEnum.getItems().map(x => x.description.substring(0, 3)));
    
    const {options} = useAreaChart(xAxisCategories);

    const series = computed(() => {
        const series = [];
        const map = toValue(data);

        for (const [key, value] of map) {
            series.push({
                name: key.toString(),
                data: getChartData(value.yearData)
            })
        }

        return series;
    });

    return {options, series};
}

function getChartData(data: number[]) {
    const chartData : number[] = [];
    var previousMonthsTotal = 0;

    for (var i = 0; i < 12; i++) {    
        chartData.push(data[i] + previousMonthsTotal);
        previousMonthsTotal += data[i];
    }

    return chartData;
}