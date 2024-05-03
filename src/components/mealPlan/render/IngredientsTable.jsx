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
              recipe.ingredients.forEach((ingredient) => {
                const row = {
                  Date: { value: date, rowspan: recipe.ingredients.length },
                  Meal: { value: mealName, rowspan: recipe.ingredients.length },
                  RecipeName: {
                    value: recipe.name,
                    rowspan: recipe.ingredients.length,
                  },
                  IngredientName: ingredient.ingredient.name,
                  Quantity: ingredient[mealPlanObj.season], // Assuming this is the quantity
                  VeganCount: mealCounts.veganCount,
                  NonVeganCount: mealCounts.nonVeganCount,
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
            Ingredient
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantity
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Vegan Count
          </th>
          <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Non Vegan Count
          </th>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {getRows().map((row, index) => (
            <tr key={index} className="border-b max-w-[100%]">
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.Date && row.Date.value}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.Meal && row.Meal.value}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.RecipeName && row.RecipeName.value}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.IngredientName}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.Quantity}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.VeganCount}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize">
                {row.NonVeganCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientsTable;
