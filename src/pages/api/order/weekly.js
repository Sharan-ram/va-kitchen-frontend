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
  const { startDate, endDate, startDateDeduction, endDateDeduction, season } =
    req.query;

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

        const mealPlans = await getMealPlanForDateRange({
          startDate,
          endDate,
          ingredientFieldsSelect: "_id name",
        });

        const mealPlansDeduction = await getMealPlanForDateRange({
          startDate: startDateDeduction,
          endDate: endDateDeduction,
          ingredientFieldsSelect: "_id name",
        });

        // console.log({
        //   mealPlansDeduction: JSON.stringify(mealPlansDeduction),
        // });

        if (!mealPlans.length) {
          return res.status(404).json({
            message: "Meal plan for the specified date range not found.",
          });
        }

        // Fetch all ingredients
        const ingredients = await Ingredient.find()
          .select(
            "_id name ingredientType vendor sponsored purchaseUnit price stock bulkOrder"
          )
          .sort({ name: 1 });

        // Construct the response
        const response = ingredients
          .filter((ingredient) => {
            return (
              ingredient.ingredientType === "Fruit" ||
              ingredient.ingredientType === "Veg and Fruit" ||
              ingredient.ingredientType === "Veg"
            );
          })
          .map((ingredient) => {
            const ingredientName = ingredient.name;
            // console.log({ ingredientName });
            const totalQuantity = weeklyOrderTotalQuantity(
              mealPlans,
              ingredientName
            );

            const currentStock = ingredient.stock || 0;

            const deductionQuantity = weeklyOrderRemainingQuantity(
              mealPlansDeduction,
              ingredientName
            );
            const bulkOrder = ingredient.bulkOrder?.[season] || null;
            const closingStock = currentStock - deductionQuantity;

            let adjustment;

            if (bulkOrder) {
              if (closingStock <= 0) {
                adjustment = Number(bulkOrder);
              } else {
                adjustment = Number(bulkOrder) - closingStock;
              }
            } else {
              if (closingStock <= 0) {
                adjustment = totalQuantity;
              } else {
                adjustment = totalQuantity - closingStock;
              }
            }

            return {
              _id: ingredient._id,
              name: ingredientName,
              weeklyMealPlan: totalQuantity.toFixed(2),
              deductionMealPlan: deductionQuantity.toFixed(2),
              currentStock: currentStock.toFixed(2),
              closingStock: closingStock.toFixed(2),
              bulkOrder,
              adjustment: adjustment.toFixed(1),
              purchaseUnit: ingredient.purchaseUnit,
              vendor: ingredient.vendor,
              sponsored: ingredient.sponsored,
              price: ingredient.price,
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
            Number(ingredient.weeklyMealPlan) < Number(ingredient.closingStock)
          ) {
            if (finalResponse.sell[ingredient.vendor]) {
              finalResponse.sell[ingredient.vendor].push(ingredient);
            } else {
              finalResponse.sell[ingredient.vendor] = [ingredient];
            }
          } else if (!Number(ingredient.weeklyMealPlan)) {
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
