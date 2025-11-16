import type Tag from "../interfaces/Tag";
import BaseService from "./BaseService";

export default class TagService extends BaseService<Tag> {
    constructor() {
        super("tags");
    }
}