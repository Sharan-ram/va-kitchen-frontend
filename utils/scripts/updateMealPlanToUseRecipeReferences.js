import mongoose from "mongoose";
import MealPlan from "../../models/MealPlan.js";
import Recipe from "../../models/Recipe.js";
import dotenv from "dotenv";

dotenv.config();

const updateMealPlanRecipes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    // Fetch all meal plans with lean() to get plain JavaScript objects
    const mealPlans = await MealPlan.find().lean();

    // Loop through each mealPlan and update the recipes field
    for (let mealPlan of mealPlans) {
      const updatedDays = mealPlan.days.map((day) => {
        // For each meal type (earlyMorning, breakfast, lunch, evening, dinner)
        const mealTypes = [
          "earlyMorning",
          "breakfast",
          "lunch",
          "evening",
          "dinner",
        ];

        mealTypes.forEach((mealType) => {
          const meal = day[mealType];

          if (meal && meal.recipes && Array.isArray(meal.recipes)) {
            const recipeIds = meal.recipes.map((recipe) => recipe._id);

            // Update the recipes array with only the recipeIds
            day[mealType].recipes = recipeIds;
          }
        });
        return day;
      });

      // Update the mealPlan document with the new recipes
      await MealPlan.findByIdAndUpdate(mealPlan._id, {
        $set: { days: updatedDays },
      });

      console.log(`Updated meal plan with ID ${mealPlan._id}`);
    }

    console.log("All meal plans updated successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating meal plans:", error);
    mongoose.connection.close();
  }
};

updateMealPlanRecipes();
