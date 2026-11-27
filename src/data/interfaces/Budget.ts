export default interface Budget {
    pk?: number | null;
    categoryId: number | null;
    categoryName: string;
    type: number;
    amount: number;
    year: number;
    manualForecast: boolean;
    manualForecastAmount: number;
}