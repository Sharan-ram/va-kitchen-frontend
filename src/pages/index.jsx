// import { startOfMonth, addMonths, eachDayOfInterval } from 'date-fns';
import { useState, useEffect } from "react";
import recipes from "../recipes.json";
import ingredients from "../ingredients.json";
import { useRouter } from "next/router";
import { generateDaysOfMonth } from "@/helpers/utils";

const Homepage = () => {
  const meals = ["Breakfast", "Lunch", "Dinner"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [headcount, setHeadcount] = useState();
  const [veganCount, setVeganCount] = useState();
  const [nonVeganCount, setNonVeganCount] = useState();
  const [mealPlan, setMealPlan] = useState({});
  const [season, setSeason] = useState();
  const [dropdowns, setDropdowns] = useState({});
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (window) {
      setMealPlan(JSON.parse(localStorage.getItem("mealPlan")));
      setVeganCount(Number(JSON.parse(localStorage.getItem("veganCount"))));
      setNonVeganCount(
        Number(JSON.parse(localStorage.getItem("nonVeganCount")))
      );
      setSeason(JSON.parse(localStorage.getItem("season")));
      setMounted(true);
    }
  }, []);

  // Function to check if a date is Sunday
  const isSunday = (date) => date.getDay() === 0;

  console.log({ mealPlan, mounted });

  // function generateDaysOfMonth() {
  //   const currentDate = new Date();
  //   const currentYear = currentDate.getFullYear();
  //   const currentMonth = currentDate.getMonth();
  //   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the last day of the current month

  //   const days = [];
  //   for (let day = 1; day <= daysInMonth; day++) {
  //     days.push(new Date(currentYear, currentMonth, day));
  //   }

  //   return days;
  // }

  const currentDate = new Date(); // Use the current date or any other date
  const daysOfMonth = generateDaysOfMonth(currentDate);

  //   const days = daysOfMonth.map((day) => {
  //     console.log({day})
  //     const dayOfMonth = day.getDate(); // Get the day of the month (1 to 31)
  //     // Render each day of the month in your tabular column
  //     return dayOfMonth
  //   });

  const getDropdownsForAMeal = ({ date, meal }) => {
    const cell = [];

    const getExitStrategy = () => {
      const recipes = mealPlan ? mealPlan[`${date}-${meal}`] : undefined;
      const mealDropdownsLength = dropdowns[`${date}-${meal}`];
      if (recipes) {
        if (mealDropdownsLength) {
          return recipes.length > mealDropdownsLength
            ? recipes.length
            : mealDropdownsLength;
        }
        return recipes.length;
      }
      if (mealDropdownsLength) return mealDropdownsLength;
      return 1;
    };

    for (let i = 0; i < getExitStrategy(); i++) {
      cell.push(
        <div>
          <select
            key={mealPlan ? mealPlan[`${date}-${meal}`]?.[i] : i}
            selected={
              mealPlan ? mealPlan[`${date}-${meal}`]?.[i] : "Select Recipe"
            }
            defaultValue={
              mealPlan ? mealPlan[`${date}-${meal}`]?.[i] : "Select Recipe"
            }
            onChange={(e) => {
              let newMealPlan = Object.assign(mealPlan || {});
              if (newMealPlan[`${date}-${meal}`]) {
                newMealPlan[`${date}-${meal}`][i] = e.target.value;
              } else {
                newMealPlan[`${date}-${meal}`] = [];
                newMealPlan[`${date}-${meal}`][i] = e.target.value;
              }
              setMealPlan(newMealPlan);
            }}
          >
            <option value="Select Recipe">Select Recipe</option>
            {Object.keys(recipes).map((option) => {
              return <option value={option}>{option}</option>;
            })}
          </select>
        </div>
      );
    }

    return cell;
  };

  const submitMealPlan = () => {
    if (veganCount !== undefined && nonVeganCount !== undefined && season) {
      //   togglePurchaseOrder(true);
      //   setPurchaseOrder(getPurchaseOrder());
      localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
      localStorage.setItem("veganCount", JSON.stringify(veganCount));
      localStorage.setItem("nonVeganCount", JSON.stringify(nonVeganCount));
      localStorage.setItem("season", JSON.stringify(season));
      localStorage.setItem("tempRecipes", JSON.stringify(recipes));
      router.push("/meal-plan");
    }
  };

  return (
    <div>
      <div>
        <div className="flex bg-black">
          <div>
            <input
              type="text"
              placeholder="Select head count"
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Select Vegan Count"
              value={veganCount}
              onChange={(e) => setVeganCount(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Select Non Vegan"
              value={nonVeganCount}
              onChange={(e) => setNonVeganCount(e.target.value)}
            />
          </div>
          <div>
            <select
              selected={season}
              onChange={(e) => setSeason(e.target.value)}
              key={season}
              defaultValue={season}
            >
              <option value="Select Seaon">Select Season</option>
              <option value="summerQuantity">Summer</option>
              <option value="monsoonQuantity">Monsoon</option>
              <option value="winterQuantity">Winter</option>
              <option value="retreatQuantity">Retreat</option>
            </select>
          </div>
        </div>
        <div>
          <table>
            <thead>
              <tr className="border border-black">
                <th>Day</th>
                {meals.map((meal) => (
                  <th key={meal}>{meal}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfMonth.map((day, index) => {
                const date = day.getDate();
                const dayName = day.getDay();
                return (
                  <tr className="border border-black" key={day}>
                    <td>{`${date}, ${weekDays[dayName]}`}</td>
                    {meals.map((meal) => {
                      return (
                        <td key={`${date}-${meal}`}>
                          {getDropdownsForAMeal({ date, meal })}
                          <button
                            onClick={() => {
                              if (dropdowns[`${date}-${meal}`]) {
                                setDropdowns({
                                  ...dropdowns,
                                  [`${date}-${meal}`]:
                                    dropdowns[`${date}-${meal}`] + 1,
                                });
                              } else {
                                setDropdowns({
                                  ...dropdowns,
                                  [`${date}-${meal}`]: 2,
                                });
                              }
                            }}
                          >
                            +
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {daysOfMonth.some(isSunday) && <tr style={{ height: "30px" }} />}
            </tbody>
          </table>
          <button onClick={submitMealPlan}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
