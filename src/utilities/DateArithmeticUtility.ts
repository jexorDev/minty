import dayjs, { Dayjs } from 'dayjs';
import { formatDate } from './DateFormattingUtility';

export function getCurrentDate(): string {
    return formatDate(dayjs());
}

export function getCurrentYear(): number {
    return dayjs().year();
}

export function getCurrentMonth(): number {
    return dayjs().month();
}

export function getDaysInMonth(date: string | Dayjs | Date): number {
    return dayjs(date).daysInMonth();
}

export function getMonth(date: string | Dayjs | Date): number {
    return dayjs(date).month();
}