import Modal from "./Modal";
import Input from "./Input";
import { useState } from "react";

const UpdateRecipeModal = ({
  activeRecipe,
  recipes,
  setRecipes,
  toggleModal,
  setActiveRecipe,
  season,
  ingredients,
}) => {
  const [addIngredientCount, setIngredientCount] = useState(0);
  const [dropdownIngredient, setDropdownIngredient] = useState([]);
  const [ingredientQuantity, setIngredientQuantity] = useState([]);

  console.log({ ingredientQuantity });

  const renderAddIngredientDropdown = () => {
    const arr = [];
    for (let i = 0; i < addIngredientCount; i++) {
      arr.push(
        <div className="w-full flex items-center mb-2">
          <div className="w-[40%]">
            <select
              onChange={(e) => {
                const newDropdownIngredient = dropdownIngredient.slice();
                newDropdownIngredient[i] = e.target.value;
                setDropdownIngredient(newDropdownIngredient);
              }}
              selected={
                (dropdownIngredient && dropdownIngredient[i]) ||
                "Select Ingredient"
              }
              className="rounded-md border border-black pl-2 w-full"
            >
              <option value="Select Ingredient">Select Ingredient</option>
              {Object.keys(ingredients).map((ingredient) => {
                return <option value={ingredient}>{ingredient}</option>;
              })}
            </select>
          </div>
          <div className="w-[40%] pl-2">
            <Input
              value={ingredientQuantity[i]}
              onChange={(e) => {
                const newIngredientQuantity = ingredientQuantity.slice();
                newIngredientQuantity[i] = e.target.value;
                setIngredientQuantity(newIngredientQuantity);
              }}
            />
          </div>
        </div>
      );
    }
    return arr;
  };

  return (
    <Modal closeModal={() => toggleModal(false)}>
      <div>
        <p className="font-bold text-xl mb-6">{activeRecipe}</p>
        {Object.keys(recipes[activeRecipe].ingredients).map((ingredient) => {
          // console.log(
          //   "val",
          //   recipes[activeRecipe].ingredients[ingredient][season]
          // );
          return (
            <div key={ingredient} className="flex items-center mb-2 w-full">
              <div className="w-[40%]">
                <p className="font-semibold">{ingredient}</p>
              </div>
              <div className="pl-2 w-[40%]">
                <Input
                  textInputProps={{
                    value:
                      recipes[activeRecipe].ingredients[ingredient][season],
                    onChange: (e) => {
                      console.log("e", e.target.value);
                      const newRecipesData = {
                        ...recipes,
                        [activeRecipe]: {
                          ...recipes[activeRecipe],
                          ingredients: {
                            ...recipes[activeRecipe].ingredients,
                            [ingredient]: {
                              ...recipes[activeRecipe].ingredients[ingredient],
                              [season]: e.target.value,
                            },
                          },
                        },
                      };
                      console.log({ newRecipesData });
                      setRecipes(newRecipesData);
                    },
                  }}
                />
              </div>
              <div className="pl-1 w-[20%]">
                {ingredients[ingredient].cookingUnit}
              </div>
            </div>
          );
        })}
        {renderAddIngredientDropdown()}
        <div>
          <button
            onClick={() => {
              setIngredientCount(addIngredientCount + 1);
            }}
            className="bg-[#999999] text-white w-10 rounded mt-2"
          >
            +
          </button>
        </div>
        <div className="w-full text-center mt-6">
          <button
            className="bg-[#999999] text-white px-4 py-2 rounded"
            onClick={() => {
              let newRecipes = { ...recipes };
              dropdownIngredient.forEach((ingredient, index) => {
                console.log({ ingredient });
                const updatedRecipe = {
                  ...newRecipes[activeRecipe],
                  ingredients: {
                    ...newRecipes[activeRecipe].ingredients,
                    [ingredient]: {
                      ...newRecipes[activeRecipe].ingredients[ingredient],
                      [season]: ingredientQuantity[index],
                    },
                  },
                };

                console.log({ updatedRecipe, ingredientQuantity });

                // Update the newRecipes object with the updated recipe
                newRecipes = {
                  ...newRecipes,
                  [activeRecipe]: updatedRecipe,
                };
                // console.log({ newRecipes });
              });
              setRecipes(newRecipes);
              setIngredientCount(0);
              setDropdownIngredient([]);
              setIngredientQuantity([]);
              setActiveRecipe();
              toggleModal(false);
              localStorage.setItem("tempRecipes", JSON.stringify(newRecipes));
              setIngredientCount(0);
            }}
          >
            Update recipe ingredients
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateRecipeModal;
