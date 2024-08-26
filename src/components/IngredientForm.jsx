import { useState } from "react";
import {
  purchaseUnits,
  ingredientType,
  storageType,
  vendors,
} from "@/helpers/constants";
import Input from "./Input";
import { saveIngredient } from "@/services/ingredient";

const initialFormState = {
  name: "",
  englishEquivalent: "",
  ingredientType: "",
  storageType: "",
  vendor: "",
  sponsored: false,
  purchaseUnit: "",
  cookingUnit: "",
  purchaseUnitPerCookingUnit: "",
  // price: "",
  nuts: false,
  dairy: false,
  gluten: false,
  ingredientSpecificAllergy: "",
  allergyCode: 0,
  masterCode: "",
  todo: "",
};

const IngredientForm = ({ ingredient, type }) => {
  const [formData, setFormData] = useState(
    type === "edit" ? ingredient : initialFormState
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveIngredient({
        ...formData,
        purchaseUnitPerCookingUnit: Number(formData.purchaseUnitPerCookingUnit),
      });
      // console.log({ response });
      setFormData(initialFormState);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        {type === "edit" ? "Edit Ingredient" : "Add Ingredient"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="englishEquivalent"
            className="block text-sm font-medium text-gray-700"
          >
            English Equivalent
          </label>
          <input
            type="text"
            id="englishEquivalent"
            name="englishEquivalent"
            value={formData.englishEquivalent}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="ingredientType"
            className="block text-sm font-medium text-gray-700"
          >
            Ingredient Type
          </label>
          <Input
            type="select" // Set type to "select" for dropdown
            selectProps={{
              selected: formData.ingredientType,
              onChange: handleChange,
              defaultValue: "", // Default value if needed
              options: [
                { value: "", text: "Select ingredient type" },
                ...ingredientType,
              ],
              name: "ingredientType",
            }}
            classes={{ wrapper: "mt-1" }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="storageType"
            className="block text-sm font-medium text-gray-700"
          >
            Storage Type
          </label>
          <Input
            type="select" // Set type to "select" for dropdown
            selectProps={{
              selected: formData.storageType,
              onChange: handleChange,
              defaultValue: "", // Default value if needed
              options: [
                { value: "", text: "Select storage type" },
                ...storageType,
              ],
              name: "storageType",
            }}
            classes={{ wrapper: "mt-1" }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="vendor"
            className="block text-sm font-medium text-gray-700"
          >
            Vendor
          </label>
          <Input
            type="select" // Set type to "select" for dropdown
            selectProps={{
              selected: formData.vendor,
              onChange: handleChange,
              defaultValue: "", // Default value if needed
              options: [{ value: "", text: "Select Vendor" }, ...vendors],
              name: "vendor",
            }}
            classes={{ wrapper: "mt-1" }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="sponsored" className="flex items-center">
            <input
              type="checkbox"
              id="sponsored"
              name="sponsored"
              checked={formData.sponsored}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-semibold text-gray-700 cursor-pointer">
              Sponsored
            </span>
          </label>
        </div>
        <div className="mb-4">
          <label
            htmlFor="purchaseUnit"
            className="block text-sm font-medium text-gray-700"
          >
            Purchase Unit
          </label>
          <Input
            type="select" // Set type to "select" for dropdown
            selectProps={{
              selected: formData.purchaseUnit,
              onChange: handleChange,
              defaultValue: "", // Default value if needed
              options: [
                { value: "", text: "Select purchase unit" },
                ...purchaseUnits,
              ],
              name: "purchaseUnit",
            }}
            classes={{ wrapper: "mt-1" }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="purchaseUnitPerCookingUnit"
            className="block text-sm font-medium text-gray-700"
          >
            Purchase Unit Per Cooking Unit
          </label>
          <input
            type="number"
            id="purchaseUnitPerCookingUnit"
            name="purchaseUnitPerCookingUnit"
            value={formData.purchaseUnitPerCookingUnit}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cookingUnit"
            className="block text-sm font-medium text-gray-700"
          >
            Cooking Unit
          </label>
          <Input
            type="select" // Set type to "select" for dropdown
            selectProps={{
              selected: formData.cookingUnit,
              onChange: handleChange,
              defaultValue: "", // Default value if needed
              options: [
                { value: "", text: "Select cooking unit" },
                ...purchaseUnits,
              ],
              name: "cookingUnit",
            }}
            classes={{ wrapper: "mt-1" }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nuts" className="flex items-center">
            <input
              type="checkbox"
              id="nuts"
              name="nuts"
              checked={formData.nuts}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-semibold text-gray-700 cursor-pointer">
              Nuts
            </span>
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="dairy" className="flex items-center">
            <input
              type="checkbox"
              id="dairy"
              name="dairy"
              checked={formData.dairy}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-semibold text-gray-700 cursor-pointer">
              Dairy
            </span>
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="gluten" className="flex items-center">
            <input
              type="checkbox"
              id="gluten"
              name="gluten"
              checked={formData.gluten}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-semibold text-gray-700 cursor-pointer">
              Gluten
            </span>
          </label>
        </div>
        <div className="mb-4">
          <label
            htmlFor="ingredientSpecificAllergy"
            className="block text-sm font-medium text-gray-700"
          >
            Ingredient Specific Allergy
          </label>
          <input
            type="text"
            id="ingredientSpecificAllergy"
            name="ingredientSpecificAllergy"
            value={formData.ingredientSpecificAllergy}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="allergyCode"
            className="block text-sm font-medium text-gray-700"
          >
            Allergy Code
          </label>
          <input
            type="number"
            id="allergyCode"
            name="allergyCode"
            value={formData.allergyCode}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="masterCode"
            className="block text-sm font-medium text-gray-700"
          >
            Master Code
          </label>
          <input
            type="text"
            id="masterCode"
            name="masterCode"
            value={formData.masterCode}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="todo"
            className="block text-sm font-medium text-gray-700"
          >
            Todo
          </label>
          <input
            type="text"
            id="todo"
            name="todo"
            value={formData.todo}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Ingredient
          </button>
        </div>
      </form>
    </div>
  );
};

export default IngredientForm;
