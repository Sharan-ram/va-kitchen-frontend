import { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import { Trash } from "phosphor-react";

const UpdateRecipe = ({ recipe }) => {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, toggleSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setIngredients(recipe.ingredients);
  }, [recipe.ingredients]);

  const handleUpdateRecipe = () => {
    // Logic to update the recipe with the new ingredient quantities
    console.log("Recipe updated!");
  };

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
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient?search=${value}`
          );
          setSearchResults(res.data.data);
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
    // Check if all fields inside the ingredient object are filled
    return Object.values(ingredient).every((value) => {
      if (typeof value === "string") {
        // If the value is a string, check if it's not empty after trimming
        return value.trim() !== "";
      } else if (typeof value === "object") {
        // If the value is an object, recursively check its fields
        return isIngredientFilled(value);
      } else {
        // For other types of values, consider them filled
        return true;
      }
    });
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

  console.log({ recipe, ingredients });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{recipe.name}</h2>
      <div className="mb-4">
        {ingredients.map((ingredient, index) => (
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
            <div>
              <label className="mr-2 text-sm">Summer Quantity:</label>
              <input
                type="text"
                className="border border-gray-300 px-2 py-1 w-full rounded"
                value={ingredient.summerQuantity}
                onChange={(e) =>
                  handleQuantityChange(e, ingredient, "summerQuantity", index)
                }
              />
            </div>

            <div>
              <label className="mr-2 text-sm">Winter Quantity:</label>
              <input
                type="text"
                className="border border-gray-300 px-2 py-1 w-full rounded"
                value={ingredient.winterQuantity}
                onChange={(e) =>
                  handleQuantityChange(e, ingredient, "winterQuantity", index)
                }
              />
            </div>

            <div>
              <label className="mr-2 text-sm">Monsoon Quantity:</label>
              <input
                type="text"
                className="border border-gray-300 px-2 py-1 w-full rounded"
                value={ingredient.monsoonQuantity}
                onChange={(e) =>
                  handleQuantityChange(e, ingredient, "monsoonQuantity", index)
                }
              />
            </div>

            <div>
              <label className="mr-2 text-sm">Retreat Quantity:</label>
              <input
                type="text"
                className="border border-gray-300 px-2 py-1 w-full rounded"
                value={ingredient.retreatQuantity}
                onChange={(e) =>
                  handleQuantityChange(e, ingredient, "retreatQuantity", index)
                }
              />
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default UpdateRecipe;
