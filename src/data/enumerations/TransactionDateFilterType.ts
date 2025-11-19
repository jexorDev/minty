import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class TransactionDateFilterTypeEnum extends BaseEnum {
    public static ByMonth: EnumItem = {value: 0, description: "By Month, Year"};
    public static CustomRange: EnumItem = {value: 1, description: "Custom Range"};
    public static AllDates: EnumItem = {value: 2, description: "All Dates"};   
}