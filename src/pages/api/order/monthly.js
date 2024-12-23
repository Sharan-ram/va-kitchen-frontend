import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import Ingredient from "../../../../models/Ingredient";
import {
  monthlyOrderTotalQuantity,
  monthlyOrderRemainingQuantity,
  isLastDayOfMonth,
  parseDate,
  getMealPlanForDateRange,
  populateMealPlanRecipesForDateRange,
} from "../../../../utils/helper";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  const { method, query } = req;
  const { headCount, startDate, endDate } = query;

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

        // const parsedStartDate = parseDate(startDate);
        // const parsedEndDate = parseDate(endDate);

        // Fetch the meal plan for the current and next months
        const currentMonthMealPlan = await getMealPlanForDateRange({
          startDate,
          endDate,
          ingredientFieldsSelect: "_id name",
        });
        // console.log({ currentMonthMealPlan });
        const nextMonthMealPlan = await MealPlan.findOne({
          year: nextYear,
          month: nextMonth,
        }).populate(
          populateMealPlanRecipesForDateRange({
            ingredientFieldsSelect: "_id name",
          })
        );
        // console.log({ nextMonthMealPlan: JSON.stringify(nextMonthMealPlan) });
        if (!nextMonthMealPlan) {
          return res
            .status(404)
            .json({ message: "Meal plan for next month not found." });
        }

        const ingredients = await Ingredient.find()
          .select(
            "_id name ingredientType vendor sponsored purchaseUnit price stock bulkOrder"
          )
          .sort({ name: 1 });

        // console.log({ season: nextMonthMealPlan.season });

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
            // console.log({ bulkOrder: ingredient.bulkOrder });
            // const isLastDayOfMonthVar = isLastDayOfMonth(currentDate);
            const ingredientName = ingredient.name;
            const totalQuantity = monthlyOrderTotalQuantity(
              nextMonthMealPlan,
              ingredientName
            );
            // console.log({ currentDate: currentDate.toISOString().split("T")[0] });
            const currentStock = ingredient.stock || 0;
            const remainingMealPlan = monthlyOrderRemainingQuantity(
              currentMonthMealPlan,
              ingredientName
              // parsedStartDate,
              // parsedEndDate
            );
            const closingStock = currentStock - remainingMealPlan;

            const bulkValue =
              ingredient.bulkOrder &&
              ingredient.bulkOrder[nextMonthMealPlan.season] > 0
                ? Number(ingredient.bulkOrder[nextMonthMealPlan.season]) *
                  Number(headCount)
                : null;

            let adjustment;

            if (bulkValue && bulkValue > 0) {
              if (closingStock <= 0) {
                adjustment = bulkValue.toFixed(1);
              } else {
                adjustment = (bulkValue - closingStock).toFixed(1);
              }
            } else {
              if (closingStock <= 0) {
                adjustment = totalQuantity.toFixed(1);
              } else {
                adjustment = (totalQuantity - closingStock).toFixed(1);
              }
            }

            return {
              _id: ingredient._id,
              name: ingredientName,
              bulkOrder: bulkValue ? bulkValue.toFixed(1) : null,
              monthlyMealPlan: totalQuantity.toFixed(2),
              remainingMealPlan: remainingMealPlan.toFixed(2),
              currentStock: currentStock.toFixed(2),
              adjustment: adjustment,
              purchaseUnit: ingredient.purchaseUnit,
              closingStock: closingStock.toFixed(2),
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
