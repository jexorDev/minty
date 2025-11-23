import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class BudgetTypeEnum extends BaseEnum {
    public static Monthly: EnumItem = {value: 0, description: "Monthly"};
    public static Yearly: EnumItem = {value: 1, description: "Yearly"};
}