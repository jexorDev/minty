import BaseEnum, { type EnumItem } from "./BaseEnum";

export default class CategoryReportingTypeEnum extends BaseEnum {
    public static AlwaysInclude: EnumItem = {value: 0, description: "Always Include"};
    public static ExcludeByDefault: EnumItem = {value: 1, description: "Exclude by Default"};
    public static AlwaysExclude: EnumItem = {value: 2, description: "Always Exclude"};
}