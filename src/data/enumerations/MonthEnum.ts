import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class MonthEnum extends BaseEnum {
    public January: EnumItem = {value: 0, description: "January"};
    public February: EnumItem = {value: 1, description: "February"};
    public March: EnumItem = {value: 2, description: "March"};
    public April: EnumItem = {value: 3, description: "April"};
    public May: EnumItem = {value: 4, description: "May"};
    public June: EnumItem = {value: 5, description: "June"};
    public July: EnumItem = {value: 6, description: "July"};
    public August: EnumItem = {value: 7, description: "August"};
    public September: EnumItem = {value: 8, description: "September"};
    public October: EnumItem = {value: 9, description: "October"};
    public November: EnumItem = {value: 10, description: "November"};
    public December: EnumItem = {value: 11, description: "December"};
}