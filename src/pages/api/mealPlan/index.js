import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }
        const mealPlan = new MealPlan(req.body); // Create a new meal plan
        await mealPlan.save(); // Save the meal plan to the database
        return res.status(201).json({ success: true, data: mealPlan });
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

        const mealPlans = await MealPlan.find({ year, month });
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
