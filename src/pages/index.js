// import { startOfMonth, addMonths, eachDayOfInterval } from 'date-fns';
import { useState } from "react";
import recipes from "../recipes.json";
import ingredients from "../ingredients.json";

const Homepage = () => {
  function generateDaysOfMonth() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the last day of the current month

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }

  const currentDate = new Date(); // Use the current date or any other date
  const daysOfMonth = generateDaysOfMonth(currentDate);

  //   const days = daysOfMonth.map((day) => {
  //     console.log({day})
  //     const dayOfMonth = day.getDate(); // Get the day of the month (1 to 31)
  //     // Render each day of the month in your tabular column
  //     return dayOfMonth
  //   });

  const meals = ["Breakfast", "Lunch", "Dinner"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [headcount, setHeadcount] = useState();
  const [veganCount, setVeganCount] = useState();
  const [nonVeganCount, setNonVeganCount] = useState();
  const [mealPlan, setMealPlan] = useState({});

  console.log({ recipes, ingredients });

  // Function to check if a date is Sunday
  const isSunday = (date) => date.getDay() === 0;

  console.log({ mealPlan });

  return (
    <div>
      <div className="flex">
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
                  {meals.map((meal) => (
                    <td key={`${date}-${meal}`}>
                      <select
                        selected={
                          mealPlan[`${date}-${meal}`] || "Select Recipe"
                        }
                        onChange={(e) => {
                          setMealPlan({
                            ...mealPlan,
                            [`${date}-${meal}`]: e.target.value,
                          });
                        }}
                      >
                        <option value="Select Recipe">Select Recipe</option>
                        {Object.keys(recipes).map((option) => {
                          return <option value={option}>{option}</option>;
                        })}
                      </select>
                    </td>
                  ))}
                </tr>
              );
            })}
            {daysOfMonth.some(isSunday) && <tr style={{ height: "30px" }} />}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Homepage;
