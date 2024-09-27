import { useState, useEffect } from "react";
import { getRecipesDietType, updateRecipesDietType } from "@/services/recipe";

import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import classNames from "classnames";
import { dietType } from "@/helpers/constants";

const UpdateRecipesDietType = () => {
  const [recipes, setRecipes] = useState();
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [updateRecipesLoading, setUpdateRecipesLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setRecipesLoading(true);
        const res = await getRecipesDietType();
        let recObj = {};
        res.forEach((recipeObj) => {
          recObj[recipeObj._id] = recipeObj;
        });
        setRecipes(recObj);
        setRecipesLoading(false);
      } catch (e) {
        console.error(e);
        setRecipesLoading(false);
        toast.error("Error fetching prices!");
      }
    };

    fetchRecipes();
  }, []);

  //   console.log({ ingredients });
  const handleSubmit = async () => {
    try {
      setUpdateRecipesLoading(true);
      const newRecipes = Object.keys(recipes).map(
        (recipeId) => recipes[recipeId]
      );
      await updateRecipesDietType({
        recipes: newRecipes,
      });
      setUpdateRecipesLoading(false);
      toast.success("Recipes updated successfully!");
    } catch (e) {
      console.error(e);
      setUpdateRecipesLoading(false);
      toast.error("Error updating Recipes!");
    }
  };

  const disableUpdateButton =
    recipesLoading || updateRecipesLoading || !recipes;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4">
            Update Recipes Diet Type
          </h2>
        </div>

        <div className="w-1/2">
          <button
            type="submit"
            className={classNames(
              "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
              disableUpdateButton && "cursor-not-allowed opacity-50"
            )}
            onClick={handleSubmit}
            disabled={disableUpdateButton}
          >
            {updateRecipesLoading ? <Loader /> : "Update Recipes"}
          </button>
        </div>
      </div>
      <div className="mt-10">
        {recipes && !recipesLoading ? (
          Object.keys(recipes).map((recipeId) => {
            const recipe = recipes[recipeId];
            return (
              <div key={recipe._id} className="flex items-center w-[70%] my-4">
                <div className="w-1/2">
                  <p className="font-semibold">{recipe.name}</p>
                </div>
                <div className="w-1/2 flex items-center">
                  {dietType.map((dietTypeObj) => {
                    return (
                      <div key={dietTypeObj.text} className="w-[30%]">
                        <label
                          // htmlFor={dietTypeObj.text}
                          className="flex items-center"
                        >
                          <input
                            type="checkbox"
                            id={dietTypeObj.text}
                            name={dietTypeObj.text}
                            checked={recipe.dietType.includes(
                              dietTypeObj.value
                            )}
                            onChange={(e) => {
                              let newRecipe = { ...recipe };
                              if (e.target.checked) {
                                newRecipe.dietType.push(dietTypeObj.value);
                              } else {
                                newRecipe.dietType = recipe.dietType.filter(
                                  (str) => str !== dietTypeObj.value
                                );
                              }
                              setRecipes({
                                ...recipes,
                                [recipeId]: newRecipe,
                              });
                            }}
                            className="mr-2 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-gray-700 cursor-pointer">
                            {dietTypeObj.text}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
      <div className="mt-10">
        <button
          type="submit"
          className={classNames(
            "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
            disableUpdateButton && "cursor-not-allowed opacity-50"
          )}
          onClick={handleSubmit}
          disabled={disableUpdateButton}
        >
          {updateRecipesLoading ? <Loader /> : "Update Recipes"}
        </button>
      </div>
    </div>
  );
};

export default UpdateRecipesDietType;
