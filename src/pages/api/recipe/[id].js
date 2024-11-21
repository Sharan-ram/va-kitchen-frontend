import dbConnect from "../../../../lib/dbConnect";
import Recipe from "../../../../models/Recipe";
import authMiddleware from "../../../../middleware/auth";
import MealPlan from "../../../../models/MealPlan";
import {
  getMealPlanForDateRange,
  getCurrentDate,
  isDateGreaterThan,
} from "../../../../utils/helper";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      // GET recipe by ID
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const recipe = await Recipe.findById(id);

        // Check if recipe exists
        if (!recipe) {
          return res
            .status(404)
            .json({ success: false, message: "Recipe not found" });
        }

        res.status(200).json({ success: true, data: recipe });
      } catch (error) {
        // Handle invalid ObjectId or other server errors
        if (error.kind === "ObjectId") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid recipe ID format" });
        }
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      // Update a recipe by ID
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        // Check if recipe exists
        if (!updatedRecipe) {
          return res
            .status(404)
            .json({ success: false, message: "Recipe not found" });
        }

        // console.log({ updatedRecipe });

        // Fetch meal plans from the current date onward
        const mealPlans = await getMealPlanForDateRange(getCurrentDate()); // Fetch relevant meal plans

        const updatePromises = mealPlans.map(async (mealPlanData) => {
          // Fetch the full meal plan document
          const mealPlan = await MealPlan.findById(mealPlanData._id);

          // Update only the relevant days
          mealPlan.days.forEach((day) => {
            if (
              !isDateGreaterThan(
                new Date(),
                day.date.split("-").reverse().join("-")
              )
            ) {
              [
                "earlyMorning",
                "breakfast",
                "lunch",
                "evening",
                "dinner",
              ].forEach((mealType) => {
                const meal = day[mealType];
                if (meal) {
                  meal.recipes = meal.recipes.map((recipe) => {
                    if (
                      recipe._id.toString() === updatedRecipe._id.toString()
                    ) {
                      // console.log("recipe updated", day.date);
                      return { ...recipe, ...updatedRecipe.toObject() }; // Update recipe
                    }
                    return recipe;
                  });
                }
              });
            }
          });

          // Save the updated meal plan
          await mealPlan.save();
        });

        await Promise.all(updatePromises);

        res.status(200).json({
          success: true,
          message: "Recipe and associated MealPlans updated successfully",
          data: updatedRecipe,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      // DELETE recipe by ID
      try {
        if (!authMiddleware(req, res, ["admin"])) {
          return;
        }

        const deletedRecipe = await Recipe.findByIdAndDelete(id);

        // Check if recipe exists
        if (!deletedRecipe) {
          return res
            .status(404)
            .json({ success: false, message: "Recipe not found" });
        }

        res
          .status(200)
          .json({ success: true, message: "Recipe deleted successfully" });
      } catch (error) {
        // Handle invalid ObjectId or other server errors
        if (error.kind === "ObjectId") {
          return res
            .status(400)
            .json({ success: false, message: "Invalid recipe ID format" });
        }
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
