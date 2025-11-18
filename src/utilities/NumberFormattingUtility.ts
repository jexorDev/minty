import numeral from 'numeral';

export enum NumberFormats {
    Default = "0,0.00",
    Price = "$0,0.00",
    Percentage = "0%"
}

export function formatNumber(value: number | string, format: string = NumberFormats.Default): string {
    return numeral(value).format(format);
}

export function castToNumber(value: string): number {
    return numeral(value).value() ?? 0;
}