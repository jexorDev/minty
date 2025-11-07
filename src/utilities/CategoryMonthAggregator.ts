import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";

export interface CategoryMonthAggregatorFilter {
    month?: number;
    year?: number;
    categoryName?: string;
    categoryType?: number;
    categoryReportingTypes?: number[];
} 

export function aggregateCategoryMonthTotals(categoryMonthTotals: CategoryMonthTotal[], filter: CategoryMonthAggregatorFilter): number {
    return categoryMonthTotals
        .filter(x => x.month === (filter.month ?? x.month))
        .filter(x => x.year === (filter.year ?? x.year))
        .filter(x => x.categoryName === (filter.categoryName ?? x.categoryName))
        .filter(x => x.categoryType === (filter.categoryType ?? x.categoryType))
        .filter(x => (filter.categoryReportingTypes ?? [x.reportingType]).includes(x.reportingType))
        .reduce((acc, curr) => {return acc + curr.total}, 0);
}