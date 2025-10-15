import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { useDonutChart } from "./DonutChartComposable";
import type { Ref } from "vue";

export function useSpendingDonutChart(data: Ref<CategoryMonthTotal[]>, year: number) {
    
    const {options} = useDonutChart();

    const series = computed(() => [{
        data: getChartData(toValue(data), year)
    }]);

    return {options, series}
}

function getChartData(data: CategoryMonthTotal[], year: number) {
  const chartData: {x: string, y:number}[] = [];

  for (var category of [...new Set(data.map(x => x.categoryName))]) {
    chartData.push({x: category, y: getCategoryTotal(data, category, year)});
  }

  return chartData.sort((a, b) => {return a.y - b.y});
}

function getCategoryTotal(data: CategoryMonthTotal[], categoryName: string, year: number) {
  return data.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.categoryName === categoryName && x.year === year).reduce((acc, curr) => {return acc + curr.total}, 0)
}