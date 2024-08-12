import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import { years, months, seasons } from "@/helpers/constants";
import { getMealPlanPerMonth } from "@/services/mealPlan";

const MealPlanForm = ({
  showTable,
  setMealPlan,
  entireMonthCounts,
  mealPlan,
  setIsNew,
  isNew,
}) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const [season, setSeason] = useState(mealPlan.season || "");
  const [monthCounts, setMonthCounts] = useState(entireMonthCounts);

  useEffect(() => {
    setMonthCounts(entireMonthCounts);
    setSeason(mealPlan.season);
  }, [entireMonthCounts, mealPlan]);

  const [step, setStep] = useState(1);

  const [loadingMealPlan, setLoadingMealPlan] = useState(false);

  const handleShowMealPlan = () => {
    setMealPlan({
      ...mealPlan,
      season,
      entireMonthCounts: monthCounts,
    });
    showTable(true);
  };

  const fetchMealPlan = async () => {
    setLoadingMealPlan(true);
    try {
      const res = await getMealPlanPerMonth(year, month);
      if (res.length === 0) {
        setMealPlan({
          year: Number(year),
          month: Number(month),
        });
        setIsNew(true);
      } else {
        setMealPlan(res.data.data[0]);
        setIsNew(false);
      }
      setLoadingMealPlan(false);
      setStep(2);
    } catch (e) {
      console.error(e);
      setLoadingMealPlan(false);
    }
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
          onClick={fetchMealPlan}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Next
        </button>
      </div>

      {!loadingMealPlan && step === 2 && (
        <div className="">
          <Input
            type="select"
            key={season}
            selectProps={{
              selected: season,
              onChange: (e) => setSeason(e.target.value),
              options: [{ value: "", text: "Select season" }, ...seasons],
              // value: season,
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
              value={monthCounts.veganCount}
              onChange={(e) =>
                setMonthCounts({
                  ...monthCounts,
                  veganCount: Number(e.target.value),
                })
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
              value={monthCounts.nonVeganCount}
              onChange={(e) =>
                setMonthCounts({
                  ...monthCounts,
                  nonVeganCount: Number(e.target.value),
                })
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
              value={monthCounts.glutenFreeCount}
              onChange={(e) =>
                setMonthCounts({
                  ...monthCounts,
                  glutenFreeCount: Number(e.target.value),
                })
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
