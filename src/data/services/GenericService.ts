import BaseService from "./BaseService";

export default class GenericService extends BaseService<any> {
    constructor(url: string) {
        super(url);
    }
}