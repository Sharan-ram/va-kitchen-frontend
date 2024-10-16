import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/mealPlan";
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
          .filter((ingredient) => {
            return (
              ingredient.ingredientType !== "Dairy" &&
              // ingredient.ingredientType !== "Vegan Milk" &&
              ingredient.ingredientType !== "Fruit" &&
              ingredient.ingredientType !== "Veg and Fruit" &&
              ingredient.ingredientType !== "Veg"
            );
          })
          .map((ingredient) => {
            const isLastDayOfMonthVar = isLastDayOfMonth(currentDate);
            const ingredientName = ingredient.name;
            const { totalQuantity, bulkValue } = monthlyOrderTotalQuantity(
              nextMonthMealPlan,
              ingredientName,
              ingredient.bulkOrder
            );
            // console.log({ currentDate: currentDate.toISOString().split("T")[0] });
            const currentStock = ingredient.stock || 0;
            const remainingMealPlan = isLastDayOfMonthVar
              ? 0
              : monthlyOrderRemainingQuantity(
                  currentMonthMealPlan,
                  ingredientName,
                  currentDate
                );
            const closingStock = currentStock - remainingMealPlan;
            const adjustment =
              bulkValue > 0 ? bulkValue : totalQuantity - closingStock;

            return {
              _id: ingredient._id,
              name: ingredientName,
              bulkOrder: bulkValue.toFixed(2),
              monthlyMealPlan: totalQuantity.toFixed(2),
              remainingMealPlan: remainingMealPlan.toFixed(2),
              currentStock: currentStock.toFixed(2),
              adjustment: adjustment.toFixed(2),
              purchaseUnit: ingredient.purchaseUnit,
              closingStock: closingStock.toFixed(2),
              vendor: ingredient.vendor,
              sponsored: ingredient.sponsored,
            };
          });

        let finalResponse = { all: {}, buy: {}, sell: {}, redundant: {} };
        response.forEach((ingredient) => {
          // Push to all filters
          if (finalResponse.all[ingredient.vendor]) {
            finalResponse.all[ingredient.vendor].push(ingredient);
          } else {
            finalResponse.all[ingredient.vendor] = [ingredient];
          }

          // condition to push to sell
          if (
            Number(ingredient.monthlyMealPlan) < Number(ingredient.closingStock)
          ) {
            if (finalResponse.sell[ingredient.vendor]) {
              finalResponse.sell[ingredient.vendor].push(ingredient);
            } else {
              finalResponse.sell[ingredient.vendor] = [ingredient];
            }
          } else if (!Number(ingredient.monthlyMealPlan)) {
            if (finalResponse.redundant[ingredient.vendor]) {
              finalResponse.redundant[ingredient.vendor].push(ingredient);
            } else {
              finalResponse.redundant[ingredient.vendor] = [ingredient];
            }
          } else {
            if (finalResponse.buy[ingredient.vendor]) {
              finalResponse.buy[ingredient.vendor].push(ingredient);
            } else {
              finalResponse.buy[ingredient.vendor] = [ingredient];
            }
          }
        });

        res.status(200).json({ success: true, data: finalResponse });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
