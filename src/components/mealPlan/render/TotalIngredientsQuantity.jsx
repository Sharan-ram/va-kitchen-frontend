import { findTempRecipe } from "@/helpers/utils";

const TotalIngredientsQuantity = ({ mealPlan }) => {
  const getIngredients = () => {
    const ingredients = {};
    mealPlan.forEach((mealPlanObj) => {
      //   console.log({ mealPlanObj });
      mealPlanObj.days?.forEach((dayObj) => {
        ["earlyMorning", "breakfast", "lunch", "evening", "dinner"].forEach(
          (meal) => {
            //   console.log({ dayObj, meal });
            if (dayObj[meal]) {
              dayObj[meal].recipes?.forEach((recipe) => {
                const recipeObj = findTempRecipe(
                  recipe,
                  dayObj[meal].tempRecipes
                );
                //   console.log({ recipeObj });
                recipeObj.ingredients.forEach((ingredientObj) => {
                  // console.log({ ingredientObj });
                  const season = dayObj.season;
                  const mealCounts = dayObj[meal].mealCounts;

                  let count = 0;
                  recipeObj.dietType.forEach((str) => {
                    if (str === "vegan") {
                      count = count + mealCounts.veganCount;
                    } else if (str === "nonVegan") {
                      count = count + mealCounts.nonVeganCount;
                    } else {
                      count = count + mealCounts.glutenFreeCount;
                    }
                  });

                  if (
                    Object.keys(ingredients).includes(
                      ingredientObj.ingredient.name
                    )
                  ) {
                    ingredients[ingredientObj.ingredient.name].quantity =
                      ingredientObj[season]
                        ? ingredientObj[season] * count +
                          ingredients[ingredientObj.ingredient.name].quantity
                        : ingredients[ingredientObj.ingredient.name].quantity;
                  } else {
                    ingredients[ingredientObj.ingredient.name] = {
                      quantity: ingredientObj[season]
                        ? ingredientObj[season] * count
                        : 0,
                      cookingUnit: ingredientObj.ingredient.cookingUnit,
                    };
                  }
                });
              });
            }
          }
        );
      });
    });

    return ingredients;
  };

  const ingredients = getIngredients();

  // console.log({ ingredients });

  return (
    <div className="w-1/2">
      <table className="min-w-full divide-y divide-gray-200 max-w-[100%]">
        <thead className="bg-gray-50 max-w-[100%]">
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Ingredient Name
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Total Quantity Needed
          </th>
          <th className="px-3 py-2 font-bold uppercase tracking-wider">
            Cooking Unit
          </th>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {Object.keys(ingredients)
            .sort()
            .map((ingredientName) => {
              return (
                <tr key={ingredientName} className="border-b max-w-[100%]">
                  <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold max-w-[300px] text-ellipsis overflow-hidden whitespace-nowrap">
                    {ingredientName}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                    {ingredients[ingredientName].quantity.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                    {ingredients[ingredientName].cookingUnit}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TotalIngredientsQuantity;
