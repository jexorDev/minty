import type Transaction from "../interfaces/Transaction";
import BaseService from "./BaseService";

class TransactionsService extends BaseService<Transaction> {
    constructor() {
        super("transactions");
    }
}