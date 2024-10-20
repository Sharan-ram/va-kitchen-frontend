import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import authMiddleware from "../../../../middleware/auth";
import decompressMiddleware from "../../../../middleware/decompression";

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database
  const {
    method,
    query: { id },
  } = req;
  // console.log({ bodyBefore: req.body });
  await decompressMiddleware(req, res);

  switch (method) {
    case "PUT":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const updatedFields = req.body;

        // console.log({ bodyAfter: req.body });

        // Find the meal plan by ID and update it
        let mealPlan = await MealPlan.findById(id);
        if (!mealPlan) {
          return res
            .status(404)
            .json({ success: false, message: "Meal plan not found" });
        }

        // Update top-level fields
        for (const key in updatedFields) {
          if (key !== "days") {
            mealPlan[key] = updatedFields[key];
          }
        }

        // Handle days update or addition
        if (updatedFields.days && Array.isArray(updatedFields.days)) {
          updatedFields.days.forEach((updatedDay) => {
            const existingDayIndex = mealPlan.days.findIndex(
              (day) => day.date === updatedDay.date
            );
            if (existingDayIndex === -1) {
              mealPlan.days = [...mealPlan.days, updatedDay];
            } else {
              mealPlan.days[existingDayIndex] = updatedDay;
            }
          });
        }

        const updatedMealPlan = await mealPlan.save();

        // Sort the days array by date
        updatedMealPlan.days.sort((a, b) => {
          const dateA = new Date(a.date.split("-").reverse().join("-"));
          const dateB = new Date(b.date.split("-").reverse().join("-"));
          return dateA - dateB;
        });

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

export const config = {
  api: {
    bodyParser: false,
  },
};
