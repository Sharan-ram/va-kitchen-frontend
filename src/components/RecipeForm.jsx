import { useState } from "react";
import axios from "axios";
import Input from "./Input"; // Assuming you have an Input component for text and select fields
import classNames from "classnames";

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    ingredients: [],
  });

  const [searchText, setSearchText] = useState([]);
  const [searchResults, setSearchResults] = useState();
  const [showSearchResults, setShowSearchResults] = useState();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      ingredients: prevData.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [name]: value } : ingredient
      ),
    }));
  };

  // console.log({ formData });

  const handleAddIngredient = () => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [
        ...prevData.ingredients,
        {
          ingredient: {
            name: "",
          },
          summerQuantity: "",
          winterQuantity: "",
          monsoonQuantity: "",
          retreatQuantity: "",
        },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ingredients } = formData;
    const newIngredients = ingredients.map((ingredient) => {
      return {
        ...ingredient,
        summerQuantity: Number(ingredient.summerQuantity),
        winterQuantity: Number(ingredient.winterQuantity),
        monsoonQuantity: Number(ingredient.monsoonQuantity),
        retreatQuantity: Number(ingredient.retreatQuantity),
      };
    });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/recipe`,
      {
        ...formData,
        ingredients: newIngredients,
      }
    );
    console.log({ res });
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
    return formData.ingredients.every((ingredient) =>
      isIngredientFilled(ingredient)
    );
  };

  let debounceTimer;

  console.log({ searchText });

  const handleIngredientSearch = (e, index) => {
    const { value } = e.target;
    try {
      setSearchText([
        ...searchText.slice(0, index),
        value,
        ...searchText.slice(index + 1),
      ]);
      if (value.length >= 3) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/ingredient?search=${value}`
          );
          setSearchResults(res.data.data);
          setShowSearchResults(index);
        }, 300);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  console.log({ formData });

  const selectIngredient = (ingredient, index) => {
    console.log({ index });
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [
        ...prevData.ingredients.slice(0, index),
        {
          ...formData.ingredients[index],
          ingredient,
        },
        ...prevData.ingredients.slice(index + 1),
      ],
    }));
    // setSearchText("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <Input
            type="text"
            textInputProps={{
              id: "name",
              name: "name",
              value: formData.name,
              onChange: (e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  name: e.target.value,
                })),
            }}
            classes={{
              wrapper: "mt-1 p-2 border border-gray-300 rounded-md w-full",
            }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <Input
            type="select"
            selectProps={{
              id: "type",
              name: "type",
              value: formData.type,
              onChange: (e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  type: e.target.value,
                })),
              options: [
                { value: "", text: "Select Type" },
                { value: "vegan", text: "Vegan" },
                { value: "non-vegan", text: "Non-Vegan" },
              ],
            }}
            classes={{
              wrapper:
                "mt-1 p-2 border border-gray-300 rounded-md w-full cursor-pointer",
            }}
          />
        </div>
        {formData.ingredients.map((ingredient, index) => {
          // console.log({ showSearchResults, index, ingredient });
          return (
            <div key={index} className="mt-4 relative">
              <div className="mb-4">
                <label
                  htmlFor={`actualIngredient${index}`}
                  className="block text-base font-bold text-gray-700"
                >
                  Ingredient
                </label>
                <Input
                  type="text"
                  textInputProps={{
                    id: `id-${index}`,
                    name: ingredient.ingredient?.name || `name-${index}`,
                    value: ingredient.ingredient?.name || searchText[index],
                    onChange: (e) => handleIngredientSearch(e, index),
                  }}
                  classes={{
                    wrapper:
                      "mt-1 p-2 border border-gray-300 rounded-md w-full",
                  }}
                />
                {showSearchResults === index && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                    {searchResults.map((result, i) => {
                      return (
                        <div
                          key={i}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectIngredient(result, index)}
                        >
                          {result.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label
                    htmlFor={`summerQuantity${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Summer Quantity
                  </label>
                  <Input
                    type="text"
                    textInputProps={{
                      id: `summerQuantity${index}`,
                      name: "summerQuantity",
                      value: ingredient.summerQuantity,
                      onChange: (e) => handleChange(e, index),
                    }}
                    classes={{
                      wrapper:
                        "mt-1 p-2 border border-gray-300 rounded-md w-full",
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`winterQuantity${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Winter Quantity
                  </label>
                  <Input
                    type="text"
                    textInputProps={{
                      id: `winterQuantity${index}`,
                      name: "winterQuantity",
                      value: ingredient.winterQuantity,
                      onChange: (e) => handleChange(e, index),
                    }}
                    classes={{
                      wrapper:
                        "mt-1 p-2 border border-gray-300 rounded-md w-full",
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`monsoonQuantity${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Monsoon Quantity
                  </label>
                  <Input
                    type="text"
                    textInputProps={{
                      id: `monsoonQuantity${index}`,
                      name: "monsoonQuantity",
                      value: ingredient.monsoonQuantity,
                      onChange: (e) => handleChange(e, index),
                    }}
                    classes={{
                      wrapper:
                        "mt-1 p-2 border border-gray-300 rounded-md w-full",
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor={`retreatQuantity${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Retreat Quantity
                  </label>
                  <Input
                    type="text"
                    textInputProps={{
                      id: `retreatQuantity${index}`,
                      name: "retreatQuantity",
                      value: ingredient.retreatQuantity,
                      onChange: (e) => handleChange(e, index),
                    }}
                    classes={{
                      wrapper:
                        "mt-1 p-2 border border-gray-300 rounded-md w-full",
                    }}
                  />
                </div>
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
                onClick={() => {
                  setFormData((prevData) => ({
                    ...prevData,
                    ingredients: formData.ingredients.filter(
                      (_, i) => i !== index
                    ),
                  }));
                  setSearchText(searchText.filter((_, i) => i !== index));
                }}
              >
                Delete ingredient
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={handleAddIngredient}
          className={`px-4 py-2 rounded-md mt-5 ${
            isFormFilled()
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          disabled={!isFormFilled()}
        >
          Add Ingredient
        </button>
        <div className="mt-6">
          <button
            type="submit"
            className={classNames(
              "px-4 py-2 bg-blue-500 text-white rounded-md",
              !isFormFilled() || formData.ingredients.length === 0
                ? "hover:bg-blue-200 cursor-not-allowed"
                : "hover:bg-blue-600"
            )}
            disabled={!isFormFilled() || formData.ingredients.length === 0}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
