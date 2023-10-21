// import { startOfMonth, addMonths, eachDayOfInterval } from 'date-fns';
import { useState, useEffect } from "react";
import recipes from "../recipes.json";
import ingredients from "../ingredients.json";
import { useRouter } from "next/router";
import { generateDaysOfMonth, getRecipesForMeal } from "@/helpers/utils";
import Input from "@/components/Input";

const Homepage = () => {
  const meals = ["breakfast", "lunch", "dinner"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [veganCount, setVeganCount] = useState();
  const [nonVeganCount, setNonVeganCount] = useState();
  const [mealPlan, setMealPlan] = useState({});
  const [season, setSeason] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [showMealPlan, setShowMealPlan] = useState(false);
  const router = useRouter();

  const daysOfMonth = generateDaysOfMonth(year, Number(month) - 1);

  const getDropdownsForAMeal = ({ date, meal }) => {
    const cell = [];
    const recipesForMeal = getRecipesForMeal({
      date,
      meal,
      year,
      month,
      mealPlan,
    });
    const recipeMealLength = recipesForMeal?.length || 0;

    for (let i = 0; i <= recipeMealLength; i++) {
      const singleRecipeForMeal = recipesForMeal?.[i];
      const singleMealId = singleRecipeForMeal?.id;
      cell.push(
        <div className="mb-2">
          <select
            key={singleMealId}
            selected={singleMealId || "Select Recipe"}
            defaultValue={singleMealId || "Select Recipe"}
            onChange={(e) => {
              let newMealPlan = Object.assign(mealPlan || {});
              if (newMealPlan[`${month}-${year}`]) {
                newMealPlan = {
                  ...newMealPlan,
                  [`${month}-${year}`]: {
                    ...newMealPlan[`${month}-${year}`],
                    [`${date}`]: {
                      ...newMealPlan[`${month}-${year}`]?.[`${date}`],
                      [meal]: {
                        ...newMealPlan?.[`${month}-${year}`]?.[`${date}`]?.[
                          meal
                        ],
                        recipes: recipesForMeal
                          ? [
                              ...recipesForMeal.slice(0, i),
                              recipes[e.target.value],
                              ...recipesForMeal.slice(i),
                            ]
                          : [recipes[e.target.value]],
                      },
                    },
                  },
                };
              } else {
                newMealPlan = {
                  ...newMealPlan,
                  [`${month}-${year}`]: {
                    [`${date}`]: {
                      [meal]: {
                        recipes: [],
                        veganCount,
                        nonVeganCount,
                      },
                    },
                    season,
                    veganCount,
                    nonVeganCount,
                  },
                };
                newMealPlan[`${month}-${year}`][`${date}`][meal].recipes[i] =
                  recipes[e.target.value];
              }
              setMealPlan(newMealPlan);
            }}
            className="rounded-md border border-black pl-2"
          >
            <option value="Select Recipe">Select Recipe</option>
            {Object.keys(recipes).map((option, index) => {
              return (
                <option value={option} key={index}>
                  {recipes[option].name}
                </option>
              );
            })}
          </select>
        </div>
      );
    }

    return cell;
  };

  const submitMealPlan = () => {
    if (
      veganCount !== undefined &&
      nonVeganCount !== undefined &&
      season !== undefined &&
      year !== undefined
    ) {
      localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
      router.push("/meal-plan");
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-between w-9/12 items-center">
          <div>
            <div>
              <p className="font-semibold">Vegan Count</p>
            </div>
            <Input
              type="text"
              textInputProps={{
                placeholder: "Select Vegan Count",
                value: veganCount,
                onChange: (e) => setVeganCount(e.target.value),
              }}
            />
          </div>
          <div>
            <div>
              <p className="font-semibold">Non-vegan Count</p>
            </div>
            <Input
              type="text"
              textInputProps={{
                placeholder: "Select Non Vegan Count",
                value: nonVeganCount,
                onChange: (e) => setNonVeganCount(e.target.value),
              }}
            />
          </div>
          <div>
            <div>
              <p className="font-semibold">Season</p>
            </div>
            <Input
              type="select"
              key={season}
              selectProps={{
                selected: season,
                onChange: (e) => setSeason(e.target.value),
                defaultValue: season,
                options: [
                  { text: "Summer", value: "summerQuantity" },
                  { text: "Monsoon", value: "monsoonQuantity" },
                  { text: "Winter", value: "winterQuantity" },
                  { text: "Retreat", value: "retreatQuantity" },
                ],
              }}
            />
          </div>
          <div>
            <div>
              <p className="font-semibold">Month</p>
            </div>
            <Input
              type="select"
              key={month}
              selectProps={{
                selected: month,
                onChange: (e) => setMonth(e.target.value),
                defaultValue: month,
                options: [
                  { text: "January", value: "01" },
                  { text: "February", value: "02" },
                  { text: "March", value: "03" },
                  { text: "April", value: "04" },
                  { text: "May", value: "05" },
                  { text: "June", value: "06" },
                  { text: "July", value: "07" },
                  { text: "August", value: "08" },
                  { text: "September", value: "09" },
                  { text: "October", value: "10" },
                  { text: "November", value: "11" },
                  { text: "December", value: "12" },
                ],
              }}
            />
          </div>
          <div>
            <div>
              <p className="font-semibold">Year</p>
            </div>
            <Input
              type="select"
              key={year}
              selectProps={{
                selected: year,
                onChange: (e) => setYear(e.target.value),
                defaultValue: year,
                options: [
                  { text: "2023", value: "2023" },
                  { text: "2024", value: "2024" },
                ],
              }}
            />
          </div>
          <div>
            <button
              onClick={() => {
                const mealPlan = JSON.parse(localStorage.getItem("mealPlan"));
                setShowMealPlan(true);
                setMealPlan(mealPlan);
              }}
              className="bg-[#666666] text-white px-4 py-2 rounded-[5px] mt-6"
            >
              Show Meal plan
            </button>
          </div>
        </div>
        {showMealPlan && (
          <div className="mt-6 w-full">
            <table className="border-2 border-black w-full">
              <thead className="border-b-2 border-b-black">
                <tr>
                  <th className="border-r border-r-black py-2">Day</th>
                  {meals.map((meal) => (
                    <th className="border-r border-r-black py-2" key={meal}>
                      {meal}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfMonth.map((day, index) => {
                  const date = day.getDate();
                  const dayName = day.getDay();
                  return (
                    <tr className="border border-black" key={day}>
                      <td className="border-r border-r-black font-bold text-lg p-4">{`${date}, ${weekDays[dayName]}`}</td>
                      {meals.map((meal) => {
                        return (
                          <td
                            className="border-r border-r-black p-4"
                            key={`${date}-${meal}`}
                          >
                            {getDropdownsForAMeal({ date, meal })}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              onClick={submitMealPlan}
              className="bg-[#666666] text-white px-4 py-2 rounded-[5px] mt-6"
            >
              Create Meal plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
