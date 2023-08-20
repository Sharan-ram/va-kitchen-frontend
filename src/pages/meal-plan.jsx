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

  const meals = ["Breakfast", "Lunch", "Dinner"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const filterMealPlanForDateRange = (mealPlan) => {
    return Object.keys(mealPlan).filter((meal) => {
      const mealDateNumber = Number(meal.split("-")[0]);
      if (mealDateNumber >= startDateNumber && mealDateNumber <= endDateNumber)
        return true;
      return false;
    });
  };

  const getPurchaseOrder = () => {
    const obj = {};
    filterMealPlanForDateRange(mealPlan).forEach((meal) => {
      mealPlan[meal].forEach((recipe) => {
        const count =
          recipes[recipe].type === "vegan" ? veganCount : nonVeganCount;
        const mealIngredients = Object.keys(recipes[recipe].ingredients);
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
    return obj;
  };

  console.log({ mealPlan });

  const generateOrder = () => {
    const purchaseOrder = getPurchaseOrder();
    const obj = { provisions: {}, consumables: {} };
    Object.keys(purchaseOrder).forEach((ingredient) => {
      if (
        ingredients[ingredient].storageType.toLowerCase().includes("provisions")
      ) {
        obj.provisions[ingredient] = purchaseOrder[ingredient];
      } else {
        obj.consumables[ingredient] = purchaseOrder[ingredient];
      }
    });
    setPurchaseOrder(obj);
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
            {showPurchaseOrder && (
              <div>
                {/* Each ingredient */}
                <h3>Ingredient list for each recipe of a meal</h3>
                {filterMealPlanForDateRange(mealPlan).map((meal) => {
                  return (
                    <div>
                      {mealPlan[meal].map((recipe, mealIndex) => {
                        const ingredientsArr =
                          Object.keys(recipes[recipe]?.ingredients) || [];
                        return (
                          <>
                            <div>
                              {ingredientsArr.map((ingredient) => {
                                return (
                                  <div style={{ display: "flex" }}>
                                    <div style={{ padding: "0px 20px" }}>{`${
                                      meal.split("-")[0]
                                    }`}</div>
                                    <div style={{ padding: "0px 20px" }}>{`${
                                      meal.split("-")[1]
                                    }`}</div>
                                    <div style={{ padding: "0px 20px" }}>
                                      {recipe}
                                    </div>
                                    <div style={{ padding: "0px 20px" }}>
                                      {ingredient}
                                    </div>
                                    <div style={{ padding: "0px 20px" }}>
                                      {`${(
                                        recipes[recipe].ingredients[ingredient][
                                          season
                                        ] *
                                        (recipes[recipe].type === "nonVegan"
                                          ? nonVeganCount
                                          : veganCount)
                                      ).toFixed(2)} ${
                                        ingredients[ingredient].cookingUnit
                                      }`}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{ height: "25px" }} />
                          </>
                        );
                      })}
                    </div>
                  );
                })}

                <h3>Provisions</h3>
                {Object.keys(purchaseOrder.provisions).map((ingredient) => {
                  return (
                    <p>{`${ingredient} - ${purchaseOrder.provisions[
                      ingredient
                    ].toFixed(4)} ${ingredients[ingredient].purchaseUnit}`}</p>
                  );
                })}
                <h3>Consumables</h3>

                {Object.keys(purchaseOrder.consumables).map((ingredient) => {
                  return (
                    <p>
                      {`${ingredient} - ${purchaseOrder.consumables[
                        ingredient
                      ].toFixed(4)} ${
                        ingredients[ingredient].purchaseUnit
                      }`}{" "}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Mealplan;
