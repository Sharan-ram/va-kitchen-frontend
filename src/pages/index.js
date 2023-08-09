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
  const [showPurchaseOrder, togglePurchaseOrder] = useState(false);
  const [season, setSeason] = useState();
  const [purchaseOrder, setPurchaseOrder] = useState();
  const [dropdowns, setDropdowns] = useState({});

  // Function to check if a date is Sunday
  const isSunday = (date) => date.getDay() === 0;

  console.log({ mealPlan });

  const submitMealPlan = () => {
    togglePurchaseOrder(true);
    setPurchaseOrder(getPurchaseOrder());
  };

  console.log({ purchaseOrder, showPurchaseOrder });

  const getPurchaseOrder = () => {
    const obj = {};
    Object.keys(mealPlan).forEach((meal) => {
      const recipe = mealPlan[meal];
      console.log({ recipe });
      const count =
        recipes[recipe].type === "vegan" ? veganCount : nonVeganCount;
      console.log({ count });
      const mealIngredients = Object.keys(recipes[recipe].ingredients);
      console.log({ mealIngredients });
      mealIngredients.forEach((ingredient) => {
        if (obj[ingredient]) {
          obj[ingredient] =
            obj[ingredient] +
            recipes[recipe].ingredients[ingredient][season] * Number(count);
        } else {
          obj[ingredient] =
            recipes[recipe].ingredients[ingredient][season] * Number(count);
        }
      });
    });
    console.log({ obj });
    return obj;
  };

  console.log({ dropdowns });

  const getDropdownsForAMeal = ({ date, meal }) => {
    const cell = [];
    for (let i = 0; i <= (dropdowns[`${date}-${meal}`] || 1); i++) {
      cell.push(
        <div>
          <select
            selected={mealPlan[`${date}-${meal}`] || "Select Recipe"}
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
          <button
            onClick={() => {
              if (dropdowns[`${date}-${meal}`]) {
                setDropdowns({
                  ...dropdowns,
                  [`${date}-${meal}`]: dropdowns[`${date}-${meal}`] + 1,
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
        </div>
      );
    }

    return cell;
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
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
          <div>
            <select
              selected={season}
              onChange={(e) => setSeason(e.target.value)}
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

      <div style={{ width: "50%" }}>
        {showPurchaseOrder &&
          Object.keys(purchaseOrder).map((ingredient) => {
            return (
              <div>
                {`${ingredient} - ${purchaseOrder[ingredient].toFixed(4)} ${
                  ingredients[ingredient].purchaseUnit
                }`}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Homepage;
