// const MealPlan = require("../models/mealPlan");
import MealPlan from "../models/MealPlan";
import Recipe from "../models/Recipe";

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
  // console.log({ dateString });
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

export const populateMealPlanRecipesForDateRange = ({
  ingredientFieldsSelect,
}) => {
  const recipeFields = [
    "days.earlyMorning.recipes",
    "days.breakfast.recipes",
    "days.lunch.recipes",
    "days.evening.recipes",
    "days.dinner.recipes",
  ];

  return [
    // Populate recipes
    ...recipeFields.map((field) => ({
      path: field,
      select: "_id name dietType ingredients", // Include ingredients in the selection
      populate: {
        path: "ingredients.ingredient", // Populate the `ingredient` field inside `ingredients`
        select: ingredientFieldsSelect, // Specify fields to include from the `Ingredient` model
      },
    })),
    // Populate tempRecipes.tempRecipe and its ingredients
    ...[
      "days.earlyMorning.tempRecipes",
      "days.breakfast.tempRecipes",
      "days.lunch.tempRecipes",
      "days.evening.tempRecipes",
      "days.dinner.tempRecipes",
    ].map((field) => ({
      path: `${field}.tempRecipe`, // Populate only `tempRecipe` inside `tempRecipes`
      select: "_id name ingredients", // Include the ingredients array from `TempRecipe`
      populate: {
        path: "ingredients.ingredient", // Populate `ingredient` inside `TempRecipe.ingredients`
        select: "_id name", // Specify fields to include from `Ingredient`
      },
    })),
  ];
};

export const findTempRecipe = (originalRecipe, tempRecipes) => {
  if (!tempRecipes || tempRecipes.length === 0) return originalRecipe;
  const temp = tempRecipes.find(
    (obj) => obj.originalRecipe === originalRecipe._id
  );
  if (temp) return temp;
  return originalRecipe;
};

export const monthlyOrderTotalQuantity = (mealPlan, ingredientName) => {
  let totalQuantity = 0;
  mealPlan.days.forEach((day) => {
    ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
      (meal) => {
        if (day[meal]) {
          day[meal]?.recipes.forEach((recipeObj) => {
            const recipe = findTempRecipe(recipeObj, day[meal].tempRecipes);
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
  mealPlans,
  ingredientName
  // startDate,
  // endDate
) => {
  let totalQuantity = 0;
  // console.log({ mealPlans });

  if (!mealPlans) return 0;
  mealPlans.forEach((mealPlan) => {
    mealPlan.days.forEach((day) => {
      ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
        (meal) => {
          if (day[meal]) {
            day[meal]?.recipes.forEach((recipeObj) => {
              const recipe = findTempRecipe(recipeObj, day[meal].tempRecipes);
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
    });
  });
  return totalQuantity;
};

// Helper function to calculate the total quantity needed for a given ingredient in a meal plan
export const weeklyOrderTotalQuantity = (
  mealPlans,
  ingredientName
  // startDate,
  // endDate
) => {
  let totalQuantity = 0;

  if (!mealPlans) return 0;

  mealPlans.forEach((mealPlan) => {
    mealPlan?.days.forEach((day) => {
      ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
        (meal) => {
          if (day[meal]) {
            day[meal]?.recipes.forEach((recipeObj) => {
              const recipe = findTempRecipe(recipeObj, day[meal].tempRecipes);
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
    });
  });
  // console.log({ weeklyQuant: totalQuantity });
  return totalQuantity;
};

// Helper function to calculate the remaining quantity needed for a given ingredient from the current date to the start date
export const weeklyOrderRemainingQuantity = (mealPlans, ingredientName) => {
  let totalQuantity = 0;

  if (!mealPlans) return 0;

  mealPlans.forEach((mealPlan) => {
    mealPlan.days.forEach((day) => {
      ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
        (meal) => {
          if (day[meal]) {
            day[meal]?.recipes.forEach((recipeObj) => {
              const recipe = findTempRecipe(recipeObj, day[meal].tempRecipes);
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
      // }
    });
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

export const getMealPlanForDateRange = async ({
  startDate,
  endDate = null,
  ingredientFieldsSelect,
}) => {
  try {
    const startDateObj = parseDate(startDate);
    const endDateObj = parseDate(endDate);

    // console.log({ startDateObj, endDateObj });

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
        $project: {
          year: 1,
          month: 1,
          season: 1,
          entireMonthCounts: 1,
          _id: 1,
          "days._id": 1,
          "days.date": 1,
          "days.season": 1,
          // Meal counts
          "days.earlyMorning.mealCounts": 1,
          "days.breakfast.mealCounts": 1,
          "days.lunch.mealCounts": 1,
          "days.evening.mealCounts": 1,
          "days.dinner.mealCounts": 1,
          // Comments
          "days.earlyMorning.comments": 1,
          "days.breakfast.comments": 1,
          "days.lunch.comments": 1,
          "days.evening.comments": 1,
          "days.dinner.comments": 1,
          // Recipes and their populated details
          "days.earlyMorning.recipes": 1,
          "days.breakfast.recipes": 1,
          "days.lunch.recipes": 1,
          "days.evening.recipes": 1,
          "days.dinner.recipes": 1,
          // Temp recipes
          "days.earlyMorning.tempRecipes": 1,
          "days.breakfast.tempRecipes": 1,
          "days.lunch.tempRecipes": 1,
          "days.evening.tempRecipes": 1,
          "days.dinner.tempRecipes": 1,
        },
      },
    ]);
    await MealPlan.populate(
      mealPlans,
      populateMealPlanRecipesForDateRange({ ingredientFieldsSelect })
    );

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

export const processMealPlanDays = (days) => {
  const newDays = days.map((day) => {
    // Spread all properties of `day` into a new object
    const newDay = { ...day };

    if (newDay.earlyMorning?.recipes) {
      newDay.earlyMorning.recipes = newDay.earlyMorning.recipes.map(
        (recipe) => recipe._id
      );
    }

    if (newDay.breakfast?.recipes) {
      newDay.breakfast.recipes = newDay.breakfast.recipes.map(
        (recipe) => recipe._id
      );
    }

    if (newDay.lunch?.recipes) {
      newDay.lunch.recipes = newDay.lunch.recipes.map((recipe) => recipe._id);
    }

    if (newDay.evening?.recipes) {
      newDay.evening.recipes = newDay.evening.recipes.map(
        (recipe) => recipe._id
      );
    }

    if (newDay.dinner?.recipes) {
      newDay.dinner.recipes = newDay.dinner.recipes.map((recipe) => recipe._id);
    }

    // Preserve `tempRecipes` and any other unhandled fields
    return newDay;
  });

  // console.log("newDays", JSON.stringify(newDays));

  return newDays;
};
