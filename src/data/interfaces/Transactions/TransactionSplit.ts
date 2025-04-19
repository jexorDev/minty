export default interface TransactionSplit {
    pk?: number;
    transactionId: number;
    categoryId: number;
    subcategoryId: number;
    amount: number;
    exclude: boolean;
}