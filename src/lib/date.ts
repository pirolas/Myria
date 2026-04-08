const weekdayFormatter = new Intl.DateTimeFormat("it-IT", {
  weekday: "short"
});

const longDateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long"
});

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatLongDate(date: Date) {
  return longDateFormatter.format(date);
}

export function getWeekStart(baseDate = new Date()) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getWeekDays(baseDate = new Date()) {
  const start = getWeekStart(baseDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date,
      key: toDateKey(date),
      label: weekdayFormatter.format(date).replace(".", ""),
      dayNumber: date.getDate()
    };
  });
}

export function getMonthGrid(baseDate = new Date()) {
  const firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0
  ).getDate();

  const cells: Array<{ date: Date | null; key: string; isCurrentMonth: boolean }> =
    [];

  for (let index = 0; index < firstWeekDay; index += 1) {
    cells.push({ date: null, key: `empty-start-${index}`, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), day);
    cells.push({ date, key: toDateKey(date), isCurrentMonth: true });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      date: null,
      key: `empty-end-${cells.length}`,
      isCurrentMonth: false
    });
  }

  return cells;
}
