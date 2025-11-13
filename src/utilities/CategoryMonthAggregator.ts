import CategoryTypeEnum from "@/data/enumerations/CategoryType";
import type CategoryMonthTotal from "@/data/interfaces/Statistics/CategoryMonthTotal";

export function aggregateCategoryMonthTotals(
    categoryMonthTotals: CategoryMonthTotal[], 
    month?: number,
    year?: number,
    categoryId?: number,
    categoryType?: number): number {
    
    return categoryMonthTotals
        .filter(x => x.month === (month ?? x.month))
        .filter(x => x.year === (year ?? x.year))
        .filter(x => x.categoryId === (categoryId ?? x.categoryId))
        .filter(x => x.categoryType === (categoryType ?? x.categoryType))
        .map(x => x.total * (x.categoryType === CategoryTypeEnum.Income.value ? -1 : 1))
        .reduce((acc, curr) => {return acc + curr}, 0);
}