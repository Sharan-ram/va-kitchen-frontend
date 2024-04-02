import { useState } from "react";
import axios from "axios";

const IngredientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    englishEquivalent: "",
    ingredientType: "",
    storageType: "",
    vendor: "",
    sponsored: false,
    purchaseUnit: "",
    cookingUnit: "",
    purchaseUnitPerCookingUnit: "",
    price: "",
  });

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
      const response = await axios.post(
        `${process.env.BACKEND_URL}/ingredient`,
        {
          ...formData,
        }
      );
      console.log({ response });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add Ingredient</h2>
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
          <input
            type="text"
            id="ingredientType"
            name="ingredientType"
            value={formData.ingredientType}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="storageType"
            className="block text-sm font-medium text-gray-700"
          >
            Storage Type
          </label>
          <input
            type="text"
            id="storageType"
            name="storageType"
            value={formData.storageType}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="vendor"
            className="block text-sm font-medium text-gray-700"
          >
            Vendor
          </label>
          <input
            type="text"
            id="vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
            <span className="text-sm font-medium text-gray-700">Sponsored</span>
          </label>
        </div>
        <div className="mb-4">
          <label
            htmlFor="purchaseUnit"
            className="block text-sm font-medium text-gray-700"
          >
            Purchase Unit
          </label>
          <input
            type="text"
            id="purchaseUnit"
            name="purchaseUnit"
            value={formData.purchaseUnit}
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
          <input
            type="text"
            id="cookingUnit"
            name="cookingUnit"
            value={formData.cookingUnit}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
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
