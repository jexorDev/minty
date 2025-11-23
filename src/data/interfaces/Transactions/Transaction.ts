export default interface Transaction {
    pk?: number;
    transactionDate: Date;
    description: string;
    amount: number;
    categoryId: number | null;
    merchantId: number | null;
    accountId: number | null;
    notes: string;
    tags: string[];
    fileId?: number | null;
    modifiedDate?: Date | null;
}