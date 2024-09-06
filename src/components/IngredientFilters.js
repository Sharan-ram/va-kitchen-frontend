import { ingredientType, vendors } from "@/helpers/constants";
import Input from "./Input";

const IngredientFilters = ({
  ingredientTypeFilter,
  setIngredientTypeFilter,
  vendorFilter,
  setVendorFilter,
}) => {
  return (
    <div>
      <p>Filters:</p>
      <div>
        <label
          htmlFor="ingredientType"
          className="block text-sm font-medium text-gray-700"
        >
          Ingredient Type
        </label>
        <Input
          type="select" // Set type to "select" for dropdown
          selectProps={{
            selected: ingredientTypeFilter,
            onChange: (e) => setIngredientTypeFilter(e.target.value),
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

      <div>
        <label
          htmlFor="vendor"
          className="block text-sm font-medium text-gray-700"
        >
          Vendor
        </label>
        <Input
          type="select" // Set type to "select" for dropdown
          selectProps={{
            selected: vendorFilter,
            onChange: (e) => setVendorFilter(e.target.value),
            defaultValue: "", // Default value if needed
            options: [{ value: "", text: "Select Vendor" }, ...vendors],
            name: "vendor",
          }}
          classes={{ wrapper: "mt-1" }}
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center"
        onClick={() => {
          setIngredientTypeFilter("");
          setVendorFilter("");
        }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default IngredientFilters;
