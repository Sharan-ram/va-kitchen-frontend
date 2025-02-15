import { useState, useEffect } from "react";
import classNames from "classnames";
import { Trash } from "phosphor-react";
import { searchIngredient } from "@/services/ingredient";
import { getRecipeById } from "@/services/recipe";
import {
  saveTempRecipe,
  getTempRecipeById,
  updateTempRecipe,
} from "@/services/tempRecipe";
import Loader from "@/components/Loader";
import { dietTypeTextMap } from "@/helpers/constants";

const UpdateRecipe = ({
  recipe,
  onUpdateRecipe,
  recipeType,
  activeRecipeDetails,
}) => {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, toggleSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(true);
  const [recipeDetail, setRecipeDetail] = useState();
  const [mealCounts, setMealCounts] = useState(activeRecipeDetails.mealCounts);

  console.log({ recipeDetail, recipeType, activeRecipeDetails, recipe });

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const res =
          recipeType === "originalRecipe"
            ? await getRecipeById(recipe.originalRecipe)
            : await getTempRecipeById(
                recipe.tempRecipe._id || recipe.tempRecipe
              );
        setRecipeDetail(res);
        setIngredients(res.ingredients);
        setRecipeLoading(false);
        // console.log({ res });
      } catch (e) {
        console.error(e);
      }
    };

    fetchRecipeDetail();
  }, []);

  const handleAddIngredient = () => {
    toggleSearch(true);
  };

  const handleQuantityChange = (e, ingredient, season, index) => {
    const newIngredientsArr = ingredients.map((obj, i) => {
      if (index === i) {
        return {
          ...obj,
          [season]: e.target.value,
        };
      } else return obj;
    });
    setIngredients(newIngredientsArr);
  };

  let debounceTimer;

  const handleIngredientSearch = (e) => {
    const { value } = e.target;
    try {
      setSearch(value);
      if (value.length >= 3) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const res = await searchIngredient(value);
          setSearchResults(res);
        }, 300);
      } else {
        setSearchResults([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleIngredientSelect = (ingredient) => {
    const newIngredients = [
      ...ingredients,
      {
        ingredient,
        summerQuantity: "",
        winterQuantity: "",
        monsoonQuantity: "",
        retreatQuantity: "",
      },
    ];
    setIngredients(newIngredients);
    setSearch("");
    setSearchResults([]);
    toggleSearch(false);
  };

  const isIngredientFilled = (ingredient) => {
    if (ingredient.ingredient.name) {
      return true;
    }
    return false;
  };

  const isFormFilled = () => {
    // Check if all ingredients in the form data are filled
    return ingredients.every((ingredient) => isIngredientFilled(ingredient));
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = [
      ...ingredients.slice(0, index),
      ...ingredients.slice(index + 1),
    ];
    setIngredients(newIngredients);
  };

  const handleUpdateRecipe = async () => {
    const newRecipe = {
      name: recipeDetail.name,
      originalRecipe: recipe.originalRecipe,
      dietType: recipeDetail.dietType,
      ingredients: ingredients.map((ing) => {
        return {
          ...ing,
          summerQuantity: Number(ing.summerQuantity) || 0,
          winterQuantity: Number(ing.winterQuantity) || 0,
          monsoonQuantity: Number(ing.monsoonQuantity) || 0,
          retreatQuantity: Number(ing.retreatQuantity) || 0,
        };
      }),
    };

    const res =
      recipeType === "originalRecipe"
        ? await saveTempRecipe(newRecipe)
        : await updateTempRecipe({ ...newRecipe, _id: recipeDetail._id });
    // console.log({ res });
    onUpdateRecipe(res, recipeType === "originalRecipe" ? true : false);
  };

  const getValue = (ingredientName, season) => {
    const ingredient = ingredients.find(
      (ing) => ing.ingredient.name === ingredientName
    );
    return ingredient[season];
  };

  // console.log({ recipe, ingredients });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{recipeDetail?.name}</h2>
      {recipeLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="my-4">
            {recipeDetail?.dietType.map((dt) => {
              // console.log({ dt, text: dietTypeTextMap[dt], dietTypeTextMap });
              const dietTypeCountStr = `${dt}Count`;
              return (
                <div key={dt} className="mb-2">
                  <div className="font-bold">
                    {dietTypeTextMap[dietTypeCountStr]}
                  </div>

                  <div className="">
                    <input
                      type="text"
                      value={mealCounts[dietTypeCountStr]}
                      className="pl-2 py-1 rounded w-1/2 border border-gray-300"
                      onChange={(e) => {
                        const newMealCounts = {
                          ...mealCounts,
                          [dietTypeCountStr]: e.target.value,
                        };
                        setMealCounts(newMealCounts);
                      }}
                      onBlur={(e) => {
                        let oldTotalCount = 0,
                          newTotalCount = 0;

                        recipeDetail.dietType.forEach((dt) => {
                          const dietTypeCountStr = `${dt}Count`;
                          oldTotalCount += Number(
                            activeRecipeDetails.mealCounts[dietTypeCountStr]
                          );
                          newTotalCount += Number(mealCounts[dietTypeCountStr]);
                        });

                        const newIngredients = ingredients.map((ing) => {
                          let oldIngredient = recipeDetail.ingredients.find(
                            (oldIngObj) =>
                              oldIngObj.ingredient.name === ing.ingredient.name
                          );
                          // console.log({ oldIngredient });
                          if (oldIngredient) {
                            let oldPerHeadQuantity =
                              oldIngredient[activeRecipeDetails?.season];

                            let newTotalQuantity =
                              Number(oldPerHeadQuantity) * newTotalCount;

                            // console.log({
                            //   oldPerHeadQuantity,
                            //   newPerHeadQuantity:
                            //     newTotalQuantity / oldTotalCount,
                            //   newTotalQuantity,
                            //   newTotalCount,
                            // });

                            const newIng = {
                              ...ing,
                              [activeRecipeDetails?.season]: (
                                newTotalQuantity / oldTotalCount
                              ).toFixed(4),
                            };

                            return newIng;
                          }
                          return newIng;
                        });

                        console.log({
                          oldIngredients: recipeDetail.ingredients,
                          newIngredients,
                        });

                        setIngredients(newIngredients);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mb-4">
            {ingredients.map((ingredient, index) => {
              const oldIngredient = recipeDetail.ingredients.find(
                (ing) => ing.ingredient._id === ingredient.ingredient._id
              );
              let oldValue = 0;
              if (oldIngredient) {
                oldValue = oldIngredient[activeRecipeDetails?.season];
              }

              return (
                <div key={ingredient._id} className="mb-6">
                  <div>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <h3 className="font-semibold">
                          {ingredient.ingredient.name}
                        </h3>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleDeleteIngredient(index)}
                      >
                        <Trash size={22} color="#bb2124" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-[30%]">
                      <label className="mr-2 text-sm">old</label>
                      <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 w-full rounded"
                        value={oldValue}
                        disabled
                      />
                    </div>
                    <div className="w-[60%]">
                      <label className="mr-2 text-sm">
                        {activeRecipeDetails?.season}
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 px-2 py-1 w-full rounded"
                        // value={getValue(
                        //   ingredient.ingredient.name,
                        //   activeRecipeDetails?.season
                        // )}
                        value={ingredient[activeRecipeDetails?.season]}
                        onChange={(e) =>
                          handleQuantityChange(
                            e,
                            ingredient,
                            activeRecipeDetails?.season,
                            index
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {showSearch && (
            <div className="my-4 relative">
              <div>
                <input
                  type="text"
                  className="border border-gray-300 px-2 py-1 w-full rounded"
                  value={search}
                  onChange={handleIngredientSearch}
                  placeholder="Search ingredient"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                  {searchResults.map((result, i) => {
                    return (
                      <div
                        key={i}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleIngredientSelect(result)}
                      >
                        {result.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <button
            className={classNames(
              "text-white font-bold py-2 px-4 rounded mr-4",
              !showSearch ? "bg-[#8e7576]" : "bg-[#bbacac]"
            )}
            onClick={handleAddIngredient}
            disabled={showSearch}
          >
            +
          </button>
          <button
            className={classNames(
              "text-white font-semibold py-2 px-4 rounded mr-2",
              !isFormFilled() || ingredients.length === 0
                ? "bg-[#bbacac]"
                : "bg-[#8e7576]"
            )}
            onClick={handleUpdateRecipe}
            disabled={!isFormFilled() || ingredients.length === 0}
          >
            Update Recipe
          </button>
        </>
      )}
    </div>
  );
};

export default UpdateRecipe;
