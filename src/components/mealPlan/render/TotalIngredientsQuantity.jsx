const TotalIngredientsQuantity = ({ mealPlan }) => {
  const getIngredients = () => {
    const ingredients = {};
    mealPlan.forEach((mealPlanObj) => {
      //   console.log({ mealPlanObj });
      mealPlanObj.days?.forEach((dayObj) => {
        ["breakfast", "lunch", "dinner"].forEach((meal) => {
          //   console.log({ dayObj, meal });
          if (dayObj[meal]) {
            dayObj[meal].recipes?.forEach((recipeObj) => {
              //   console.log({ recipeObj });
              recipeObj.ingredients.forEach((ingredientObj) => {
                // console.log({ ingredientObj });
                const recipeName = recipeObj.name;
                const splitRecipe = recipeName.split("-");
                const season = dayObj.season;
                const mealCounts = dayObj[meal].mealCounts;
                let count;
                if (splitRecipe[1]) {
                  count =
                    splitRecipe[1].trim().toLowerCase() ===
                    "Vegan".toLowerCase()
                      ? mealCounts.veganCount
                      : mealCounts.nonVeganCount;
                } else {
                  count = mealCounts.veganCount + mealCounts.nonVeganCount;
                }

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
        });
      });
    });

    return ingredients;
  };

  const ingredients = getIngredients();

  console.log({ ingredients });

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
                    {ingredients[ingredientName].quantity.toFixed(3)}
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
