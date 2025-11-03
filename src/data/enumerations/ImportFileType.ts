import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class ImportFileTypeEnum extends BaseEnum {
    public Mint: EnumItem = {value: 0, description: "Mint"};
    public RocketMoney: EnumItem = {value: 1, description: "Rocket Money"};
    public BankOfAmerica: EnumItem = {value: 2, description: "Bank of America"};   
}