import { AdminConfig } from '../config/adminValues';

/**
 * Generate hourly time options based on AdminConfig.serviceHours
 * Formats in 12-hour AM/PM format (e.g., '06:00 AM', '11:00 PM')
 */
export function generateTimeOptions(): string[] {
  const { start, end } = AdminConfig.serviceHours;
  const startHour = parseInt(start.split(':')[0], 10);
  const endHour = parseInt(end.split(':')[0], 10);
  
  const options: string[] = [];
  for (let i = startHour; i <= endHour; i++) {
    const ampm = i >= 12 ? 'PM' : 'AM';
    const displayHour = i % 12 === 0 ? 12 : i % 12;
    const hourStr = displayHour < 10 ? `0${displayHour}` : `${displayHour}`;
    options.push(`${hourStr}:00 ${ampm}`);
  }
  return options;
}
