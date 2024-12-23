import { months } from "./constants";
import { parseISO, format, isValid } from "date-fns";

export function generateDaysOfMonth(year, month) {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate(); // Get the last day of the specified month in UTC

  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    // Create each date in UTC
    days.push(new Date(Date.UTC(year, month, day)));
  }

  return days;
}

export function generateDaysForDateRange(start, end) {
  const days = [];
  let date = new Date(start);

  // Ensure the time part is reset to midnight for accurate comparison
  date.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (date <= end) {
    days.push(new Date(date)); // Push a new copy of the date object to avoid mutation
    date.setDate(date.getDate() + 1);
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

export const getCurrentMonthIndex = () => {
  const date = new Date();
  const currentMonthIndex = date.getMonth();
  return currentMonthIndex;
};

export const getCurrentMonth = () => {
  return months[getCurrentMonthIndex()].text;
};

export const getNextMonth = () => {
  let nextMonthIndex = getCurrentMonthIndex() + 1;
  nextMonthIndex = nextMonthIndex > 11 ? 0 : nextMonthIndex;
  return months[nextMonthIndex].text;
};

export const getDayBeforeGivenDate = (startDate) => {
  const date = new Date(startDate); // Create a new Date object based on the start date
  date.setDate(date.getDate() - 1); // Subtract one day from the current date
  return date;
};

export const parsedAndFormattedDate = (input) => {
  let date;

  // Check if the input is already a Date object
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string") {
    // Parse the ISO string
    date = parseISO(input);
  } else {
    throw new Error("Invalid input: expected a Date object or an ISO string");
  }

  // Validate the parsed date
  if (!isValid(date)) {
    throw new Error("Invalid date");
  }

  // Format the valid date
  return format(date, "dd-MM-yyyy");
};

export const findTempRecipe = (originalRecipe, tempRecipes) => {
  if (!tempRecipes || tempRecipes.length === 0) return originalRecipe;
  // console.log({ tempRecipes, originalRecipe });
  const temp = tempRecipes.find(
    (obj) => obj.originalRecipe === originalRecipe._id
  );
  if (temp) return temp.tempRecipe;
  return originalRecipe;
};
