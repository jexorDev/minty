import dayjs, { Dayjs } from 'dayjs';

export enum DateFormats {
    Default = "MM/DD/YYYY",
    WithTime = "MM/DD/YYYY hh:mm",
    ISO = "YYYY-MM-DD"
}

export function formatDate(value: string | Date | Dayjs, format: string = DateFormats.Default): string {
    return dayjs(value).format(format)
}

export function createDate(year: number, month: number, date: number, format: string = DateFormats.Default): string {
    return formatDate(dayjs().year(year).month(month).date(date), format);
}