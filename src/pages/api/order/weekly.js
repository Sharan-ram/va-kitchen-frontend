import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/MealPlan";
import Ingredient from "../../../../models/Ingredient";
import {
  parseDate,
  weeklyOrderTotalQuantity,
  weeklyOrderRemainingQuantity,
  getMealPlanForDateRange,
  formatDateToDDMMYYYY,
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

        const start = parseDate(startDate);
        const end = parseDate(endDate);

        const startDeduction = parseDate(startDateDeduction);
        const endDeduction = parseDate(endDateDeduction);

        // const currentDate = new Date();
        // const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        // const currentYear = currentDate.getFullYear();

        // const parsedCurrentDate = parseDate(formatDateToDDMMYYYY(currentDate));
        // console.log({ parsedCurrentDate });

        // Fetch the current month meal plan
        // const currentMonthMealPlan = await MealPlan.findOne({
        //   year: currentYear,
        //   month: currentMonth,
        // });
        // console.log({ currentMonthMealPlan, currentYear, currentMonth });

        // Fetch meal plans for the months that include the start date and end date
        const startYear = start.getFullYear();
        const startMonth = start.getMonth() + 1;
        const endYear = end.getFullYear();
        const endMonth = end.getMonth() + 1;

        // Fetch meal plans for the months that include the start date and end date
        const startYearDeduction = startDeduction.getFullYear();
        const startMonthDeduction = startDeduction.getMonth() + 1;
        const endYearDeduction = endDeduction.getFullYear();
        const endMonthDeduction = endDeduction.getMonth() + 1;

        const mealPlans = await MealPlan.find({
          $or: [
            { year: startYear, month: startMonth },
            { year: endYear, month: endMonth },
          ],
        });

        // const mealPlansRemaining = await MealPlan.find({
        //   $or: [
        //     { year: currentYear, month: currentMonth },
        //     { year: startYear, month: startMonth },
        //   ],
        // });

        const mealPlansDeduction = await MealPlan.find({
          $or: [
            { year: startYearDeduction, month: startMonthDeduction },
            { year: endYearDeduction, month: endMonthDeduction },
          ],
        });

        // console.log({ mealPlans: JSON.stringify(mealPlans, null, 2) });

        if (!mealPlans.length) {
          return res.status(404).json({
            message: "Meal plan for the specified date range not found.",
          });
        }

        // Filter the meal plans to include only the days within the specified date range
        const filteredDays = [];
        mealPlans.forEach((plan) => {
          plan.days.forEach((day) => {
            const dayDate = parseDate(day.date);
            if (dayDate >= start && dayDate <= end) {
              filteredDays.push(day);
            }
          });
        });

        // const filteredDaysRemaining = [];
        // mealPlansRemaining.forEach((plan) => {
        //   plan.days.forEach((day) => {
        //     const dayDate = parseDate(day.date);
        //     if (dayDate > parsedCurrentDate && dayDate < start) {
        //       filteredDaysRemaining.push(day);
        //     }
        //   });
        // });

        const filteredDaysDeduction = [];
        mealPlansDeduction.forEach((plan) => {
          plan.days.forEach((day) => {
            const dayDate = parseDate(day.date);
            if (dayDate > startDeduction && dayDate < endDeduction) {
              filteredDaysDeduction.push(day);
            }
          });
        });

        // console.log({ filteredDays });

        const mergedMealPlan = { days: filteredDays };

        // const mergedMealPlanRemaining = { days: filteredDaysRemaining };

        const mergedMealPlanDeduction = { days: filteredDaysDeduction };

        // Fetch all ingredients
        const ingredients = await Ingredient.find().sort({ name: 1 });

        // console.log({
        //   MealPlan: mergedMealPlan.days.map((day) => day.date),
        //   start,
        //   end,
        // });

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
              mergedMealPlan,
              ingredientName,
              start,
              end
            );
            // console.log({ totalQuantityInRange });
            const currentStock = ingredient.stock || 0;
            // const remainingQuantityToStartDate = weeklyOrderRemainingQuantity(
            //   mergedMealPlanRemaining,
            //   ingredientName,
            //   parsedCurrentDate,
            //   start
            // );
            const deductionQuantity = weeklyOrderRemainingQuantity(
              mergedMealPlanDeduction,
              ingredientName
            );
            const bulkOrder = ingredient.bulkOrder?.[season] || null;
            const closingStock = currentStock - deductionQuantity;
            const adjustment = bulkOrder
              ? Number(bulkOrder)
              : totalQuantity - closingStock;

            return {
              _id: ingredient._id,
              name: ingredientName,
              weeklyMealPlan: totalQuantity.toFixed(2),
              deductionMealPlan: deductionQuantity.toFixed(2),
              currentStock: currentStock.toFixed(2),
              closingStock: closingStock.toFixed(2),
              bulkOrder,
              adjustment: adjustment.toFixed(2),
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
