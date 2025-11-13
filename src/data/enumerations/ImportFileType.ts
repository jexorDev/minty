import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class ImportFileTypeEnum extends BaseEnum {
    public static Mint: EnumItem = {value: 0, description: "Mint"};
    public static RocketMoney: EnumItem = {value: 1, description: "Rocket Money"};
    public static BankOfAmerica: EnumItem = {value: 2, description: "Bank of America"};   
    public static Minty: EnumItem = {value: 3, description: "Minty"};   
}