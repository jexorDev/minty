import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { useDonutChart } from "./DonutChartComposable";
import type { Ref } from "vue";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";
import CategoryTypeEnum from "@/data/enumerations/CategoryType";
import CategoryReportingTypeEnum from "@/data/enumerations/CategoryReportingType";

export function useSpendingDonutChart(data: Ref<CategoryMonthTotal[]>, year: Ref<number>) {
    
    const {options} = useDonutChart();

    const series = computed(() => [{
        data: getChartData(toValue(data), toValue(year))
    }]);

    return {options, series}
}

function getChartData(data: CategoryMonthTotal[], year: number) {
  const chartData: {x: string, y:number}[] = [];

  for (var category of [...new Set(data.map(x => x.categoryName))]) {
    chartData.push({x: category, y: getCategoryTotal(data, category, year)});
  }

  return chartData.sort((a, b) => {return b.y - a.y});
}

function getCategoryTotal(data: CategoryMonthTotal[], categoryName: string, year: number) {
  return aggregateCategoryMonthTotals(data, { 
    year: year, 
    categoryName: categoryName, 
    categoryType: new CategoryTypeEnum().Expense.value, 
    categoryReportingTypes: [new CategoryReportingTypeEnum().AlwaysInclude.value]
  });
}