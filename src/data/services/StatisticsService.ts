import type CategoryMonthTotal from "../interfaces/Statistics/CategoryMonthTotal";
import BaseService from "./BaseService";

export default class StatisticsService extends BaseService<CategoryMonthTotal> {
    constructor() {
        super("statistics");
    }
}