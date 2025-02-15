const PurchaseOrderTable = ({
  mealPlan,
  selectedRecipes,
  selectAll,
  bungalowMilkRecipes,
}) => {
  const getIngredients = () => {
    let ingredients = {};
    const source = selectAll
      ? [...mealPlan, ...bungalowMilkRecipes]
      : selectedRecipes;

    // console.log({ source });
    source.forEach((obj) => {
      obj.ingredients.forEach((ingredientObj) => {
        let ingredientName = ingredientObj.ingredient;

        // If the ingredient is "Milk for Curd", treat it as "Milk"
        if (ingredientName === "Milk for Curd") {
          ingredientName = "Milk";
        }

        if (ingredients[ingredientName]) {
          ingredients[ingredientName].quantity += ingredientObj.totalQuantity;
        } else {
          ingredients[ingredientName] = {
            quantity: ingredientObj.totalQuantity,
            purchaseUnit: ingredientObj.purchaseUnit,
          };
        }
      });
    });

    return ingredients;
  };

  const ingredients = getIngredients();

  return (
    <table className="min-w-full divide-y divide-gray-200 max-w-[100%] mt-2">
      <thead className="bg-gray-50 max-w-[100%]">
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Ingredient
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Quantity Total
        </th>
        <th className="px-3 py-2 font-bold uppercase tracking-wider">
          Purchase Unit
        </th>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
        {Object.keys(ingredients)
          .sort()
          .map((ingredientName, index) => (
            <tr key={index} className="border-b max-w-[100%]">
              <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                {ingredientName}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                {ingredients[ingredientName].quantity}
              </td>
              <td className="px-3 py-2 whitespace-nowrap capitalize text-center">
                {ingredients[ingredientName].purchaseUnit}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default PurchaseOrderTable;
