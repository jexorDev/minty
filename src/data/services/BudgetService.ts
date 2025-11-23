import type Budget from "../interfaces/Budget";
import BaseService from "./BaseService";

export default class BudgetService extends BaseService<Budget> {
    constructor() {
        super("budgets");
    }
}