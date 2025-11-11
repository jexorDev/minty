import type {Ref} from "vue";
import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import YearCollectionModel from "@/data/classes/YearCollectionModel";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";
import CategoryReportingTypeEnum from "@/data/enumerations/CategoryReportingType";

export interface YearMonthAggregatorFilter {
    categoryId?: number;
    categoryType?: number;
    includeIgnoreCategories?: boolean;
}

export function useYearMonthMapAggregator(data: Ref<CategoryMonthTotal[]>, filter: Ref<YearMonthAggregatorFilter>) {
     
    const map = computed<Map<number, YearCollectionModel>>(() => {
            
        const years = [...new Set(toValue(data).map(x => x.year))].sort((a, b) => b - a);        
        const map = new Map<number, YearCollectionModel>();
    
        for (var yearIndex = 0; yearIndex < years.length; yearIndex++) {
            var newYearMonthCollection = new YearCollectionModel();
    
            for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
                var filterValue = toValue(filter);
                newYearMonthCollection.setMonthData(monthIndex, aggregateCategoryMonthTotals(toValue(data), {
                    year: years[yearIndex],
                    month: monthIndex,
                    categoryId: filterValue.categoryId,
                    categoryType: filterValue.categoryType,
                    categoryReportingTypes: [new CategoryReportingTypeEnum().AlwaysInclude.value]
                }));        
            }

            map.set(years[yearIndex], newYearMonthCollection);
    
        }

        return map;
    });

    return {map};
}