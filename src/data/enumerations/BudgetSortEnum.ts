import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class BudgetSortEnum extends BaseEnum {
    public static CategoryNameAtoZ: EnumItem = {value: 0, description: "Category (A to Z)"};
    public static CategoryNameZtoA: EnumItem = {value: 1, description: "Category (Z to A)"};
    public static AmountSpentMosttoLeast: EnumItem = {value: 2, description: "Amount Spent (Most to Least)"};
    public static AmountSpentLeasttoMost: EnumItem = {value: 3, description: "Amount Spent (Least to Most)"};
    public static AmountRemainingMosttoLeast: EnumItem = {value: 4, description: "Amount Remaining (Most to Least)"};
    public static AmountRemainingLeasttoMost: EnumItem = {value: 5, description: "Amount Remaining (Least to Most)"};
}