export default interface Merchant {
    pk?: number | null;
    name: string;
    forceCategoryId: number | null;
    rules: string[];
}