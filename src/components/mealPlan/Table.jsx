import React from "react";
import RecipeSearchInput from "./RecipeSearchInput";
import MealCountInput from "./MealCountInput";
import { weekDays, meals, seasons, months } from "@/helpers/constants";
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
  setActiveMealForComments,
}) => {
  const getMealPlanObj = (year, month) => {
    const mealPlanObj = mealPlan.find(
      (obj) => obj.year === year && obj.month === month
    );
    return mealPlanObj || {};
  };

  const setSeasonPerDay = ({
    season,
    selectedDateObjIndex,
    date,
    mealPlan,
  }) => {
    let newMealPlan = JSON.parse(JSON.stringify(mealPlan));
    // console.log({ selectedDateObjIndex, newMealPlan });
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

  const getComments = ({ mealPlan, date, meal }) => {
    const dayObj = mealPlan?.days?.find((dateObj) => dateObj.date === date);
    // console.log({ date, meal, dayObj });
    if (!dayObj) return [];
    if (!dayObj[meal]) return [];
    return dayObj[meal].comments || [];
  };

  return (
    <div className="meal-plan-table mt-8 max-w-[100%]">
      {page === "create" && (
        <h2 className="text-lg font-semibold mb-4">
          Meal Plan for {months[month - 1].text} {year}
        </h2>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Day
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Early Morning
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Breakfast
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Lunch
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Evening
            </th>
            <th className="px-3 py-2 font-bold uppercase tracking-wider">
              Dinner
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {days.map((day) => {
            // console.log({ day, formattedDay: format(day, "dd-MM-yyyy") });
            const date = day.getDate();
            const dayName = day.getDay();
            const monthRenderPage =
              page === "create" ? month : day.getMonth() + 1;
            const yearRenderPage = page === "create" ? year : day.getFullYear();
            const specificMealPlan =
              page === "create"
                ? mealPlan
                : getMealPlanObj(yearRenderPage, monthRenderPage);

            const selectedDateObjIndex = specificMealPlan.days
              ? specificMealPlan.days?.findIndex((obj) => {
                  return obj.date === format(day, "dd-MM-yyyy");
                })
              : -1;

            // console.log({ specificMealPlan, selectedDateObjIndex });

            const season =
              selectedDateObjIndex >= 0
                ? specificMealPlan.days[selectedDateObjIndex].season
                : specificMealPlan.season;

            // console.log({ season });
            return (
              <tr key={day} className="border-b">
                <td className="px-3 py-2 whitespace-nowrap font-bold min-w-[150px]">
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
                            mealPlan: specificMealPlan,
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
                  const comments = getComments({
                    mealPlan: specificMealPlan,
                    date: format(day, "dd-MM-yyyy"),
                    meal,
                  });
                  return (
                    <td
                      key={meal}
                      className="px-3 py-2 whitespace-nowrap capitalize min-w-[300px] max-w-[450px]"
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
                      {page === "render" && (
                        <div className="mt-2">
                          <button
                            onClick={() => {
                              setActiveMealForComments({
                                mealPlanId: specificMealPlan._id,
                                meal,
                                date: format(day, "dd-MM-yyyy"),
                                comments,
                              });
                            }}
                            className="px-3 py-2 rounded mr-2 bg-[#e8e3e3] text-sm hover:bg-[#dfd8d8]"
                          >
                            Comments{" "}
                            {comments.length > 0 && `- ${comments.length}`}
                          </button>
                        </div>
                      )}
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
