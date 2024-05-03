export function generateDaysOfMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the last day of the specified month

  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

export function generateDaysForDateRange(start, end) {
  const days = [];
  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    days.push(new Date(date)); // Push a new copy of the date object to avoid mutation
  }
  return days;
}

export const getRecipesForMeal = ({ date, meal, year, month, mealPlan }) => {
  if (!date || !meal || !year || !month || !mealPlan) return;
  const monthlyMealPlan = mealPlan?.[`${month}-${year}`];
  if (monthlyMealPlan) {
    const dailyMealPlan = monthlyMealPlan[`${date}`];
    if (dailyMealPlan) {
      if (dailyMealPlan?.[meal]) {
        return dailyMealPlan?.[meal].recipes;
      }
      return;
    }
    return;
  }
  return;
};
