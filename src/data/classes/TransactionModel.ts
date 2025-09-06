import type Transaction from "../interfaces/Transactions/Transaction";
import BaseModel from "./BaseModel";

export default class TransactionModel extends BaseModel<Transaction> {
    
    get pk() {
        return this.model.pk;
    }

    constructor(transaction?: Transaction) {
        super(transaction);

        if (this.isNew) {
            this.transactionDate = new Date();
        }     
    }   
    
    get splitId() {
        return this.model.splitId;
    }

    get transactionDate() {
        return this.model.transactionDate;
    }
    set transactionDate(value) {
        this.model.transactionDate = value;
    }

    get description() {
        return this.model.description;
    }
    set description(value) {
        this.model.description = value;
    }

    get notes() {
        return this.model.notes;
    }
    set notes(value) {
        this.model.notes = value;
    }

    get amount() {
        return this.model.amount;
    }
    set amount(value) {
        this.model.amount = value;
    }   

    get exclude() {
        return this.model.exclude;
    }
    set exclude(value) {
        this.model.exclude = value;
    }   

    get categoryId() {
        return this.model.categoryId;
    }
    set categoryId(value) {
        this.model.categoryId = value;
    }   
}