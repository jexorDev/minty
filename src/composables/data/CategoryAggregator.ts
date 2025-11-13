import type {Ref} from "vue";
import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";

export interface CategoryAggregatorFilter {
    categoryId?: number;
    categoryType?: number;
    year?: number;
}

export interface AggregatedCategory {
    id: number;
    name: string;
    total: number;
}

export function useCategoryAggregator(data: Ref<CategoryMonthTotal[]>, filter: Ref<CategoryAggregatorFilter>) {
     
    const aggregatedCategories = computed<AggregatedCategory[]>(() => {
        
        const aggregatedCategories: AggregatedCategory[] = [];

        if (toValue(filter).categoryId) {
            //filtered to a single category, so show breakdown of spending by year for the category
            const years = [...new Set(toValue(data).map(x => x.year))];

            for (var yearIndex = 0; yearIndex < years.length; yearIndex++) {
                aggregatedCategories.push({
                    id: years[yearIndex], 
                    name: years[yearIndex].toString(), 
                    total: aggregateCategoryMonthTotals(
                        toValue(data), 
                        undefined,
                        years[yearIndex],
                        toValue(filter).categoryId,
                        toValue(filter).categoryType
                    )});
            }
        } else {
            //show breakdown of spending by category totalled across all years 
            const categoryMap = new Map<number, string>(toValue(data).map(x => [x.categoryId, x.categoryName]));
    
            for (const categoryId of categoryMap.keys()) {
                aggregatedCategories.push({
                    id: categoryId, 
                    name: categoryMap.get(categoryId) ?? "", 
                    total: aggregateCategoryMonthTotals(
                        toValue(data), 
                        undefined,
                        toValue(filter).year,
                        categoryId,
                        toValue(filter).categoryType
                    )});
            }    

        }
       
        return aggregatedCategories.filter(x => x.total != 0);
    });    

    return {aggregatedCategories};
}