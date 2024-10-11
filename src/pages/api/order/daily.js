import dbConnect from "../../../../lib/dbConnect";
import MealPlan from "../../../../models/mealPlan";
import {
  dailyOrderIngredients,
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

        const mealPlansWithFilteredDays = await getMealPlanForDateRange(
          startDate,
          endDate
        );

        let orderArr = [];
        mealPlansWithFilteredDays.forEach((mealPlanObj) => {
          mealPlanObj.days.forEach((dayObj) => {
            ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
              (meal) => {
                if (dayObj[meal]) {
                  const mealCounts = dayObj[meal].mealCounts;
                  dayObj[meal]?.recipes.forEach((recipeObj) => {
                    let recipeData = {
                      date: dayObj.date,
                      meal,
                      recipe: recipeObj.name,
                      ingredients: [],
                    };

                    recipeObj.ingredients.forEach((ingredientObj) => {
                      if (
                        dailyOrderIngredients.includes(
                          ingredientObj.ingredient.name
                        )
                      ) {
                        const season = dayObj.season;
                        let count = 0;
                        recipeObj.dietType.forEach((str) => {
                          if (str === "vegan") {
                            count += mealCounts.veganCount;
                          } else if (str === "nonVegan") {
                            count += mealCounts.nonVeganCount;
                          } else {
                            count += mealCounts.glutenFreeCount;
                          }
                        });

                        recipeData.ingredients.push({
                          ingredient: ingredientObj.ingredient.name,
                          purchaseUnit: ingredientObj.ingredient.purchaseUnit,
                          count,
                          quantityPerHead: ingredientObj[season],
                          totalQuantity: ingredientObj[season]
                            ? ingredientObj[season] * count
                            : "",
                        });
                      }
                    });

                    if (recipeData.ingredients.length > 0) {
                      orderArr.push(recipeData);
                    }
                  });
                }
              }
            );
          });
        });

        res.status(200).json({ success: true, data: orderArr });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
