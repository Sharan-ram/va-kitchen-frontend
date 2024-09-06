import { useEffect, useState } from "react";
import { searchRecipe } from "@/services/recipe";
import Link from "next/link";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";

const Recipes = () => {
  const [recipes, setRecipes] = useState();
  const [recipesLoading, setRecipesLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setRecipesLoading(true);
        const response = await searchRecipe();
        console.log({ response });
        setRecipes(response);
        setRecipesLoading(false);
      } catch (e) {
        console.error(e);
        setRecipesLoading(false);
        toast.error("Error fetching recipes!");
      }
    };

    fetchRecipes();
  }, []);

  const getRows = () => {
    if (recipesLoading || !recipes) return [];
    const rows = [];
    recipes.forEach((recipe, recipeIndex) => {
      recipe.ingredients.forEach((ingredient, index) => {
        const {
          _id,
          name,
          label,
          dietType,
          mealType,
          tableSetting,
          usualMealTime,
        } = recipe;

        const {
          summerQuantity,
          winterQuantity,
          monsoonQuantity,
          retreatQuantity,
        } = ingredient;

        rows.push({
          num: index === 0 ? recipeIndex + 1 : "",
          _id: index === 0 ? _id : "",
          name: index === 0 ? name : "",
          labelIndian: index === 0 ? label.indian : "",
          labelEnglish: index === 0 ? label.english : "",
          dietType: index === 0 ? dietType : "",
          mealType: index === 0 ? mealType : "",
          usualMealTime: index === 0 ? usualMealTime : "",
          tableSettingVessels: index === 0 ? tableSetting.vessels : "",
          tableSettingUtensils: index === 0 ? tableSetting.utensils : "",
          summerQuantity,
          winterQuantity,
          monsoonQuantity,
          retreatQuantity,
          ingredientName: ingredient.name,
        });
      });
    });

    return rows;
  };

  const rows = getRows();

  return !recipes || recipesLoading ? (
    <div className="w-full flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div className="">
      <table className="min-w-full divide-y divide-gray-200 max-w-[100%] mr-[40px]">
        <thead className="bg-gray-50 max-w-[100%] sticky top-[100px]">
          <tr className="bg-gray-200">
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              No.
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Name
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Ingredient Name
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Summer Quantity
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Winter Quantity
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Monsoon Quantity
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Retreat Quantity
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider text-center">
              Usual Meal Time
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider text-center">
              Type of Meal
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider text-center">
              Vegan or Non Vegan
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider text-center">
              Indian Label
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider text-center">
              English Label
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider text-center">
              Vessels
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider text-center">
              Utensils
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {rows.map((recipe, index) => {
            const {
              _id,
              num,
              name,
              labelIndian,
              labelEnglish,
              dietType,
              mealType,
              tableSettingVessels,
              tableSettingUtensils,
              usualMealTime,
              summerQuantity,
              winterQuantity,
              monsoonQuantity,
              retreatQuantity,
              ingredientName,
            } = recipe;
            return (
              <tr key={index}>
                <td className="px-3 py-2 whitespace-nowrap capitalize">
                  {num}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden max-w-[300px] text-ellipsis font-bold">
                  <Link
                    href={`/recipes/${_id}`}
                    className="hover:text-[#8e7576]"
                  >
                    {name}
                  </Link>
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {ingredientName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {summerQuantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {winterQuantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {monsoonQuantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {retreatQuantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {usualMealTime}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {mealType}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {dietType
                    ? dietType === "vegan"
                      ? "Vegan"
                      : "Non Vegan"
                    : ""}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center max-w-[300px] text-ellipsis">
                  {labelIndian}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center max-w-[300px] text-ellipsis">
                  {labelEnglish}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {tableSettingVessels}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {tableSettingUtensils}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Recipes;
