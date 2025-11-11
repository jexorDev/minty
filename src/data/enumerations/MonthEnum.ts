import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class MonthEnum extends BaseEnum {
    public static January: EnumItem = {value: 0, description: "January"};
    public static February: EnumItem = {value: 1, description: "February"};
    public static March: EnumItem = {value: 2, description: "March"};
    public static April: EnumItem = {value: 3, description: "April"};
    public static May: EnumItem = {value: 4, description: "May"};
    public static June: EnumItem = {value: 5, description: "June"};
    public static July: EnumItem = {value: 6, description: "July"};
    public static August: EnumItem = {value: 7, description: "August"};
    public static September: EnumItem = {value: 8, description: "September"};
    public static October: EnumItem = {value: 9, description: "October"};
    public static November: EnumItem = {value: 10, description: "November"};
    public static December: EnumItem = {value: 11, description: "December"};
}