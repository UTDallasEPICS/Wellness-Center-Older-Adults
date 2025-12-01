import { format } from 'date-fns';

export function parseDateParts(dateString) {
  if (!dateString) return null;
  try {
    // ISO-like: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS
    if (dateString.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      const datePart = dateString.split('T')[0];
      const [y, m, d] = datePart.split('-');
      return { year: parseInt(y, 10), month: parseInt(m, 10), day: parseInt(d, 10) };
    }

    // Slash format: MM/DD/YYYY or MM/DD/YY
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      let [m, d, y] = parts;
      if (!y) return null;
      if (y.length === 2) y = `20${y}`;
      return { year: parseInt(y, 10), month: parseInt(m, 10), day: parseInt(d, 10) };
    }

    // Fallback: try Date
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  } catch (e) {
    return null;
  }
}

export function buildLocalDate(dateString, timeString) {
  const parts = parseDateParts(dateString);
  if (!parts) return null;
  let { year, month, day } = parts;

  // default time
  let hours = 0;
  let minutes = 0;

  if (timeString) {
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3];
      if (ampm) {
        if (/pm/i.test(ampm) && hours !== 12) hours += 12;
        if (/am/i.test(ampm) && hours === 12) hours = 0;
      }
    }
  }

  const date = new Date(year, month - 1, day, hours, minutes);
  return isNaN(date.getTime()) ? null : date;
}

export function formatDateShort(dateString) {
  const d = buildLocalDate(dateString);
  if (!d) return '';
  return format(d, 'M/d/yy');
}

export function formatDateLong(dateString) {
  const d = buildLocalDate(dateString);
  if (!d) return '';
  return format(d, 'MM/dd/yyyy');
}

export function formatTimeFromStrings(dateString, timeString) {
  const d = buildLocalDate(dateString, timeString);
  if (!d) return '';
  return format(d, 'h:mm a');
}

export default {
  parseDateParts,
  buildLocalDate,
  formatDateShort,
  formatDateLong,
  formatTimeFromStrings,
};
