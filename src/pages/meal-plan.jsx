import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import DatePicker from "react-date-picker";
import { getDate } from "date-fns";
import ingredients from "../ingredients.json";
import { generateDaysOfMonth } from "@/helpers/utils";
import Modal from "@/components/Modal";
import Input from "@/components/Input";

const Mealplan = () => {
  const [mealPlan, setMealPlan] = useState();
  const [veganCount, setVeganCount] = useState();
  const [nonVeganCount, setNonVeganCount] = useState();
  const [season, setSeason] = useState();
  const [purchaseOrder, setPurchaseOrder] = useState();
  const [showPurchaseOrder, togglePurchaseOrder] = useState(false);
  const [recipes, setRecipes] = useState();

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

  const [startDate, changeStartDate] = useState(new Date());
  const [endDate, changeEndDate] = useState(new Date());

  const [showMealPlan, toggleMealPlan] = useState(false);

  const [showModal, toggleModal] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState();
  const [addIngredientCount, setIngredientCount] = useState(0);
  const [dropdownIngredient, setDropdownIngredient] = useState([]);
  const [ingredientQuantity, setIngredientQuantity] = useState([]);

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

  console.log({ recipes, dropdownIngredient, ingredientQuantity });

  const renderAddIngredientDropdown = () => {
    const arr = [];
    for (let i = 0; i < addIngredientCount; i++) {
      arr.push(
        <div className="w-full flex items-center mb-2">
          <div className="w-[40%]">
            <select
              onChange={(e) => {
                const newDropdownIngredient = dropdownIngredient.slice();
                newDropdownIngredient[i] = e.target.value;
                setDropdownIngredient(newDropdownIngredient);
              }}
              selected={
                (dropdownIngredient && dropdownIngredient[i]) ||
                "Select Ingredient"
              }
              className="rounded-md border border-black pl-2 w-full"
            >
              <option value="Select Ingredient">Select Ingredient</option>
              {Object.keys(ingredients).map((ingredient) => {
                return <option value={ingredient}>{ingredient}</option>;
              })}
            </select>
          </div>
          <div className="w-[40%] pl-2">
            <Input
              value={ingredientQuantity[i]}
              onChange={(e) => {
                const newIngredientQuantity = ingredientQuantity.slice();
                newIngredientQuantity[i] = Number(e.target.value);
                setIngredientQuantity(newIngredientQuantity);
              }}
            />
          </div>
        </div>
      );
    }
    return arr;
  };

  console.log({ recipes });

  return (
    <div>
      <div className="flex justify-between w-9/12 items-center">
        <div>
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
          <DatePicker
            value={endDate}
            onChange={(date) => {
              toggleMealPlan(false);
              togglePurchaseOrder(false);
              changeEndDate(date);
            }}
          />
        </div>
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
            <button
              className="bg-[#999999] text-white rounded px-4 py-2 mt-6"
              onClick={generateOrder}
            >
              Generate order
            </button>
          </div>
          <div style={{ width: "50%" }}>
            {showPurchaseOrder && (
              <div>
                {/* Each ingredient */}
                <h3>Ingredient list for each recipe of a meal</h3>
                {filterMealPlanForDateRange(mealPlan).map((meal) => {
                  return (
                    <div>
                      {mealPlan[meal].map((recipe) => {
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
      {showModal && (
        <div>
          <Modal closeModal={() => toggleModal(false)}>
            <div>
              <p className="font-bold text-xl mb-6">{activeRecipe}</p>
              {Object.keys(recipes[activeRecipe].ingredients).map(
                (ingredient) => {
                  console.log(
                    "val",
                    recipes[activeRecipe].ingredients[ingredient][season]
                  );
                  return (
                    <div
                      key={ingredient}
                      className="flex items-center mb-2 w-full"
                    >
                      <div className="w-[40%]">
                        <p className="font-semibold">{ingredient}</p>
                      </div>
                      <div className="pl-2 w-[40%]">
                        <Input
                          textInputProps={{
                            value:
                              recipes[activeRecipe].ingredients[ingredient][
                                season
                              ],
                            onChange: (e) => {
                              const newRecipesData = {
                                ...recipes,
                                [activeRecipe]: {
                                  ...recipes[activeRecipe],
                                  ingredients: {
                                    ...recipes[activeRecipe].ingredients,
                                    [ingredient]: {
                                      ...recipes[activeRecipe].ingredients[
                                        ingredient
                                      ],
                                      [season]: Number(e.target.value),
                                    },
                                  },
                                },
                              };
                              setRecipes(newRecipesData);
                            },
                          }}
                        />
                      </div>
                      <div className="pl-1 w-[20%]">
                        {ingredients[ingredient].cookingUnit}
                      </div>
                    </div>
                  );
                }
              )}
              {renderAddIngredientDropdown()}
              <div>
                <button
                  onClick={() => {
                    setIngredientCount(addIngredientCount + 1);
                  }}
                  className="bg-[#999999] text-white w-10 rounded mt-2"
                >
                  +
                </button>
              </div>
              <div className="w-full text-center mt-6">
                <button
                  className="bg-[#999999] text-white px-4 py-2 rounded"
                  onClick={() => {
                    let newRecipes = { ...recipes };
                    dropdownIngredient.forEach((ingredient, index) => {
                      console.log({ ingredient });
                      const updatedRecipe = {
                        ...newRecipes[activeRecipe],
                        ingredients: {
                          ...newRecipes[activeRecipe].ingredients,
                          [ingredient]: {
                            ...newRecipes[activeRecipe].ingredients[ingredient],
                            [season]: ingredientQuantity[index],
                          },
                        },
                      };

                      // Update the newRecipes object with the updated recipe
                      newRecipes = {
                        ...newRecipes,
                        [activeRecipe]: updatedRecipe,
                      };
                      console.log({ newRecipes });
                    });
                    setRecipes(newRecipes);
                    setIngredientCount(0);
                    setDropdownIngredient([]);
                    setIngredientQuantity([]);
                    setActiveRecipe();
                    toggleModal(false);
                    localStorage.setItem(
                      "tempRecipes",
                      JSON.stringify(newRecipes)
                    );
                    setIngredientCount(0);
                  }}
                >
                  Update recipe ingredients
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Mealplan;
