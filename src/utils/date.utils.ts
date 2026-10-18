export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
  totalDays: number;
}

export function calculateTimeRemaining(targetDateIso: string): TimeRemaining {
  if (!targetDateIso) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false, totalDays: 0 };
  }

  const target = new Date(`${targetDateIso}T08:00:00`);
  if (isNaN(target.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false, totalDays: 0 };
  }

  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true, totalDays: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalDays = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: totalDays,
    hours,
    minutes,
    seconds,
    isPassed: false,
    totalDays,
  };
}

export interface FormatDateOptions {
  showWeekday?: boolean;
  monthFormat?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
}

export function formatIndonesianDate(
  dateIso: string,
  options?: FormatDateOptions
): string {
  if (!dateIso) return '';
  const date = new Date(`${dateIso}T00:00:00`);
  if (isNaN(date.getTime())) return dateIso;

  const showWeekday = options?.showWeekday ?? true;
  const month = options?.monthFormat ?? 'long';

  return new Intl.DateTimeFormat('id-ID', {
    ...(showWeekday ? { weekday: 'long' } : {}),
    day: 'numeric',
    month,
    year: 'numeric',
  }).format(date);
}
