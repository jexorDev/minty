export default interface Category {
    pk?: number | null;
    name: string;
    type: number;
    ignore: boolean;
    rules: string[];
}