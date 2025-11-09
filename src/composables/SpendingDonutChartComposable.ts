import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { useDonutChart } from "./DonutChartComposable";
import type { Ref } from "vue";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";
import CategoryTypeEnum from "@/data/enumerations/CategoryType";
import CategoryReportingTypeEnum from "@/data/enumerations/CategoryReportingType";

export function useSpendingDonutChart(data: Ref<CategoryMonthTotal[]>, year: Ref<number>, showLegend: boolean = false) {
    
    const {options} = useDonutChart(showLegend);

    const series = computed(() => [{
        data: getChartData(toValue(data), toValue(year))
    }]);

    return {options, series}
}

function getChartData(data: CategoryMonthTotal[], year: number) {
  
  const seriesSets: any[] = [];
  
    const categories = [...new Set(data.map(x => x.categoryId))];

    for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      
        seriesSets.push({x: data.find(x => x.categoryId === categories[categoryIndex])?.categoryName, y: aggregateCategoryMonthTotals(toValue(data), {
          year: year,
          categoryId: categories[categoryIndex],
          categoryType: new CategoryTypeEnum().Expense.value,
          categoryReportingTypes: [new CategoryReportingTypeEnum().AlwaysInclude.value]
        })});            

    }
    
    return seriesSets.sort((a, b) => {return b.y - a.y});
}

