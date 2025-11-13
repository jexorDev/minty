import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class StatisticsPageViewTypeEnum extends BaseEnum {
    public static Expenses: EnumItem = {value: 0, description: "Expenses"};
    public static NetIncome: EnumItem = {value: 1, description: "Net Income"};
    public static Income: EnumItem = {value: 2, description: "Income"};   
}