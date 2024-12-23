import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import Recipe from "../../../../models/Recipe";
import authMiddleware from "../../../../middleware/auth";
// import decompressMiddleware from "../../../../middleware/decompression";
import {
  getMealPlanProjection,
  populateMealPlanRecipes,
  processMealPlanDays,
} from "../../../../utils/helper";

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        // await decompressMiddleware(req, res);
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }
        const mealPlanData = req.body;

        // Process and clean up the recipes array to extract only `_id`
        if (mealPlanData.days) {
          mealPlanData.days = processMealPlanDays(mealPlanData.days);
        }

        let mealPlan = new MealPlan(mealPlanData);
        mealPlan = await mealPlan.save();

        // Populate the recipe references with id and name
        await mealPlan.populate({
          path: "days.earlyMorning.recipes days.breakfast.recipes days.lunch.recipes days.evening.recipes days.dinner.recipes",
          select: "_id name", // Only fetch the id and name fields
        });

        return res.status(201).json({ success: true, data: mealPlan });
        // return res.status(201).json({ success: true, data: mealPlan });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

    case "GET":
      try {
        const { month, year } = req.query;
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }
        if (!year || !month) {
          return res
            .status(400)
            .json({ success: false, message: "Year and month are required." });
        }

        const mealPlans = await MealPlan.find(
          { year, month },
          getMealPlanProjection
        )
          .populate(populateMealPlanRecipes())
          .lean();
        return res.status(200).json({ success: true, data: mealPlans });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

    default:
      return res
        .setHeader("Allow", ["POST"])
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
