import dayjs, { Dayjs } from 'dayjs';
import { formatDate } from './DateFormattingUtility';

type DateTypes = string | Dayjs | Date;

export function getCurrentDate(): string {
    return formatDate(dayjs());
}

export function getCurrentYear(): number {
    return dayjs().year();
}

export function getCurrentMonth(): number {
    return dayjs().month();
}

export function getDaysInMonth(date: DateTypes): number {
    return dayjs(date).daysInMonth();
}

export function getMonth(date: DateTypes): number {
    return dayjs(date).month();
}

export function getYear(date: DateTypes): number {
    return dayjs(date).year();
}

export function adjustDate(date: DateTypes, difference: number, type: "day" | "month" | "year"): string {
    return formatDate(dayjs(date).add(difference, type));    
}