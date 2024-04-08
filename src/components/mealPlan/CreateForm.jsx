import React, { useState } from "react";
import Input from "@/components/Input";
import { years, months, seasons } from "@/helpers/constants";

const MealPlanForm = ({ showTable, formData, setFormData, setMealPlan }) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const [season, setSeason] = useState("");

  const [entireMonthCounts, setEntireMonthCounts] = useState({
    veganCount: 0,
    nonVeganCount: 0,
    glutenFreeCount: 0,
  });

  const [step, setStep] = useState(1);

  const handleShowMealPlan = () => {
    showTable(true);
  };

  return (
    <div>
      <div className="flex">
        <Input
          type="select"
          selectProps={{
            selected: year,
            onChange: (e) => setYear(e.target.value),
            options: [{ value: "", text: "Select year" }, ...years],
          }}
          classes={{ wrapper: "w-1/4 mr-4 mb-4" }}
        />
        <Input
          type="select"
          selectProps={{
            selected: month,
            onChange: (e) => setMonth(e.target.value),
            options: [{ value: "", text: "Select month" }, ...months],
          }}
          classes={{ wrapper: "w-1/4 mr-4 mb-4" }}
        />
        <button
          onClick={() => setStep(2)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Next
        </button>
      </div>

      {step === 2 && (
        <div className="">
          <Input
            type="select"
            selectProps={{
              selected: season,
              onChange: (e) => setSeason(e.target.value),
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
              value={entireMonthCounts.veganCount}
              onChange={(e) =>
                setEntireMonthCounts({ veganCount: e.target.value })
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
              value={entireMonthCounts.nonVeganCount}
              onChange={(e) =>
                setEntireMonthCounts({ nonVeganCount: e.target.value })
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
              value={entireMonthCounts.glutenFreeCount}
              onChange={(e) =>
                setEntireMonthCounts({ glutenFreeCount: e.target.value })
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
      )}
    </div>
  );
};

export default MealPlanForm;
