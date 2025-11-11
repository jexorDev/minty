import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class ImportFileTypeEnum extends BaseEnum {
    public static Bar: EnumItem = {value: 0, description: "Bar"};
    public static Line: EnumItem = {value: 1, description: "Line"};
    public static Table: EnumItem = {value: 2, description: "Table"};   
    public static Donut: EnumItem = {value: 3, description: "Donut"}; 
    public static Heatmap: EnumItem = {value: 4, description: "Heatmap"}; 
}