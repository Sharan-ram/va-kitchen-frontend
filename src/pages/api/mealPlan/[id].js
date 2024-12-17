import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import authMiddleware from "../../../../middleware/auth";
import { processMealPlanDays } from "../../../../utils/helper";
// import decompressMiddleware from "../../../../middleware/decompression";

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database
  const {
    method,
    query: { id },
  } = req;
  // console.log({ bodyBefore: req.body });
  // await decompressMiddleware(req, res);

  switch (method) {
    case "PUT":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const updatedFields = req.body;

        const mealPlan = await MealPlan.findById(id);
        if (!mealPlan) {
          return res
            .status(404)
            .json({ success: false, message: "Meal plan not found" });
        }

        for (const key in updatedFields) {
          if (key !== "days") {
            mealPlan[key] = updatedFields[key];
          }
        }

        // Process and update days array: extract recipe _ids
        if (updatedFields.days && Array.isArray(updatedFields.days)) {
          mealPlan.days = processMealPlanDays(updatedFields.days);
        }

        // Save the updated meal plan
        const updatedMealPlan = await mealPlan.save();

        return res.status(200).json({ success: true, data: updatedMealPlan });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

    default:
      return res
        .setHeader("Allow", ["PUT"])
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
