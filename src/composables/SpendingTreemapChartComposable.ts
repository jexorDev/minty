import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { useTreemapChart } from "./TreemapChartComposable";
import type { Ref } from "vue";

export function useSpendingTreemapChart(data: Ref<CategoryMonthTotal[]>, year: number) {
    const {options} = useTreemapChart();

    const series =  computed(() => [{
            data: getChartData(toValue(data), year)
        }
    ]);

    return {options, series};
}

function getChartData(data: CategoryMonthTotal[], year: number) {
  const chartData: {x: string, y:number}[] = [];

  for (var category of [...new Set(data.map(x => x.categoryName))]) {
    chartData.push({x: category, y: getCategoryTotal(data, category, year)});
  }

  return chartData.sort((a, b) => {return b.y - a.y});
}

function getCategoryTotal(data: CategoryMonthTotal[], categoryName: string, year: number) {
  return data.filter(x => x.categoryType === 0 && x.reportingType === 0 && x.categoryName === categoryName && x.year === year).reduce((acc, curr) => {return acc + curr.total}, 0)
}