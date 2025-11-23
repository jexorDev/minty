export default interface Budget {
    pk?: number | null;
    categoryId: number | null;
    type: number;
    amount: number;
}