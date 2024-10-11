import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import Ingredient from "../../../../models/Ingredient";
import {
  weeklyOrderTotalQuantity,
  weeklyOrderRemainingQuantity,
  getMealPlanForDateRange,
} from "../../../../utils/helper";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  const { method } = req;
  const { startDate, endDate } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        if (!startDate || !endDate) {
          return res
            .status(400)
            .json({ message: "Start date and end date are required." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const mealPlansWithFilteredDays = await getMealPlanForDateRange(
          startDate,
          endDate
        );

        // Fetch all ingredients
        const ingredients = await Ingredient.find().sort({ name: 1 });

        // Process and generate the response
        const response = ingredients
          .filter(
            (ingredient) =>
              ingredient.ingredientType === "Fruit" ||
              ingredient.ingredientType === "Veg"
          )
          .map((ingredient) => {
            const { totalQuantity, bulkValue } = weeklyOrderTotalQuantity(
              mealPlansWithFilteredDays,
              ingredient.name,
              start,
              end,
              ingredient.bulkOrder
            );
            const currentStock = ingredient.stock || 0;
            const remainingQuantityToStartDate = weeklyOrderRemainingQuantity(
              mealPlansWithFilteredDays,
              ingredient.name,
              start,
              end
            );
            const closingStock = currentStock - remainingQuantityToStartDate;
            const adjustment =
              bulkValue > 0 ? bulkValue : totalQuantity - closingStock;

            return {
              _id: ingredient._id,
              name: ingredient.name,
              weeklyMealPlan: totalQuantity.toFixed(2),
              remainingMealPlan: remainingQuantityToStartDate.toFixed(2),
              currentStock: currentStock.toFixed(2),
              closingStock: closingStock.toFixed(2),
              bulkOrder: bulkValue.toFixed(2),
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
