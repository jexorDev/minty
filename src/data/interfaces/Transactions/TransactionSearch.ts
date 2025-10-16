export default interface TransactionSearch {
    pk: number;
    splitId?: number | null;
    transactionDate: Date;
    description: string;
    amount: number;
    categoryId: number | null;
    categoryName?: string;
    categoryType: number | null;
    categoryReportingType: number | null;
    subcategoryId: number | null;
    subcategoryName?: string;
    merchantId: number | null;
    merchantName?: string;
    accountId: number | null;
    accountName?: string;
    notes: string;
    modifiedDate?: Date | null;
}