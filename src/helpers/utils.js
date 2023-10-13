export function generateDaysOfMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the last day of the specified month

  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}
