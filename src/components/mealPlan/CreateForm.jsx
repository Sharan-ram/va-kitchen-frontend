import React, { useState } from "react";
import Input from "@/components/Input";
import { years, months, seasons } from "@/helpers/constants";

const MealPlanForm = () => {
  const [formData, setFormData] = useState({
    year: "",
    month: "",
    season: "",
    veganCount: 0,
    nonVeganCount: 0,
    glutenFreeCount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowMealPlan = () => {};

  return (
    <div className="flex flex-wrap justify-between">
      <Input
        type="select"
        selectProps={{
          selected: formData.year,
          onChange: (e) => setFormData({ ...formData, year: e.target.value }),
          options: [{ value: "", text: "Select year" }, ...years],
        }}
        classes={{ wrapper: "w-1/4 mr-4 mb-4" }}
      />
      <Input
        type="select"
        selectProps={{
          selected: formData.month,
          onChange: (e) => setFormData({ ...formData, month: e.target.value }),
          options: [{ value: "", text: "Select month" }, ...months],
        }}
        classes={{ wrapper: "w-1/4 mr-4 mb-4" }}
      />
      <Input
        type="select"
        selectProps={{
          selected: formData.season,
          onChange: (e) => setFormData({ ...formData, season: e.target.value }),
          options: [{ value: "", text: "Select season" }, ...seasons],
        }}
        classes={{ wrapper: "w-1/4 mr-4 mb-4" }}
      />
      <div className="w-1/4 mr-4 mb-4">
        <label
          htmlFor="veganCount"
          className="block text-sm font-medium text-gray-700"
        >
          Vegan Count
        </label>
        <input
          type="number"
          id="veganCount"
          value={formData.veganCount}
          onChange={(e) =>
            setFormData({ ...formData, veganCount: e.target.value })
          }
          placeholder="Vegan Count"
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </div>
      <div className="w-1/4 mr-4 mb-4">
        <label
          htmlFor="nonVeganCount"
          className="block text-sm font-medium text-gray-700"
        >
          Non-Vegan Count
        </label>
        <input
          type="number"
          id="nonVeganCount"
          value={formData.nonVeganCount}
          onChange={(e) =>
            setFormData({ ...formData, nonVeganCount: e.target.value })
          }
          placeholder="Non-Vegan Count"
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </div>
      <div className="w-1/4 mr-4 mb-4">
        <label
          htmlFor="glutenFreeCount"
          className="block text-sm font-medium text-gray-700"
        >
          Gluten-Free Count
        </label>
        <input
          type="number"
          id="glutenFreeCount"
          value={formData.glutenFreeCount}
          onChange={(e) =>
            setFormData({ ...formData, glutenFreeCount: e.target.value })
          }
          placeholder="Gluten-Free Count"
          className="w-full rounded-md border border-gray-300 p-2"
        />
      </div>
      <div className="w-full mb-4">
        <button
          onClick={handleShowMealPlan}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Show Meal Plan
        </button>
      </div>
    </div>
  );
};

export default MealPlanForm;
