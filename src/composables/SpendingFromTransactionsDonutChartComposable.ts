import type {Ref} from 'vue';
import { useDonutChart } from './DonutChartComposable';
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';
import CategoryReportingTypeEnum from '@/data/enumerations/CategoryReportingType';

export function useSpendingFromTransactionsDonutChart(data: Ref<TransactionSearch[]>, category: Ref<number | null>, categoryReportingType: Ref<number | null>) {
    
    const {options} = useDonutChart(false);

    const series = computed(() => [{
        data: getChartData(toValue(data), toValue(category), toValue(categoryReportingType))
    }]);

    return {options, series}
}

function getChartData(data: TransactionSearch[], categoryId: number | null, categoryReportingType: number | null) {
  
  const seriesSets: any[] = [];
  
    const categories = [...new Set(data
        .filter(x => x.categoryType === new CategoryTypeEnum().Expense.value) 
        .filter(x => x.categoryReportingType === (categoryReportingType ?? new CategoryReportingTypeEnum().AlwaysInclude.value))
        .filter(x => x.categoryId === (categoryId ?? x.categoryId))
        .map(y => y.categoryId))];

    for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        seriesSets.push({x: data.find(x => x.categoryId === categories[categoryIndex])?.categoryName ?? "", y: data.filter(x => x.categoryId === categories[categoryIndex]).reduce((acc, curr) => acc + curr.amount, 0)});            
    }
    
    return seriesSets.sort((a, b) => {return b.y - a.y});
}