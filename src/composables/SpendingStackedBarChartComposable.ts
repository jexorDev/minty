import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import type {Ref} from 'vue';
import { useBarChart } from "./BarChartComposable";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";
import CategoryTypeEnum from "@/data/enumerations/CategoryType";
import CategoryReportingTypeEnum from "@/data/enumerations/CategoryReportingType";
import MonthEnum from "@/data/enumerations/MonthEnum";

interface Series {
    name: string;
    type: string;
    data: number[] 
}

export function useStackedSpendingBarChart(data: Ref<CategoryMonthTotal[]>, category: Ref<number | null>) {
    
    const {options} = useBarChart(new MonthEnum().getItems().map(x => x.description));
    
    const series = computed<Series[]>(() => {
        const years = [...new Set(toValue(data).map(x => x.year))];        
        const seriesSets: Series[] = [];

        for (var i = 0; i < years.length; i++) {
            const seriesSetData: number[] = [];

            for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
                seriesSetData.push(aggregateCategoryMonthTotals(toValue(data), {
                    year: years[i],
                    month: monthIndex,
                    categoryId: toValue(category) ?? undefined,
                    categoryType: new CategoryTypeEnum().Expense.value,
                    categoryReportingTypes: [new CategoryReportingTypeEnum().AlwaysInclude.value]
                }));
            }
            
            seriesSets.push({
                name: years[i].toString(),
                type: "column",
                data: seriesSetData
            });                        
        }

        return seriesSets;
    });

    return {options, series};

}