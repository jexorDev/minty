import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class BudgetTypeEnum extends BaseEnum {
    public static Monthly: EnumItem = {value: 0, description: "Monthly"};
    public static Yearly: EnumItem = {value: 1, description: "Yearly (only one transaction a year)"};
    public static AnnuallyAccumulated: EnumItem = {value: 2, description: "Yearly (transactions thru the year)"};
    public static BiAnnually: EnumItem = {value: 3, description: "Bi-annually (only twice a year)"};

}