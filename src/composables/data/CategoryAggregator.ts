import type {Ref} from "vue";
import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";
import { aggregateCategoryMonthTotals } from "@/utilities/CategoryMonthAggregator";
import CategoryReportingTypeEnum from "@/data/enumerations/CategoryReportingType";
import CategoryTypeEnum from "@/data/enumerations/CategoryType";

export interface CategoryAggregatorFilter {
    categoryId?: number;
    categoryType?: number;
    includeIgnoreCategories?: boolean;
    year?: number;
}

export interface AggregatedCategory {
    id: number;
    name: string;
    total: number;
}

export function useCategoryAggregator(data: Ref<CategoryMonthTotal[]>, filter: Ref<CategoryAggregatorFilter>) {
     
    const aggregatedCategories = computed<AggregatedCategory[]>(() => {
        
        const categoryMap = new Map<number, string>(toValue(data).map(x => [x.categoryId, x.categoryName]));
        const aggregatedCategories: AggregatedCategory[] = [];

        for (const categoryId of categoryMap.keys()) {
            aggregatedCategories.push({id: categoryId, name: categoryMap.get(categoryId) ?? "", 
                    total: aggregateCategoryMonthTotals(
                        toValue(data), {
                            categoryId: categoryId,
                            categoryType: CategoryTypeEnum.Expense.value,
                            categoryReportingTypes: [CategoryReportingTypeEnum.AlwaysInclude.value],
                            year: toValue(filter).year
                        })});
        }    
       
        return aggregatedCategories;
    });    

    return {aggregatedCategories};
}