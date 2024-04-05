import React from "react";
import RecipeSearchInput from "./RecipeSearchInput";
import MealCountInput from "./MealCountInput";
import { generateDaysOfMonth } from "@/helpers/utils";
import { weekDays, meals } from "@/helpers/constants";

const MealPlanTable = ({ month, year }) => {
  const daysInMonth = generateDaysOfMonth(year, Number(month) - 1);
  return (
    <div className="meal-plan-table mt-8">
      <h2 className="text-lg font-semibold mb-4">
        Meal Plan for {month} {year}
      </h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Breakfast
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lunch
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dinner
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {daysInMonth.map((day) => {
            const date = day.getDate();
            const dayName = day.getDay();
            return (
              <tr key={day} className="border-b">
                <td className="px-6 py-4 whitespace-nowrap">{`${date}, ${weekDays[dayName]}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RecipeSearchInput placeholder="Search for breakfast recipe" />
                  <MealCountInput />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RecipeSearchInput placeholder="Search for lunch recipe" />
                  <MealCountInput />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RecipeSearchInput placeholder="Search for dinner recipe" />
                  <MealCountInput />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlanTable;
