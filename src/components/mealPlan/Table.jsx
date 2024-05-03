import React from "react";
import RecipeSearchInput from "./RecipeSearchInput";
import MealCountInput from "./MealCountInput";
import { weekDays, meals } from "@/helpers/constants";

const MealPlanTable = ({
  month,
  year,
  mealPlan,
  setMealPlan,
  days,
  page,
  setActiveRecipe,
}) => {
  const getMealPlanObj = (year, month) => {
    const mealPlanObj = mealPlan.find(
      (obj) => obj.year === year && obj.month === month
    );
    return mealPlanObj || {};
  };

  return (
    <div className="meal-plan-table mt-8 max-w-[100%]">
      {page === "create" && (
        <h2 className="text-lg font-semibold mb-4">
          Meal Plan for {month} {year}
        </h2>
      )}
      <table className="min-w-full divide-y divide-gray-200 max-w-[100%]">
        <thead className="bg-gray-50 max-w-[100%]">
          <tr className="bg-gray-200">
            <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day
            </th>
            <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Breakfast
            </th>
            <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lunch
            </th>
            <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dinner
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 max-w-[100%]">
          {days.map((day) => {
            const date = day.getDate();
            const dayName = day.getDay();
            const monthRenderPage =
              page === "create" ? month : day.getMonth() + 1;
            const yearRenderPage = page === "create" ? year : day.getFullYear();
            const specificMealPlan =
              page === "create"
                ? mealPlan
                : getMealPlanObj(yearRenderPage, monthRenderPage);
            return (
              <tr key={day} className="border-b max-w-[100%]">
                <td className="px-3 py-2 whitespace-nowrap">{`${date}, ${weekDays[dayName]}`}</td>
                {meals.map((meal) => {
                  return (
                    <td
                      key={meal}
                      className="px-3 py-2 whitespace-nowrap capitalize"
                    >
                      <RecipeSearchInput
                        placeholder={`Search for ${meal} recipe`}
                        mealPlan={specificMealPlan}
                        setMealPlan={setMealPlan}
                        date={day}
                        meal={meal}
                        month={month || monthRenderPage}
                        year={year || yearRenderPage}
                        setActiveRecipe={setActiveRecipe}
                      />
                      <MealCountInput
                        entireMonthCounts={specificMealPlan.entireMonthCounts}
                        mealPlan={specificMealPlan}
                        setMealPlan={setMealPlan}
                        meal={meal}
                        date={day}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlanTable;
