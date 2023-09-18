export function generateDaysOfMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the last day of the current month

  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(currentYear, currentMonth, day));
  }

  return days;
}
