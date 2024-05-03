import { useState } from "react";

const UpdateRecipe = ({ recipe, closeModal }) => {
  const [ingredients, setIngredients] = useState(recipe.ingredients);

  const handleUpdateRecipe = () => {
    // Logic to update the recipe with the new ingredient quantities
    console.log("Recipe updated!");
  };

  const handleAddIngredient = () => {
    // Logic to add a new ingredient input field
    console.log("Add new ingredient");
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{recipe.name}</h2>
      <div className="mb-4">
        {recipe.ingredients.map((ingredient) => (
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
              />
            </div>

            <div>
              <label className="mr-2 text-sm">Winter Quantity:</label>
              <input
                type="text"
                className="border border-gray-300 px-2 py-1 w-full rounded"
                value={ingredient.winterQuantity}
              />
            </div>

            <div>
              <label className="mr-2 text-sm">Monsoon Quantity:</label>
              <input
                type="text"
                className="border border-gray-300 px-2 py-1 w-full rounded"
                value={ingredient.monsoonQuantity}
              />
            </div>

            <div>
              <label className="mr-2 text-sm">Retreat Quantity:</label>
              <input
                type="text"
                className="border border-gray-300 px-2 py-1 w-full rounded"
                value={ingredient.retreatQuantity}
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
        className="bg-[#8e7576] text-white font-bold py-2 px-4 rounded mr-2"
        onClick={handleUpdateRecipe}
      >
        Update Recipe
      </button>
    </div>
  );
};

export default UpdateRecipe;
