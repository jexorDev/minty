export default class YearCollectionModel {

    readonly yearData: number[] = [];

    constructor() {
        for (var i = 0; i < 12; i++) {
            this.yearData[i] = 0;
        }
    }

    public setMonthData(month: number, value: number): void {
        this.yearData[month] = value;
    }

    public getMonthData(month: number): number {
        return this.yearData[month];
    }

    public getTotal(): number {
        return this.yearData.reduce((acc, curr) => acc + curr, 0);
    }

    public getAverage(): number {
        return this.getTotal() / 12;
    }
}