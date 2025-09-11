import type TransactionSearch from "../interfaces/Transactions/TransactionSearch";
import BaseService from "./BaseService";

export default class TransactionSearchService extends BaseService<TransactionSearch> {
    constructor() {
        super("search")
    }
}