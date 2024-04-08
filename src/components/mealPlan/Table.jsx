import React from "react";
import RecipeSearchInput from "./RecipeSearchInput";
import MealCountInput from "./MealCountInput";
import { generateDaysOfMonth } from "@/helpers/utils";
import { weekDays, meals } from "@/helpers/constants";

const MealPlanTable = ({
  month,
  year,
  // veganCount,
  // nonVeganCount,
  // glutenFreeCount,
  mealPlan,
  setMealPlan,
}) => {
  const daysInMonth = generateDaysOfMonth(year, Number(month) - 1);
  return (
    <div className="meal-plan-table mt-8 max-w-[100%]">
      <h2 className="text-lg font-semibold mb-4">
        Meal Plan for {month} {year}
      </h2>
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
          {daysInMonth.map((day) => {
            const date = day.getDate();
            const dayName = day.getDay();
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
                        mealPlan={mealPlan}
                        setMealPlan={setMealPlan}
                        date={day}
                        meal={meal}
                        month={month}
                        year={year}
                      />
                      <MealCountInput
                        entireMonthCounts={mealPlan.entireMonthCounts}
                        mealPlan={mealPlan}
                        setMealPlan={setMealPlan}
                        meal={meal}
                        date={date}
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
