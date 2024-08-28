import React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash } from "phosphor-react";
import { searchRecipe } from "@/services/recipe";
import classNames from "classnames";

const RecipeSearchInput = ({
  placeholder,
  mealPlan,
  setMealPlan,
  date,
  meal,
  year,
  month,
  setActiveRecipe,
  allowRecipeUpdate,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [search, setSearch] = useState(
    selectedRecipes.length > 0 ? null : { text: "" }
  );

  useEffect(() => {
    const selectDateObj = mealPlan?.days?.find(
      (dayObj) => dayObj.date === format(date, "dd-MM-yyyy")
    );
    // console.log({ date, selectDateObj });
    if (selectDateObj) {
      if (selectDateObj[meal] && selectDateObj[meal]?.recipes) {
        setSelectedRecipes(selectDateObj[meal]?.recipes);
      }
    }
  }, [mealPlan.days, date, meal]);

  let debounceTimer;

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearch({ text: value });
    try {
      if (value.length >= 3) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const res = await searchRecipe(value);
          setSearchResults(res);
          setShowSearchResults(true);
        }, 300);
      }
    } catch (e) {
      console.error(e);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    const formattedDate = format(date, "dd-MM-yyyy");
    let newMealPlan = JSON.parse(JSON.stringify(mealPlan));
    if (newMealPlan && Object.keys(newMealPlan).length > 0) {
      const selectedDateObjIndex = newMealPlan.days?.findIndex((obj) => {
        return obj.date === formattedDate;
      });
      if (selectedDateObjIndex >= 0) {
        if (newMealPlan.days[selectedDateObjIndex][meal]) {
          if (newMealPlan.days[selectedDateObjIndex][meal].recipes) {
            newMealPlan.days[selectedDateObjIndex][meal].recipes.push(recipe);
          } else {
            newMealPlan.days[selectedDateObjIndex][meal].recipes = [recipe];
          }
        } else {
          newMealPlan.days[selectedDateObjIndex] = {
            ...newMealPlan.days[selectedDateObjIndex],
            [meal]: {
              mealCounts: {
                ...newMealPlan.entireMonthCounts,
              },
              recipes: [recipe],
            },
          };
        }
      } else {
        if (newMealPlan.days) {
          newMealPlan.days.push({
            date: formattedDate,
            [meal]: {
              mealCounts: newMealPlan.entireMonthCounts,
              recipes: [recipe],
            },
            season: newMealPlan.season,
          });
        } else {
          newMealPlan.days = [
            {
              date: formattedDate,
              [meal]: {
                mealCounts: newMealPlan.entireMonthCounts,
                recipes: [recipe],
              },
              season: newMealPlan.season,
            },
          ];
        }
      }
    } else {
      newMealPlan = {
        year: Number(year),
        month: Number(month),
        entireMonthCounts: newMealPlan.entireMonthCounts,
        days: [
          {
            date: formattedDate,
            [meal]: {
              mealCounts: newMealPlan.entireMonthCounts,
              recipes: [recipe],
            },
            season: newMealPlan.season,
          },
        ],
      };
    }
    // console.log({ newMealPlan });
    setMealPlan(newMealPlan);
    setShowSearchResults(false);
    setSelectedRecipes([
      ...selectedRecipes,
      { _id: recipe._id, name: recipe.name },
    ]);
    setSearch(null);
  };

  const handleDeleteRecipe = (recipe) => {
    let newMealPlan = JSON.parse(JSON.stringify(mealPlan));
    const selectedDateObjIndex = newMealPlan.days.findIndex(
      (obj) => obj.date === format(date, "dd-MM-yyyy")
    );
    let recipes = newMealPlan?.days[selectedDateObjIndex]?.[meal]?.recipes;
    const recipeIndex = recipes.findIndex((obj) => obj._id === recipe._id);
    newMealPlan.days[selectedDateObjIndex][meal].recipes = [
      ...recipes.slice(0, recipeIndex),
      ...recipes.slice(recipeIndex + 1),
    ];
    setMealPlan(newMealPlan);
    const deletedRecipeIndex = selectedRecipes.findIndex(
      (obj) => obj._id === recipe._id
    );
    setSelectedRecipes([
      ...selectedRecipes.slice(0, deletedRecipeIndex),
      ...selectedRecipes.slice(deletedRecipeIndex + 1),
    ]);
  };

  return (
    <div className="relative">
      {selectedRecipes.length === 0 ? (
        <div>
          <input
            type="text"
            placeholder={placeholder}
            onChange={handleInputChange}
            value={search?.text || ""}
            className="block w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
      ) : (
        <>
          <div>
            {selectedRecipes.map((recipe, recipeIndex) => {
              return (
                <div
                  key={recipeIndex}
                  className="flex items-center mb-2 justify-between w-full"
                >
                  <div
                    className={classNames(
                      "border rounded-md bg-[#f3f1f1] px-2 py-1 w-[90%]",
                      allowRecipeUpdate && "cursor-pointer"
                    )}
                    onClick={() => {
                      allowRecipeUpdate
                        ? setActiveRecipe({ recipe, month, year })
                        : () => {};
                    }}
                  >
                    {recipe.name}
                  </div>
                  <div
                    className="ml-3 cursor-pointer"
                    onClick={() => handleDeleteRecipe(recipe)}
                  >
                    <Trash size={32} color="#bb2124" />
                  </div>
                </div>
              );
            })}
          </div>
          {search ? (
            <div>
              <input
                onChange={handleInputChange}
                value={search?.text || ""}
                type="text"
                className="border rounded-md w-full pl-2 py-1"
                placeholder={placeholder}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearch({ text: "" })}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add new recipe
            </button>
          )}
        </>
      )}

      {showSearchResults && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-[99999]">
          {searchResults.map((result, i) => {
            return (
              <div
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectRecipe(result)}
              >
                {result.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecipeSearchInput;
