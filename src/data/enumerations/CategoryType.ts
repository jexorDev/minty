import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class CategoryTypeEnum extends BaseEnum {
    public Expense: EnumItem = {value: 0, description: "Expense"};
    public Income: EnumItem = {value: 1, description: "Income"};
    public Transfer: EnumItem = {value: 2, description: "Transfer"};
}