import type TransactionSplit from "../interfaces/Transactions/TransactionSplit";
import BaseService from "./BaseService";

export default class TransactionSplitsService extends BaseService<TransactionSplit[]> {
    constructor(transactionId: number) {
        super(`transactions/${transactionId}/splits`)
    }
}