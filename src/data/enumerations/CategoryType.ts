import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class CategoryTypeEnum extends BaseEnum {
    public static Expense: EnumItem = {value: 0, description: "Expense"};
    public static Income: EnumItem = {value: 1, description: "Income"};
    public static Transfer: EnumItem = {value: 2, description: "Transfer"};
}