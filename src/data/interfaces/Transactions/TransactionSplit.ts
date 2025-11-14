export default interface TransactionSplit {
    pk?: number;
    transactionId: number;
    categoryId: number;
    amount: number;
    exclude: boolean;
}