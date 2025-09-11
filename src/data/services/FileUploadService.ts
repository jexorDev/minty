import BaseService from "./BaseService";

export default class MerchantService extends BaseService<FormData> {
    constructor() {
        super("files");
    }
}