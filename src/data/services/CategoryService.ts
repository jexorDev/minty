import BaseService from "./BaseService";
import type Category from "@/data/interfaces/Category";

export default class CategoryService extends BaseService<Category> {
    constructor() {
        super("categories");
    }
}