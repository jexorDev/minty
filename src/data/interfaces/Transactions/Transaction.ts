export default interface Transaction {
    pk?: number;
    transactionDate: Date;
    description: string;
    amount: number;
    categoryId: number | null;
    subcategoryId: number | null;
    merchantId: number | null;
    accountId: number | null;
    notes: string;
    tags: string[];
    modifiedDate?: Date | null;
}