import { useEffect, useState } from "react";
import { searchRecipe } from "@/services/recipe";

const Recipes = () => {
  const [recipes, setRecipes] = useState();
  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await searchRecipe();
      console.log({ response });
      setRecipes(response);
    };

    fetchRecipes();
  }, []);

  return !recipes ? null : (
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {recipes.map((recipe, index) => {
            const { name } = recipe;
            return (
              <tr key={recipe._id}>
                <td className="px-3 py-2 whitespace-nowrap capitalize">
                  {index + 1}
                </td>
                <td className="px-3 py-2 whitespace-nowrap capitalize overflow-hidden max-w-[300px] text-ellipsis">
                  {name}
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
