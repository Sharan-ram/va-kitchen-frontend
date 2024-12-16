// const MealPlan = require("../models/mealPlan");
import MealPlan from "../models/MealPlan";

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

export const getMealPlanProjection = {
  year: 1,
  month: 1,
  season: 1,
  entireMonthCounts: 1,
  _id: 1,
  "days._id": 1,
  "days.date": 1,
  "days.season": 1,
  // Meal counts (added as per the requirement)
  "days.earlyMorning.mealCounts": 1,
  "days.breakfast.mealCounts": 1,
  "days.lunch.mealCounts": 1,
  "days.evening.mealCounts": 1,
  "days.dinner.mealCounts": 1,
  // Comments will now be directly under each meal
  "days.earlyMorning.comments": 1,
  "days.breakfast.comments": 1,
  "days.lunch.comments": 1,
  "days.evening.comments": 1,
  "days.dinner.comments": 1,
};

export const populateMealPlanRecipes = () => {
  const recipeFields = [
    "days.earlyMorning.recipes",
    "days.breakfast.recipes",
    "days.lunch.recipes",
    "days.evening.recipes",
    "days.dinner.recipes",
  ];

  return recipeFields.map((field) => ({
    path: field,
    select: "_id name", // Specify which fields to populate
  }));
};

export const monthlyOrderTotalQuantity = (mealPlan, ingredientName) => {
  let totalQuantity = 0;
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
              }
            });
          });
        }
      }
    );
  });
  return totalQuantity;
};

export const monthlyOrderRemainingQuantity = (
  mealPlan,
  ingredientName,
  startDate,
  endDate
) => {
  let totalQuantity = 0;
  // const start = parseDate(startDate);
  // const start = startDate;
  // console.log({ mealPlan: mealPlan.days.map((day) => day.date) });

  if (!mealPlan) return 0;

  mealPlan.days.forEach((day) => {
    const dayDate = parseDate(day.date);
    // console.log({ dayDate });
    if (dayDate >= startDate && dayDate <= endDate) {
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
  //   const start = parseDate(startDate);
  //   const end = parseDate(endDate);

  const start = startDate;
  const end = endDate;

  if (!mealPlan) return 0;

  // console.log({ start, end });

  //   console.log({ startTotal: start, endTotal: end });

  //   console.log({ mealPlan });
  // console.log({ days: mealPlan.days, mealPlan });
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
                }
              });
            });
          }
        }
      );
    }
  });
  // console.log({ weeklyQuant: totalQuantity });
  return totalQuantity;
};

// Helper function to calculate the remaining quantity needed for a given ingredient from the current date to the start date
export const weeklyOrderRemainingQuantity = (mealPlan, ingredientName) => {
  let totalQuantity = 0;

  if (!mealPlan) return 0;

  mealPlan.days.forEach((day) => {
    const dayDate = parseDate(day.date);
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

export const isDateGreaterThan = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Reset the time part to midnight to compare only the date parts
  d1.setUTCHours(0, 0, 0, 0);
  d2.setUTCHours(0, 0, 0, 0);

  // console.log({ d1, d2, bool: d1 > d2 });

  // Return true if d1 (date1) is greater than d2 (date2)
  return d1 > d2;
};

// function convertISTtoUTC(istDate) {
//   // Calculate the IST to UTC offset, which is +5 hours 30 minutes ahead of UTC
//   const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000);
//   return utcDate;
// }

export const getMealPlanForDateRange = async (startDate, endDate = null) => {
  try {
    const startDateObj = parseDate(startDate);
    const endDateObj = parseDate(endDate);

    console.log({ startDateObj, endDateObj });

    // Fetch meal plans, filter days inside the query using MongoDB's date comparison
    const mealPlans = await MealPlan.aggregate([
      {
        $match: {
          "days.date": {
            $gte: startDateObj, // Ensure days.date is greater than or equal to startDate
            $lte: endDateObj, // Ensure days.date is less than or equal to endDate
          },
        },
      },
      {
        $project: {
          year: 1,
          month: 1,
          season: 1,
          entireMonthCounts: 1,
          days: {
            $filter: {
              input: "$days",
              as: "day",
              cond: {
                $and: [
                  { $gte: ["$$day.date", startDateObj] },
                  { $lte: ["$$day.date", endDateObj] },
                ],
              },
            },
          },
        },
      },
      {
        $project: getMealPlanProjection, // Apply the specific projection after filtering the days
      },
    ]);

    // const mealPlans = await MealPlan.aggregate([
    //   {
    //     $match: {
    //       "days.date": {
    //         $gte: startDateObj, // Ensure days.date is greater than or equal to startDate
    //         $lte: endDateObj, // Ensure days.date is less than or equal to endDate
    //       },
    //     },
    //   },
    // ]);

    // console.log({
    //   mealPlans: JSON.stringify(mealPlans),
    //   startDateObj,
    //   endDateObj,
    // });

    return mealPlans;
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    throw new Error("Unable to fetch meal plans");
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

export const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
};
