import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { useAreaChart } from "./AreaChartComposable";
import type { Ref } from "vue";

export function useSpendingAreaChart(data: Ref<CategoryMonthTotal[]>, firstYear: number, secondYear: number) {
    
    const xAxisCategories = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    
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

    for (var i = 1; i <= 12; i++) {    
        chartData.push(data.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.month <= i && x.year === year).reduce((acc, curr) => { return acc + curr.total}, 0));
    }

    return chartData;
}