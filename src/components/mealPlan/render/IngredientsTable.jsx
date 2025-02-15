import classNames from "classnames";
import { parsedAndFormattedDate, findTempRecipe } from "@/helpers/utils";

const IngredientsTable = ({ mealPlan }) => {
  const getRows = () => {
    let rows = [];
    mealPlan.forEach((mealPlanObj) => {
      mealPlanObj.days.forEach((day) => {
        const date = day.date;
        ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
          (mealType) => {
            const meal = day[mealType];
            if (meal) {
              const mealCounts = meal.mealCounts;
              const mealName =
                mealType.charAt(0).toUpperCase() + mealType.slice(1);

              const season = day.season || mealPlanObj.season;

              meal.recipes.forEach((recipeObj) => {
                const recipe = findTempRecipe(
                  recipeObj,
                  day[mealType].tempRecipes
                );

                // console.log({ recipe });

                let count = 0;
                recipe.dietType.forEach((str) => {
                  if (str === "vegan") {
                    count = count + mealCounts.veganCount;
                  } else if (str === "nonVegan") {
                    count = count + mealCounts.nonVeganCount;
                  } else {
                    count = count + mealCounts.glutenFreeCount;
                  }
                });

                let recipePrice = 0;

                recipe.ingredients.forEach((ingredient, index) => {
                  const ingredientPrice =
                    ingredient[season] *
                    count *
                    (ingredient.ingredient.price || 0);

                  recipePrice = recipePrice + ingredientPrice;

                  const row = {
                    Date: index === 0 ? date : "",
                    Meal: index === 0 ? mealName : "",
                    RecipeName: index === 0 ? recipe.name : "",
                    IngredientName: ingredient.ingredient.name,
                    QuantityTotal: ingredient[season]
                      ? (ingredient[season] * count).toFixed(3)
                      : "",
                    QuantityPerHead: ingredient[season]
                      ? ingredient[season].toFixed(4)
                      : "",
                    VeganCount: index === 0 ? mealCounts.veganCount : "",
                    NonVeganCount: index === 0 ? mealCounts.nonVeganCount : "",
                    GlutenFreeCount:
                      index === 0 ? mealCounts.glutenFreeCount : "",
                    ingredientPrice: ingredientPrice.toFixed(2),
                    recipePrice:
                      index === recipe.ingredients.length - 1
                        ? recipePrice.toFixed(2)
                        : "",
                  };
                  rows.push(row);
                });
              });
            }
          }
        );
      });
    });
    let totalPrice = 0;
    rows = rows.map((row, index) => {
      totalPrice = totalPrice + Number(row.recipePrice);
      return {
        ...row,
        totalPrice: index === rows.length - 1 ? totalPrice.toFixed(2) : "",
      };
    });
    return rows;
  };

  let lastMealType = null;
  let useAlternate = false;

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 max-w-[100%]">
        <thead className="bg-gray-50 max-w-[100%]">
          <th className="px-3 py-2 font-bold uppercase tracking-wider">Date</th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">Meal</th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Recipe
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Vegan Count
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Non Vegan Count
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Gluten Free Count
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Ingredient
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Quantity Total
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Quantity Per Head
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Ingredient Price
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Recipe Price
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Total Price
          </th>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {getRows().map((row, index) => {
            if (row.mealType && row.mealType !== lastMealType) {
              // If a new mealType is encountered, toggle the background color
              useAlternate = !useAlternate;
              lastMealType = row.mealType;
            }

            // console.log({ useAlternate, lastMealType });

            // Set background color based on the toggle
            const backgroundColor = useAlternate ? "#f4f1f1" : "#fff";
            return (
              <tr
                key={`${row.Date}-${row.Meal}-${row.RecipeName}-${index}`}
                className={classNames(
                  "border-b max-w-[100%]",
                  `bg-[${backgroundColor}]`
                )}
              >
                <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold text-center">
                  {row.Date && parsedAndFormattedDate(row.Date)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold text-center">
                  {row.Meal && row.Meal}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold text-center">
                  {row.RecipeName && row.RecipeName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                  {row.VeganCount}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                  {row.NonVeganCount}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                  {row.GlutenFreeCount}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                  {row.IngredientName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                  {row.QuantityTotal}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                  {row.QuantityPerHead}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                  {row.ingredientPrice}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold text-center">
                  {row.recipePrice}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize font-bold text-center">
                  {row.totalPrice}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientsTable;
