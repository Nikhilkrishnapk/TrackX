// Date helpers. All month boundaries use the device's local time zone.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function startOfMonth(date: Date, monthOffset = 0): Date {
  return new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

// Days left in the month, counting today.
export function remainingDaysInMonth(date: Date): number {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return daysInMonth - date.getDate() + 1;
}

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${minutes} ${suffix}`;
}

// "Today, 2:15 PM" / "Yesterday, 9:30 AM" / "12 Oct, 4:00 PM"
export function formatTransactionDate(date: Date, now: Date = new Date()): string {
  const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((dayStart(now) - dayStart(date)) / 86_400_000);

  let day: string;
  if (dayDiff === 0) {
    day = 'Today';
  } else if (dayDiff === 1) {
    day = 'Yesterday';
  } else {
    day = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
    if (date.getFullYear() !== now.getFullYear()) {
      day += ` ${date.getFullYear()}`;
    }
  }
  return `${day}, ${formatTime(date)}`;
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}
