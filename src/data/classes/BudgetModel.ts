import { createDate, DateFormats } from "@/utilities/DateFormattingUtility";
import type Budget from "../interfaces/Budget";
import type CategoryMonthTotal from "../interfaces/Statistics/CategoryMonthTotal";
import StatisticsService from "../services/StatisticsService";
import { getCurrentYear } from "@/utilities/DateArithmeticUtility";
import BudgetService from "../services/BudgetService";
import BudgetTypeEnum from "../enumerations/BudgetType";
import BudgetMonthModel from "./BudgetMonthModel";

export default class BudgetModel {

     budget: Budget;
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
        return this.budget.pk === null;
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

    get totalToDate(): number {
        return this.type === BudgetTypeEnum.Monthly.value && this.currentMonthBudget ? this.currentMonthBudget.monthTotal : this.grandTotal;
    }

    get budgetPercent(): number {
        return (this.type === BudgetTypeEnum.Monthly.value && this.currentMonthBudget ? this.currentMonthBudget.monthTotal : this.grandTotal) / this.amount;
    }

    get monthlyAverage(): number {
        return this.statistics.length > 0 ? this.grandTotal / this.statistics.length : 0;
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
            this.statistics = await new StatisticsService().withUrlParameters({
                fromDate: createDate(getCurrentYear(), 0, 1, DateFormats.ISO),
                toDate: createDate(getCurrentYear(), 11, 31, DateFormats.ISO),
                categoryId: this.budget.categoryId
            }).getMultiple();
        } finally {
            this._isLoading = true;
        }
    }


}