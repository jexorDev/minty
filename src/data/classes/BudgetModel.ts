import { createDate, DateFormats, formatDate } from "@/utilities/DateFormattingUtility";
import type Budget from "../interfaces/Budget";
import type CategoryMonthTotal from "../interfaces/Statistics/CategoryMonthTotal";
import StatisticsService from "../services/StatisticsService";
import { adjustDate, getCurrentDate, getCurrentMonth, getCurrentYear } from "@/utilities/DateArithmeticUtility";
import BudgetService from "../services/BudgetService";
import BudgetTypeEnum from "../enumerations/BudgetType";
import BudgetMonthModel from "./BudgetMonthModel";

export default class BudgetModel {

     budget: Budget;
     statisticsLastRollingYear: CategoryMonthTotal[] = [];
     statistics: CategoryMonthTotal[] = [];
    _isLoading: boolean = false;

    constructor(dto?: Budget) {
        if (dto) {
            this.budget = dto;
           
        } else {
            this.budget = {
                type: BudgetTypeEnum.Monthly.value,
                amount: 0
            } as Budget;
        }
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get isNew(): boolean {
        return this.pk === null;
    }

    get pk(): number | null {
        return this.budget.pk ?? null;
    }    

    get categoryId(): number | null {
        return this.budget.categoryId;
    }
    set categoryId(value) {
        this.budget.categoryId = value;
        if (value) {
            this.setStatistics();
        } else {
            this.statistics = [];
        }
    }

    get categoryName(): string {
        return this.budget.categoryName;
    }

    get type(): number {
        return this.budget.type;
    }
    set type(value) {
        this.budget.type = value;
    }

    get amount(): number {
        return this.budget.amount;
    }
    set amount(value) {
        this.budget.amount = value;
    }

    get grandTotal(): number {
        return this.statistics.reduce((acc, curr) => acc + curr.total, 0);
    }

    get grandTotalRollingPastYear(): number {
        return this.statisticsLastRollingYear.reduce((acc, curr) => acc + curr.total, 0);
    }

    get totalToDate(): number {
        return this.type === BudgetTypeEnum.Monthly.value && this.currentMonthBudget ? this.currentMonthBudget.monthTotal : this.grandTotal;
    }

    get budgetPercent(): number {
        return this.grandTotal / this.budgetAmount * 100;
    }

    get budgetAmount(): number {
        return this.amount * (this.type === BudgetTypeEnum.Monthly.value ? 12 : 1);
    }

    get budgetRemainingAmount(): number{
        return this.budgetAmount - this.grandTotal;
    }

    get budgetRemainingPerMonthAmount(): number{
        return Math.max(this.budgetRemainingAmount / this.remainingMonthsInYear, 0);
    }

    get monthlyAverage(): number {
        return this.grandTotal / Math.max(getCurrentMonth(), 1);
    }

    get monthlyAverageRollingPastYear(): number {
        return this.grandTotalRollingPastYear / 12;
    }

    get budgetMonths(): BudgetMonthModel[] {
        return this.statistics.length > 0 ? this.statistics.map(x => new BudgetMonthModel(x, this.amount)) : [];
    }

    get currentMonthBudget(): BudgetMonthModel | null {        
        return this.budgetMonths.length > 0 ? this.budgetMonths[this.budgetMonths.length - 1] : null;
    }

    get remaining(): number {
        return this.amount - this.totalToDate;
    }    

    get forecasted(): number {
        if (this.budget.type === BudgetTypeEnum.Monthly.value ||
            this.budget.type === BudgetTypeEnum.AnnuallyAccumulated.value
        ) {
            return this.grandTotal + (this.remainingMonthsInYear * this.monthlyAverageRollingPastYear);
        } else if (this.budget.type === BudgetTypeEnum.Yearly.value && this.statistics.length == 0) {
            return this.grandTotalRollingPastYear;
        } else if (this.budget.type === BudgetTypeEnum.BiAnnually.value && this.statistics.length  < 2) {
            return this.statistics.length === 0 ? this.grandTotalRollingPastYear : this.grandTotal + (this.monthlyAverageRollingPastYear * 6);
        }
        return this.grandTotal;
    }

    get remainingMonthsInYear(): number {
        return 12 - getCurrentMonth();
    }


    public async save(): Promise<void> {
        try {
            this._isLoading = true;
            if (this.budget.pk) {
                await new BudgetService().put(this.budget);
            } else {
                this.budget = await new BudgetService().post(this.budget);
            }
        } finally {
            this._isLoading = false;
        }
    }

     async setStatistics(): Promise<void> {
        try {
            this._isLoading =  true;
            this.statisticsLastRollingYear = await new StatisticsService().withUrlParameters({
                fromDate: formatDate(adjustDate(getCurrentDate(), -12, 'month'), DateFormats.ISO),
                toDate: formatDate(getCurrentDate(), DateFormats.ISO),
                categoryId: this.budget.categoryId
            }).getMultiple();
            this.statistics = this.statisticsLastRollingYear.filter(x => x.year === getCurrentYear());
        } finally {
            this._isLoading = true;
        }
    }


}