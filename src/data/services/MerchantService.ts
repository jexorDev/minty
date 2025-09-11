import type Merchant from "../interfaces/Merchant";
import BaseService from "./BaseService";

export default class MerchantService extends BaseService<Merchant> {
    constructor() {
        super("merchants");
    }
}