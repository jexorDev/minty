export default interface Transaction {
    pk: number;
    splitPk: number;
    transactionDate: Date;
    description: string;
    amount: number;
    categoryId: number;
    categoryName: string;
    subcategoryId: number;
    subcategoryName: string;
    merchantId: number;
    merchantName: string;
    accountId: number;
    accountName: string;
    notes: string;
    exclude: boolean;
    modifiedDate: Date;
}