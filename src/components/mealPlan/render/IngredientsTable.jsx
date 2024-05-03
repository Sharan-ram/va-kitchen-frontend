const IngredientsTable = ({ mealPlan }) => {
  const getRows = () => {
    const rows = [];
    mealPlan.forEach((mealPlanObj) => {
      mealPlanObj.days.forEach((day) => {
        const date = day.date;

        ["breakfast", "lunch", "dinner"].forEach((mealType) => {
          const meal = day[mealType];
          if (meal) {
            const mealCounts = meal.mealCounts;
            const mealName =
              mealType.charAt(0).toUpperCase() + mealType.slice(1);

            meal.recipes.forEach((recipe) => {
              const count =
                recipe.dietType === "vegan"
                  ? mealCounts.veganCount
                  : mealCounts.nonVeganCount;
              recipe.ingredients.forEach((ingredient, index) => {
                const row = {
                  Date: index === 0 ? date : "",
                  Meal: index === 0 ? mealName : "",
                  RecipeName: index === 0 ? recipe.name : "",
                  IngredientName: ingredient.ingredient.name,
                  Quantity: (ingredient[mealPlanObj.season] * count).toFixed(3),
                  VeganCount: index === 0 ? mealCounts.veganCount : "",
                  NonVeganCount: index === 0 ? mealCounts.nonVeganCount : "",
                  ingredientPrice: (
                    ingredient[mealPlanObj.season] *
                    count *
                    ingredient.ingredient.price
                  ).toFixed(2),
                };
                rows.push(row);
              });
            });
          }
        });
      });
    });
    return rows;
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 max-w-[100%]">
        <thead className="bg-gray-50 max-w-[100%]">
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Meal
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Recipe
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Vegan Count
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Non Vegan Count
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ingredient
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantity
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ingredient Price
          </th>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {getRows().map((row, index) => (
            <tr key={index} className="border-b max-w-[100%]">
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.Date && row.Date}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.Meal && row.Meal}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.RecipeName && row.RecipeName}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.VeganCount}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.NonVeganCount}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.IngredientName}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.Quantity}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.ingredientPrice}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientsTable;
