import type CategoryRule from "../interfaces/CategoryRule";
import BaseService from "./BaseService";

export default class CategoryRuleService extends BaseService<string> {
    constructor(id: number) {
        super(`categoryRules/${id}`)
    }
}