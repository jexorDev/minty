import CategoryReportingTypeEnum from '@/data/enumerations/CategoryReportingType';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import {type Ref} from 'vue';

export interface AggregatedCategory {
    id: number;
    name: string;
    total: number;
}

export function useCategoryAggregatorTransactionSearch(data: Ref<TransactionSearch[]>, categoryId: Ref<number | null>, categoryReportingType: Ref<number | null>) {

 const aggregatedCategories = computed<AggregatedCategory[]>(() => {
    const aggregatedCategories: AggregatedCategory[] = [];
     
    const categoryMap = new Map<number, string>(toValue(data)
        .filter(x => x.categoryType === CategoryTypeEnum.Expense.value)
        .filter(x => x.categoryReportingType === (toValue(categoryReportingType) ?? CategoryReportingTypeEnum.AlwaysInclude.value))
        .filter(x => x.categoryId === (toValue(categoryId) ?? x.categoryId))
        .map(x => [x.categoryId ?? -1, x.categoryName ?? "UNCATEGORIZED"]));

    for (const categoryId of categoryMap.keys()) {
        aggregatedCategories.push({
            id: categoryId, 
            name: categoryMap.get(categoryId) ?? "", 
            total: toValue(data).filter(x => x.categoryId === categoryId).reduce((acc, curr) => acc + curr.amount, 0)});
    }    

    return aggregatedCategories;
    
 });

 return {aggregatedCategories};
}