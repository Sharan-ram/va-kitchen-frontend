import React from "react";
import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const RecipeSearchInput = ({
  placeholder,
  mealPlan,
  setMealPlan,
  date,
  meal,
  year,
  month,
}) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [recipeSelected, setRecipeSelected] = useState(false);

  let debounceTimer;

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    try {
      if (value.length >= 3) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe?search=${value}`
          );
          setSearchResults(res.data.data);
          setShowSearchResults(true);
        }, 300);
      }
    } catch (e) {
      console.error(e);
      setSearchResults([]);
      setShowSearchResults(false);
      setRecipeSelected(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    const formattedDate = format(date, "dd-MM-yyyy");
    let newMealPlan = JSON.parse(JSON.stringify(mealPlan));
    if (newMealPlan && Object.keys(newMealPlan).length > 0) {
      const selectedDateObjIndex = newMealPlan.days.findIndex((obj) => {
        return obj.date === formattedDate;
      });
      if (selectedDateObjIndex >= 0) {
        if (newMealPlan.days[selectedDateObjIndex][meal]) {
          newMealPlan.days[selectedDateObjIndex][meal].recipes.push(recipe);
        } else {
          newMealPlan.days[selectedDateObjIndex] = {
            [meal]: {
              mealCounts: {
                nonVeganCount: 2, // to be changed
                veganCount: 1, // to be changed
                glutenFreeCount: 1, // to be changed
                recipes: [recipe],
              },
            },
          };
        }
      } else {
        newMealPlan.days.push({
          date: formattedDate,
          [meal]: {
            mealCounts: {
              nonVeganCount: 2, // to be changed
              veganCount: 1, // to be changed
              glutenFreeCount: 1, // to be changed
              recipes: [recipe],
            },
          },
        });
      }
    } else {
      newMealPlan = {
        year: Number(year),
        month: Number(month),
        entireMonthCounts: {
          nonVeganCount: 5, // to be changed
          veganCount: 3, // to be changed
          glutenFreeCount: 2, // to be changed
        },
        days: [
          {
            date: formattedDate,
            [meal]: {
              mealCounts: {
                nonVeganCount: 2, // to be changed
                veganCount: 1, // to be changed
                glutenFreeCount: 1, // to be changed
              },
              recipes: [recipe],
            },
          },
        ],
      };
    }
    // console.log({ newMealPlan });
    setMealPlan(newMealPlan);
    setRecipeSelected(true);
  };

  const getRecipe = () => {
    if (recipeSelected) {
      const dateObjIndex = mealPlan?.days?.findIndex(
        (obj) => obj.date === format(date, "dd-MM-yyyy")
      );
      return mealPlan?.days?.[dateObjIndex]?.[meal]?.recipes?.[0].name;
    }
    return search;
  };

  return (
    <div className="relative">
      <div>
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
          value={getRecipe()}
          className="block w-full pl-10 pr-4 py-2 border rounded-md"
        />
      </div>

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
