import type TransactionSplit from "../interfaces/Transactions/TransactionSplit";
import BaseModel from "./BaseModel";

export default class TransactionSplitModel extends BaseModel<TransactionSplit> {
    get pk(): number | undefined {
        return this.model.pk;
    }

    get amount() {
        return this.model.amount;
    }
    set amount(value) {
        this.model.amount = value;
    }

    get categoryId() {
        return this.model.categoryId;
    }
    set categoryId(value) {
        this.model.categoryId = value;
    }
}