// const MealPlan = require("../models/mealPlan");
import MealPlan from "../models/mealPlan";

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getNextMonthName = () => {
  const currentDate = new Date();
  const nextMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  return monthNames[nextMonth % 12];
};

export const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const monthlyOrderTotalQuantity = (
  mealPlan,
  ingredientName,
  bulkOrder
) => {
  let totalQuantity = 0;
  let bulkValue = 0;
  mealPlan.days.forEach((day) => {
    ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
      (meal) => {
        if (day[meal]) {
          day[meal]?.recipes.forEach((recipe) => {
            recipe.ingredients.forEach((ing) => {
              if (ing.ingredient.name === ingredientName) {
                const mealCounts = day[meal].mealCounts;

                let count = 0;
                recipe.dietType.forEach((str) => {
                  if (str === "vegan") {
                    count = count + mealCounts.veganCount;
                  } else if (str === "nonVegan") {
                    count = count + mealCounts.nonVeganCount;
                  } else {
                    count = count + mealCounts.glutenFreeCount;
                  }
                });
                totalQuantity += ing[day.season] ? ing[day.season] * count : 0;
                bulkValue +=
                  bulkOrder && bulkOrder[day.season]
                    ? bulkOrder[day.season] * count
                    : 0;
              }
            });
          });
        }
      }
    );
  });
  return { totalQuantity, bulkValue };
};

export const monthlyOrderRemainingQuantity = (
  mealPlan,
  ingredientName,
  startDate
) => {
  let totalQuantity = 0;
  // const start = parseDate(startDate);
  const start = startDate;
  // console.log({ mealPlan: mealPlan.days.map((day) => day.date) });

  if (!mealPlan) return 0;

  mealPlan.days.forEach((day) => {
    const dayDate = parseDate(day.date);
    // console.log({ dayDate });
    if (isDateGreaterThan(dayDate, start) === true) {
      ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
        (meal) => {
          // console.log({ dayDate });
          if (day[meal]) {
            day[meal]?.recipes.forEach((recipe) => {
              // console.log({ splitRecipe });
              recipe.ingredients.forEach((ing) => {
                if (ing.ingredient.name === ingredientName) {
                  const mealCounts = day[meal].mealCounts;
                  let count = 0;
                  recipe.dietType.forEach((str) => {
                    if (str === "vegan") {
                      count = count + mealCounts.veganCount;
                    } else if (str === "nonVegan") {
                      count = count + mealCounts.nonVeganCount;
                    } else {
                      count = count + mealCounts.glutenFreeCount;
                    }
                  });
                  totalQuantity += ing[day.season]
                    ? ing[day.season] * count
                    : 0;
                }
              });
            });
          }
        }
      );
    }
  });
  return totalQuantity;
};

// Helper function to calculate the total quantity needed for a given ingredient in a meal plan
export const weeklyOrderTotalQuantity = (
  mealPlan,
  ingredientName,
  startDate,
  endDate
) => {
  let totalQuantity = 0;
  let bulkValue = 0;
  //   const start = parseDate(startDate);
  //   const end = parseDate(endDate);

  const start = startDate;
  const end = endDate;

  if (!mealPlan) return 0;

  // console.log({ start, end });

  //   console.log({ startTotal: start, endTotal: end });

  //   console.log({ mealPlan });
  console.log({ days: mealPlan.days, mealPlan });
  mealPlan?.days.forEach((day) => {
    const dayDate = parseDate(day.date);
    if (dayDate >= start && dayDate <= end) {
      ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
        (meal) => {
          if (day[meal]) {
            day[meal]?.recipes.forEach((recipe) => {
              recipe.ingredients.forEach((ing) => {
                if (ing.ingredient.name === ingredientName) {
                  const mealCounts = day[meal].mealCounts;
                  let count = 0;
                  recipe.dietType.forEach((str) => {
                    if (str === "vegan") {
                      count = count + mealCounts.veganCount;
                    } else if (str === "nonVegan") {
                      count = count + mealCounts.nonVeganCount;
                    } else {
                      count = count + mealCounts.glutenFreeCount;
                    }
                  });
                  totalQuantity += ing[day.season]
                    ? ing[day.season] * count
                    : 0;
                  bulkValue +=
                    bulkOrder && bulkOrder[day.season]
                      ? bulkOrder[day.season] * count
                      : 0;
                }
              });
            });
          }
        }
      );
    }
  });
  // console.log({ weeklyQuant: totalQuantity });
  return { totalQuantity, bulkValue };
};

// Helper function to calculate the remaining quantity needed for a given ingredient from the current date to the start date
export const weeklyOrderRemainingQuantity = (
  mealPlan,
  ingredientName,
  currentDate,
  startDate
) => {
  let totalQuantity = 0;
  //   const start = parseDate(currentDate);
  //   const end = parseDate(startDate);
  const start = currentDate;
  const end = startDate;

  if (!mealPlan) return 0;

  //   console.log({ mealPlan });
  // console.log({ startRemaing: start, endRemaining: end });

  mealPlan.days.forEach((day) => {
    const dayDate = parseDate(day.date);
    // if (dayDate > start && dayDate < end) {
    ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
      (meal) => {
        if (day[meal]) {
          day[meal]?.recipes.forEach((recipe) => {
            recipe.ingredients.forEach((ing) => {
              if (ing.ingredient.name === ingredientName) {
                const mealCounts = day[meal].mealCounts;
                let count = 0;
                recipe.dietType.forEach((str) => {
                  if (str === "vegan") {
                    count = count + mealCounts.veganCount;
                  } else if (str === "nonVegan") {
                    count = count + mealCounts.nonVeganCount;
                  } else {
                    count = count + mealCounts.glutenFreeCount;
                  }
                });
                totalQuantity += ing[day.season] ? ing[day.season] * count : 0;
              }
            });
          });
        }
      }
    );
    // }
  });
  // console.log({ remainingQuant: totalQuantity });
  return totalQuantity;
};

export const isLastDayOfMonth = (date) => {
  // Get the current year and month
  const year = date.getFullYear();
  const month = date.getMonth();

  // Create a date for the first day of the next month
  const firstDayNextMonth = new Date(year, month + 1, 1);

  // Subtract one day to get the last day of the current month
  const lastDayCurrentMonth = new Date(firstDayNextMonth - 1);

  // Compare the current date with the last day of the month
  return date.getDate() === lastDayCurrentMonth.getDate();
};

export const formatDateToDDMMYYYY = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad with leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed) and pad
  const year = date.getFullYear(); // Get the full year

  return `${day}-${month}-${year}`; // Combine in DD-MM-YYYY format
};

function isDateGreaterThan(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Reset the time part to midnight to compare only the date parts
  d1.setUTCHours(0, 0, 0, 0);
  d2.setUTCHours(0, 0, 0, 0);

  // console.log({ d1, d2, bool: d1 > d2 });

  // Return true if d1 (date1) is greater than d2 (date2)
  return d1 > d2;
}

// function convertISTtoUTC(istDate) {
//   // Calculate the IST to UTC offset, which is +5 hours 30 minutes ahead of UTC
//   const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000);
//   return utcDate;
// }

export const getMealPlanForDateRange = async (startDate, endDate) => {
  try {
    // Convert start and end dates to Date objects for comparison
    const startDateObj = parseDate(startDate);
    const endDateObj = parseDate(endDate);

    // Fetch all meal plans from the database
    let mealPlans = await MealPlan.find();

    // Step 1: Filter out meal plans that don't fall within the year and month range
    const filteredMealPlans = mealPlans.filter((plan) => {
      const mealPlanStartDate = new Date(plan.year, plan.month - 1); // Adjust for 0-indexed months in JS
      const mealPlanEndDate = new Date(plan.year, plan.month, 0); // Last day of the meal plan's month

      return (
        mealPlanStartDate <= endDateObj && mealPlanEndDate >= startDateObj // Check if meal plan falls in the range
      );
    });

    // Step 2: For filtered meal plans, filter out `days` that don't fall within the date range
    const mealPlansWithFilteredDays = filteredMealPlans.map((plan) => {
      const filteredDays = plan.days
        .filter((day) => {
          const dayDate = parseDate(day.date);
          return dayDate >= startDateObj && dayDate <= endDateObj;
        })
        .sort((a, b) => {
          const dateA = new Date(a.date.split("-").reverse().join("-"));
          const dateB = new Date(b.date.split("-").reverse().join("-"));
          return dateA - dateB;
        });

      return {
        _id: plan._id,
        month: plan.month,
        year: plan.year,
        season: plan.season,
        entireMonthCounts: plan.entireMonthCounts,
        days: filteredDays,
      };
    });

    // console.log({ mealPlansWithFilteredDays });

    return mealPlansWithFilteredDays;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

export const dailyOrderIngredients = [
  "Milk",
  "Cheese - Cheddar",
  "Cheese - Mozzarella",
  "Cheese Slices (Dairy)",
  "Mozzarela Cheese",
  "Paneer",
  "Butter",
  "Yeast",
  "Milk for Curd",
];
