import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import Ingredient from "../../../../models/Ingredient";
import {
  monthlyOrderTotalQuantity,
  monthlyOrderRemainingQuantity,
  isLastDayOfMonth,
} from "../../../../utils/helper";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

        // Fetch the meal plan for the current and next months
        const currentMonthMealPlan = await MealPlan.findOne({
          year: currentYear,
          month: currentMonth,
        });
        const nextMonthMealPlan = await MealPlan.findOne({
          year: nextYear,
          month: nextMonth,
        });
        if (!nextMonthMealPlan) {
          return res
            .status(404)
            .json({ message: "Meal plan for next month not found." });
        }

        const ingredients = await Ingredient.find().sort({ name: 1 });

        // Process and generate the response
        const response = ingredients
          .filter((ingredient) => ingredient.ingredientType !== "Dairy")
          .map((ingredient) => {
            const isLastDayOfMonthVar = isLastDayOfMonth(currentDate);
            const { totalQuantity, bulkValue } = monthlyOrderTotalQuantity(
              nextMonthMealPlan,
              ingredient.name,
              ingredient.bulkOrder
            );
            const currentStock = ingredient.stock || 0;
            const remainingMealPlan = isLastDayOfMonthVar
              ? 0
              : monthlyOrderRemainingQuantity(
                  currentMonthMealPlan,
                  ingredient.name,
                  currentDate
                );
            const closingStock = currentStock - remainingMealPlan;
            const adjustment =
              bulkValue > 0 ? bulkValue : totalQuantity - closingStock;

            return {
              _id: ingredient._id,
              name: ingredient.name,
              bulkOrder: bulkValue.toFixed(2),
              monthlyMealPlan: totalQuantity.toFixed(2),
              remainingMealPlan: remainingMealPlan.toFixed(2),
              currentStock: currentStock.toFixed(2),
              adjustment: adjustment.toFixed(2),
              purchaseUnit: ingredient.purchaseUnit,
              vendor: ingredient.vendor,
              sponsored: ingredient.sponsored,
            };
          });

        res.status(200).json({ success: true, data: response });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
