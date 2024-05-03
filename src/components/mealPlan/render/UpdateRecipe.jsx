import { useState, useEffect } from "react";

const UpdateRecipe = ({ recipe }) => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    setIngredients(recipe.ingredients);
  }, [recipe.ingredients]);

  const handleUpdateRecipe = () => {
    // Logic to update the recipe with the new ingredient quantities
    console.log("Recipe updated!");
  };

  const handleAddIngredient = () => {
    // Logic to add a new ingredient input field
    console.log("Add new ingredient");
  };

  const handleQuantityChange = (e, ingredient, season) => {
    const newIngredientsArr = ingredients.map((obj) => {
      if (obj._id === ingredient._id) {
        return {
          ...obj,
          [season]: e.target.value,
        };
      } else return obj;
    });
    setIngredients(newIngredientsArr);
  };

  console.log({ recipe, ingredients });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{recipe.name}</h2>
      <div className="mb-4">
        {ingredients.map((ingredient) => (
          <div key={ingredient._id} className="mb-4">
            <div>
              <h3 className="font-semibold">{ingredient.ingredient.name}</h3>
            </div>
            <div>
              <label className="mr-2 text-sm">Summer Quantity:</label>
              <input
                type="text"
                className="border border-gray-300 px-2 py-1 w-full rounded"
                value={ingredient.summerQuantity}
                onChange={(e) =>
                  handleQuantityChange(e, ingredient, "summerQuantity")
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
                  handleQuantityChange(e, ingredient, "winterQuantity")
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
                  handleQuantityChange(e, ingredient, "monsoonQuantity")
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
                  handleQuantityChange(e, ingredient, "retreatQuantity")
                }
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="bg-[#bbacac] text-white font-bold py-2 px-4 rounded mr-4"
        onClick={handleAddIngredient}
      >
        +
      </button>
      <button
        className="bg-[#8e7576] text-white font-semibold py-2 px-4 rounded mr-2"
        onClick={handleUpdateRecipe}
      >
        Update Recipe
      </button>
    </div>
  );
};

export default UpdateRecipe;
