const IngredientsPerRecipePerMeal = ({
  mealPlan,
  recipes,
  ingredients = { ingredients },
  filteredMealPlan,
  season,
  veganCount,
  nonVeganCount,
}) => {
  console.log({ mealPlan });
  return (
    <div>
      {/* Each ingredient */}
      <p className="font-bold text-xl">
        Ingredient list for each recipe of a meal
      </p>
      <table className="mt-2 text-center border-2 border-black w-full">
        <thead className="border-b-2 border-b-black">
          <tr>
            <th className="border-r border-r-black py-2">Date</th>
            <th className="border-r border-r-black py-2">Meal</th>
            <th className="border-r border-r-black py-2">Recipe</th>
            <th className="border-r border-r-black py-2">Ingredient</th>
            <th className="border-r border-r-black py-2">Quantity</th>
          </tr>
        </thead>
        {filteredMealPlan?.map((meal) => {
          return (
            <>
              <div className="mb-10" />
              <tbody>
                {mealPlan[meal].map((recipe) => {
                  const ingredientsArr =
                    Object.keys(recipes[recipe]?.ingredients) || [];
                  return ingredientsArr.map((ingredient) => {
                    return (
                      <tr className="border border-black">
                        <td className="border-r border-r-black p-4">{`${
                          meal.split("-")[0]
                        }`}</td>
                        <td className="border-r border-r-black p-4">{`${
                          meal.split("-")[1]
                        }`}</td>
                        <td className="border-r border-r-black p-4">
                          {recipe}
                        </td>
                        <td className="border-r border-r-black p-4">
                          {ingredient}
                        </td>
                        <td className="border-r border-r-black p-4">
                          {`${(
                            Number(
                              recipes[recipe].ingredients[ingredient][season]
                            ) *
                            (recipes[recipe].type === "nonVegan"
                              ? nonVeganCount
                              : veganCount)
                          ).toFixed(2)} ${ingredients[ingredient].cookingUnit}`}
                        </td>
                      </tr>
                    );
                  });
                })}
              </tbody>
            </>
          );
        })}
      </table>
    </div>
  );
};

export default IngredientsPerRecipePerMeal;
