const MealPlanTable = ({
  mealPlan,
  selectedRecipes,
  setSelectedRecipes,
  selectAll,
  setSelectAll,
  bungalowMilkRecipes,
}) => {
  const getRows = () => {
    if (!mealPlan) return [];
    let rows = [];
    mealPlan.forEach((recipeObj) => {
      recipeObj.ingredients.forEach((ingredientObj, index) => {
        let row = {
          select: index === 0 ? true : false,
          date: index === 0 ? recipeObj.date : "",
          meal: index === 0 ? recipeObj.meal : "",
          recipe: index === 0 ? recipeObj.recipe : "",
          ingredient: ingredientObj.ingredient,
          quantityTotal: ingredientObj.totalQuantity,
          quantityPerHead: ingredientObj.quantityPerHead,
          count: ingredientObj.count,
          // VeganCount: index === 0 ? mealCounts.veganCount : "",
          // NonVeganCount: index === 0 ? mealCounts.nonVeganCount : "",
        };
        rows.push(row);
      });
    });

    return rows;
  };

  const getBungalowMilkRows = () => {
    let rows = [];
    bungalowMilkRecipes.forEach((recipeObj) => {
      recipeObj.ingredients.forEach((ingredientObj) => {
        let row = {
          date: recipeObj.date,
          meal: recipeObj.meal,
          recipe: recipeObj.recipe,
          ingredient: ingredientObj.ingredient,
          quantityTotal: ingredientObj.totalQuantity,
          quantityPerHead: "",
          count: "",
        };
        rows.push(row);
      });
    });

    return rows;
  };

  const isBungalowMilkSelected = (date) => {
    if (selectAll) return true;
    const bungalowMilkObj = selectedRecipes.find(
      (obj) => obj.date === date && obj.recipe === "Bungalow"
    );
    if (bungalowMilkObj) return true;
    return false;
  };

  const isRecipeSelected = (recipeName) => {
    if (selectAll) return true;
    const recipe = selectedRecipes.find(
      (recipeObj) => recipeObj.recipe === recipeName
    );
    if (recipe) return true;
    return false;
  };

  const selectBungalowRecipe = (date, val) => {
    if (val) {
      const recipe = bungalowMilkRecipes.find((obj) => obj.date === date);
      //   console.log({ recipe });
      setSelectedRecipes([...selectedRecipes, recipe]);
    } else {
      const index = selectedRecipes.findIndex(
        (obj) => obj.recipe === "Bungalow" && obj.date === date
      );
      const newSelectedRecipes = [
        ...selectedRecipes.slice(0, index),
        ...selectedRecipes.slice(index + 1),
      ];
      setSelectedRecipes(newSelectedRecipes);
    }
    setSelectAll(false);
  };

  const selectRecipe = (recipeName, val) => {
    // console.log({ recipeName, val });
    if (val) {
      const recipe = mealPlan.find(
        (recipeObj) => recipeObj.recipe === recipeName
      );
      //   console.log({ recipe });
      setSelectedRecipes([...selectedRecipes, recipe]);
    } else {
      const index = selectedRecipes.findIndex(
        (recipeObj) => recipeObj.recipe === recipeName
      );
      const newSelectedRecipes = [
        ...selectedRecipes.slice(0, index),
        ...selectedRecipes.slice(index + 1),
      ];
      setSelectedRecipes(newSelectedRecipes);
    }
    setSelectAll(false);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 max-w-[100%] mt-2">
      <thead className="bg-gray-50 max-w-[100%]">
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Select
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">Date</th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">Meal</th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">Recipe</th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">Count</th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Ingredient
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Quantity Per Head
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Quantity Total
        </th>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
        {getRows().map((row, index) => (
          <tr key={index} className="border-b max-w-[100%]">
            <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold text-center">
              {row.select && (
                <input
                  type="checkbox"
                  id={row.recipe}
                  name={row.recipe}
                  checked={isRecipeSelected(row.recipe)}
                  onChange={(e) => selectRecipe(row.recipe, e.target.checked)}
                  className="mr-2 cursor-pointer"
                />
              )}
            </td>

            <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold text-center">
              {row.date && row.date}
            </td>
            <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold">
              {row.meal && row.meal}
            </td>
            <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold">
              {row.recipe && row.recipe}
            </td>
            <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
              {row.count}
            </td>
            <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
              {row.ingredient}
            </td>
            <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
              {row.quantityPerHead}
            </td>
            <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
              {row.quantityTotal}
            </td>
          </tr>
        ))}

        {getBungalowMilkRows().map((obj, index) => {
          return (
            <tr key={index} className="border-b max-w-[100%]">
              <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold text-center">
                {
                  <input
                    type="checkbox"
                    id={obj.date}
                    name={obj.date}
                    checked={isBungalowMilkSelected(obj.date)}
                    onChange={(e) =>
                      selectBungalowRecipe(obj.date, e.target.checked)
                    }
                    className="mr-2 cursor-pointer"
                  />
                }
              </td>

              <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold text-center">
                {obj.date}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold">
                {}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize font-semibold">
                {obj.recipe}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                {}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                {obj.ingredient}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                {}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                {obj.quantityTotal}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MealPlanTable;
