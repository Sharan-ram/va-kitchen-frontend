import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import DatePicker from "react-date-picker";
import { getDate } from "date-fns";
import ingredients from "../ingredients.json";
import { generateDaysOfMonth } from "@/helpers/utils";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import { usePDF } from "react-to-pdf";
import UpdateRecipeModal from "@/components/UpdateRecipeModal";
import PurchaseOrderModal from "@/components/PurchaseOrderModal";
import IngredientsPerRecipePerMeal from "@/components/IngredientsPerRecipePerMeal";

const Mealplan = () => {
  const [mealPlan, setMealPlan] = useState();
  const [veganCount, setVeganCount] = useState();
  const [nonVeganCount, setNonVeganCount] = useState();
  const [season, setSeason] = useState();
  const [purchaseOrder, setPurchaseOrder] = useState();
  const [showPurchaseOrder, togglePurchaseOrder] = useState(false);
  const [recipes, setRecipes] = useState();
  const [startDate, changeStartDate] = useState(new Date());
  const [endDate, changeEndDate] = useState(new Date());

  const [showMealPlan, toggleMealPlan] = useState(false);

  const [showModal, toggleModal] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState();
  const [showIngredientList, setShowIngredientList] = useState(false);

  useEffect(() => {
    if (window) {
      setMealPlan(JSON.parse(localStorage.getItem("mealPlan")));
      setVeganCount(Number(JSON.parse(localStorage.getItem("veganCount"))));
      setNonVeganCount(
        Number(JSON.parse(localStorage.getItem("nonVeganCount")))
      );
      setSeason(JSON.parse(localStorage.getItem("season")));
      setRecipes(JSON.parse(localStorage.getItem("tempRecipes")));
    }
  }, []);

  const startDateNumber = getDate(startDate);
  const endDateNumber = getDate(endDate);
  const currentDate = new Date(); // Use the current date or any other date
  const daysOfMonth = generateDaysOfMonth(currentDate);

  const { toPDF, targetRef } = usePDF({ filename: "purchase-order.pdf" });

  const meals = ["Breakfast", "Lunch", "Dinner"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const filterMealPlanForDateRange = (mealPlan) => {
    return Object.keys(mealPlan || []).filter((meal) => {
      const mealDateNumber = Number(meal.split("-")[0]);
      if (mealDateNumber >= startDateNumber && mealDateNumber <= endDateNumber)
        return true;
      return false;
    });
  };

  const filteredMealPlan = filterMealPlanForDateRange(mealPlan);

  const getPurchaseOrder = () => {
    const obj = {};
    filteredMealPlan.forEach((meal) => {
      mealPlan[meal].forEach((recipe) => {
        const count =
          recipes[recipe].type === "vegan" ? veganCount : nonVeganCount;
        const mealIngredients = Object.keys(recipes[recipe].ingredients);
        mealIngredients.forEach((ingredient) => {
          if (obj[ingredient]) {
            obj[ingredient] =
              Number(obj[ingredient]) +
              Number(recipes[recipe].ingredients[ingredient][season]) *
                Number(count);
          } else {
            obj[ingredient] =
              Number(recipes[recipe].ingredients[ingredient][season]) *
              Number(count);
          }
        });
      });
    });
    return obj;
  };

  const generateOrder = () => {
    const purchaseOrder = getPurchaseOrder();
    const obj = { provisions: {}, consumables: {} };
    Object.keys(purchaseOrder).forEach((ingredient) => {
      if (
        ingredients[ingredient].storageType.toLowerCase().includes("provisions")
      ) {
        obj.provisions[ingredient] = Number(purchaseOrder[ingredient]);
      } else {
        obj.consumables[ingredient] = Number(purchaseOrder[ingredient]);
      }
    });
    setPurchaseOrder(obj);
    togglePurchaseOrder(true);
    toPDF();
  };

  return (
    <div>
      <div className="flex justify-between w-9/12 items-center">
        <div>
          <div>
            <p className="font-semibold">Select Start Date</p>
          </div>
          <DatePicker
            value={startDate}
            onChange={(date) => {
              toggleMealPlan(false);
              togglePurchaseOrder(false);
              changeStartDate(date);
            }}
          />
        </div>
        <div>
          <div>
            <p className="font-semibold">Select End Date</p>
          </div>
          <DatePicker
            value={endDate}
            onChange={(date) => {
              toggleMealPlan(false);
              togglePurchaseOrder(false);
              changeEndDate(date);
            }}
          />
        </div>
        {/* <div>
          <div>
            <p className="font-semibold">Vegan Count</p>
          </div>
          <Input
            type="text"
            textInputProps={{
              placeholder: "Select Vegan Count",
              value: veganCount,
              disabled: true,
            }}
          />
        </div>
        <div>
          <div>
            <p className="font-semibold">Non-vegan count</p>
          </div>
          <Input
            type="text"
            textInputProps={{
              placeholder: "Select Non Vegan Count",
              value: nonVeganCount,
              disabled: true,
            }}
          />
        </div> */}
        <div>
          <button
            onClick={() => toggleMealPlan(true)}
            className="bg-[#666666] text-white px-4 py-2 rounded-[5px]"
          >
            Select date range
          </button>
        </div>
      </div>
      {showMealPlan && (
        <>
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
                        <td className="border-r border-r-black font-bold text-lg p-4">{`${date}, ${weekDays[dayName]}`}</td>
                        {meals.map((meal) => {
                          return (
                            <td
                              className="border-r border-r-black p-4"
                              key={`${date}-${meal}`}
                            >
                              {/* {getDropdownsForAMeal({ date, meal })} */}
                              {mealPlan[`${date}-${meal}`]?.map(
                                (recipe, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="cursor-pointer rounded p-2 mb-2 bg-[#E8E3E4]"
                                      onClick={() => {
                                        setActiveRecipe(recipe);
                                        toggleModal(true);
                                      }}
                                    >
                                      {recipe}
                                    </div>
                                  );
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
            <div className="flex mt-6">
              <div>
                <button
                  className="bg-[#666666] text-white px-4 py-2 rounded-[5px]"
                  onClick={() => setShowIngredientList(true)}
                >
                  Show ingredient list
                </button>
              </div>
              <div className="ml-4">
                <button
                  className="bg-[#666666] text-white px-4 py-2 rounded-[5px]"
                  onClick={generateOrder}
                >
                  Show Purchase order
                </button>
              </div>
            </div>
          </div>
          <div className="w-full">
            {showIngredientList && (
              <div className="mt-6">
                <IngredientsPerRecipePerMeal
                  mealPlan={mealPlan}
                  filteredMealPlan={filteredMealPlan}
                  recipes={recipes}
                  ingredients={ingredients}
                  season={season}
                  veganCount={veganCount}
                  nonVeganCount={nonVeganCount}
                />
              </div>
            )}
          </div>
        </>
      )}
      {showModal && (
        <div>
          <UpdateRecipeModal
            activeRecipe={activeRecipe}
            recipes={recipes}
            setRecipes={setRecipes}
            toggleModal={toggleModal}
            setActiveRecipe={setActiveRecipe}
            season={season}
            ingredients={ingredients}
          />
        </div>
      )}
      {showPurchaseOrder && (
        <PurchaseOrderModal
          targetRef={targetRef}
          togglePurchaseOrder={togglePurchaseOrder}
          purchaseOrder={purchaseOrder}
          ingredients={ingredients}
          toPDF={toPDF}
        />
      )}
    </div>
  );
};

export default Mealplan;
