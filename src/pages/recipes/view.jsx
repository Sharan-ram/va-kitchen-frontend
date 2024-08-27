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

  return !recipes || recipesLoading ? (
    <div className="w-full flex justify-center items-center">
      <Loader />
    </div>
  ) : (
    <div className="">
      <table className="min-w-full divide-y divide-gray-200 max-w-[100%] mr-[40px]">
        <thead className="bg-gray-50 max-w-[100%]">
          <tr className="bg-gray-200">
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              No.
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Name
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
          {recipes.map((recipe, index) => {
            const {
              _id,
              name,
              label,
              dietType,
              mealType,
              tableSetting,
              usualMealTime,
            } = recipe;
            return (
              <tr key={recipe._id}>
                <td className="px-3 py-2 whitespace-nowrap capitalize">
                  {index + 1}
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
                  {usualMealTime}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {mealType}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {dietType === "vegan" ? "Vegan" : "Non Vegan"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center max-w-[300px] text-ellipsis">
                  {label.indian}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center max-w-[300px] text-ellipsis">
                  {label.english}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {tableSetting.vessels}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden text-center">
                  {tableSetting.utensils}
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
