import type {Ref} from "vue";
import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import YearCollectionModel from "@/data/classes/YearCollectionModel";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";

export interface YearMonthAggregatorFilter {
    categoryId?: number;
    categoryType?: number;
}

export function useYearMonthMapAggregator(data: Ref<CategoryMonthTotal[]>, filter: Ref<YearMonthAggregatorFilter>) {
     
    const map = computed<Map<string, YearCollectionModel>>(() => {
            
        const years = [...new Set(toValue(data).map(x => x.year))].sort((a, b) => b - a);        
        const map = new Map<string, YearCollectionModel>();
    
        for (var yearIndex = 0; yearIndex < years.length; yearIndex++) {
            var newYearMonthCollection = new YearCollectionModel();
    
            for (var monthIndex = 0; monthIndex < 12; monthIndex++) {
                var filterValue = toValue(filter);
                newYearMonthCollection.setMonthData(monthIndex, aggregateCategoryMonthTotals(
                    toValue(data), 
                    monthIndex,
                    years[yearIndex],
                    filterValue.categoryId,
                    filterValue.categoryType
                ));        
            }

            map.set(years[yearIndex].toString(), newYearMonthCollection);
    
        }

        return map;
    });

    return {map};
}