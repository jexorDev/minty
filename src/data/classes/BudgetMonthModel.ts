import MonthEnum from "../enumerations/MonthEnum";
import type CategoryMonthTotal from "../interfaces/Statistics/CategoryMonthTotal";

export default class BudgetMonthTotal {

    readonly statistic: CategoryMonthTotal;
    readonly budgetAmount: number;

    constructor(statistic: CategoryMonthTotal, budgetAmount: number) {
        this.statistic = statistic;
        this.budgetAmount = budgetAmount;
    }

    get monthName(): string {
        return MonthEnum.getItemByValue(this.statistic.month)?.description ?? "";
    }

    get budgetPercent(): number {
        return this.monthTotal / this.budgetAmount;
    }    

    get monthTotal(): number {
        return this.statistic.total;
    }
}