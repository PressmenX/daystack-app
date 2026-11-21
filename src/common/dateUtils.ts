import { DAYS_ID, MONTHS_ID } from '../constants/appConstants';

export function formatIndonesianDate(date: Date = new Date()): string {
  const dayName = DAYS_ID[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = MONTHS_ID[date.getMonth()];
  return `${dayName}, ${dayNumber} ${monthName}`;
}

export function formatDisplayTime(timeValue: string | null): string | null {
  if (!timeValue) {
    return null;
  }
  const parts = timeValue.split(':');
  if (parts.length < 2) {
    return null;
  }
  return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
}
