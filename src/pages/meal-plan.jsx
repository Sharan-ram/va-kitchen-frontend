import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import DatePicker from "react-date-picker";
import { getDate } from "date-fns";
import recipes from "../recipes.json";
import ingredients from "../ingredients.json";
import { generateDaysOfMonth } from "@/helpers/utils";

const Mealplan = () => {
  const [mealPlan, setMealPlan] = useState();
  const [veganCount, setVeganCount] = useState();
  const [nonVeganCount, setNonVeganCount] = useState();
  const [season, setSeason] = useState();
  const [purchaseOrder, setPurchaseOrder] = useState();
  const [showPurchaseOrder, togglePurchaseOrder] = useState(false);

  useEffect(() => {
    if (window) {
      setMealPlan(JSON.parse(localStorage.getItem("mealPlan")));
      setVeganCount(Number(JSON.parse(localStorage.getItem("veganCount"))));
      setNonVeganCount(
        Number(JSON.parse(localStorage.getItem("nonVeganCount")))
      );
      setSeason(JSON.parse(localStorage.getItem("season")));
    }
  }, []);

  const [startDate, changeStartDate] = useState(new Date());
  const [endDate, changeEndDate] = useState(new Date());

  const [showMealPlan, toggleMealPlan] = useState(false);

  const startDateNumber = getDate(startDate);
  const endDateNumber = getDate(endDate);
  const currentDate = new Date(); // Use the current date or any other date
  const daysOfMonth = generateDaysOfMonth(currentDate);

  console.log({
    mealPlan,
    veganCount,
    nonVeganCount,
    season,
    startDateNumber,
    endDateNumber,
    daysOfMonth,
  });

  const meals = ["Breakfast", "Lunch", "Dinner"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getPurchaseOrder = () => {
    const obj = {};
    Object.keys(mealPlan).forEach((meal) => {
      mealPlan[meal]
        .filter((recipe) => {
          if (recipe) return true;
          return false;
        })
        .forEach((recipe) => {
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
    });
    console.log({ obj });
    return obj;
  };

  const generateOrder = () => {
    const purchaseOrder = getPurchaseOrder();
    setPurchaseOrder(purchaseOrder);
    togglePurchaseOrder(true);
  };

  return (
    <div>
      <DatePicker
        value={startDate}
        onChange={(date) => {
          toggleMealPlan(false);
          togglePurchaseOrder(false);
          changeStartDate(date);
        }}
      />
      <DatePicker
        value={endDate}
        onChange={(date) => {
          toggleMealPlan(false);
          togglePurchaseOrder(false);
          changeEndDate(date);
        }}
      />
      <button onClick={() => toggleMealPlan(true)}>Select date range</button>

      {showMealPlan && (
        <>
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
                {daysOfMonth
                  .filter((day) => {
                    const dateNumber = Number(day.getDate());
                    if (
                      Number(dateNumber) >= startDateNumber &&
                      Number(dateNumber) <= endDateNumber
                    ) {
                      return true;
                    }
                    return false;
                  })
                  .map((day, index) => {
                    const date = day.getDate();
                    const dayName = day.getDay();
                    return (
                      <tr className="border border-black" key={day}>
                        <td>{`${date}, ${weekDays[dayName]}`}</td>
                        {meals.map((meal) => {
                          return (
                            <td key={`${date}-${meal}`}>
                              {/* {getDropdownsForAMeal({ date, meal })} */}
                              {mealPlan[`${date}-${meal}`]?.map(
                                (recipe, index) => {
                                  return <div>{recipe}</div>;
                                }
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <button onClick={generateOrder}>Generate order</button>
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
        </>
      )}
    </div>
  );
};

export default Mealplan;
