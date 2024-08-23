import React from "react";
import RecipeSearchInput from "./RecipeSearchInput";
import MealCountInput from "./MealCountInput";
import { weekDays, meals, seasons } from "@/helpers/constants";
import { format } from "date-fns";
import Input from "@/components/Input";

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

  const setSeasonPerDay = ({ season, selectedDateObjIndex, date }) => {
    let newMealPlan = JSON.parse(JSON.stringify(mealPlan));
    console.log({ selectedDateObjIndex });
    if (selectedDateObjIndex >= 0) {
      newMealPlan.days[selectedDateObjIndex].season = season;
    } else {
      if (newMealPlan.days) {
        newMealPlan.days.push({
          date,
          season,
        });
      } else {
        newMealPlan = {
          ...newMealPlan,
          days: [
            {
              date,
              season,
            },
          ],
        };
      }
    }
    setMealPlan(newMealPlan);
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
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Day
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Breakfast
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Lunch
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
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
            // console.log({ day });
            const selectedDateObjIndex = mealPlan.days?.findIndex((obj) => {
              return obj.date === format(day, "dd-MM-yyyy");
            });
            const season =
              selectedDateObjIndex && selectedDateObjIndex > 0
                ? mealPlan.days[selectedDateObjIndex].season
                : mealPlan.season;

            // console.log({ season });
            return (
              <tr key={day} className="border-b max-w-[100%]">
                <td className="px-3 py-2 whitespace-nowrap font-bold">
                  <div>{`${date}, ${weekDays[dayName]}`}</div>
                  <div>
                    <Input
                      type="select"
                      selectProps={{
                        selected: season,
                        onChange: (e) =>
                          setSeasonPerDay({
                            season: e.target.value,
                            selectedDateObjIndex,
                            date: format(day, "dd-MM-yyyy"),
                          }),
                        options: [
                          { value: "", text: "Select season" },
                          ...seasons,
                        ],
                        // value: season,
                      }}
                      classes={{ wrapper: "w-1/4 mr-4 mb-4" }}
                    />
                  </div>
                </td>
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
                        allowRecipeUpdate={page === "create" ? false : true}
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
