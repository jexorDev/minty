export default interface Transaction {
    pk?: number;
    splitId?: number | null;
    transactionDate: Date;
    description: string;
    amount: number;
    categoryId: number | null;
    categoryName?: string;
    subcategoryId: number | null;
    subcategoryName?: string;
    merchantId: number | null;
    merchantName?: string;
    accountId: number | null;
    accountName?: string;
    notes: string;
    exclude: boolean;
    modifiedDate?: Date | null;
}