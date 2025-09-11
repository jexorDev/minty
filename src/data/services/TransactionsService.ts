import type Transaction from "../interfaces/Transactions/Transaction";
import BaseService from "./BaseService";

export default class TransactionsService extends BaseService<Transaction> {
    constructor(id?: number) {
        super(`transactions${id === undefined ? '' : "/" + id}`);
    }
}